import BookingModel from "../../models/BookingSchema.js";
import DoctorModel from "../../models/DoctorSchema.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import moment from "moment";
dotenv.config();

export const createOrder = async (req, res) => {
  console.log("createorder",req.body);
  try {
    const razorpay = new Razorpay({
      key_id: process.env.KEY,
      key_secret: process.env.SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
};

export const verifyPayment = async (req, res) => {
  console.log("verifypayment",req.body);
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user,
      doctor,
      amount,
      startTime,
      date,
    } = req.body;

    const momentStartTime = moment(startTime, "HH:mm");

    const momentEndTime = momentStartTime.clone().add(30, "minutes");

    const formattedStartTime = momentStartTime.toISOString();
    const formattedEndTime = momentEndTime.toISOString();

    const formattedDate = new Date(date);
    const sha = crypto.createHmac("sha256", process.env.SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    const isAuth = digest === razorpay_signature;

    if (!isAuth) {
      return res.status(400).json({ msg: "Transaction is not legit!" });
    }

    await BookingModel.create({
      user,
      doctor,
      ticketPrice: amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      timeSlots: [
        {
          startTime: formattedStartTime,
          endTime: formattedEndTime,
        },
      ],
      appointmentDate: formattedDate,
    });

    res.json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error verifying payment" });
  }
};

export const getAvailableSlot = async (req, res) => {
  try {
    const { doctorId, startTime, date } = req.body;

    const doctor = await DoctorModel.findById(doctorId).lean().exec();
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const momentStartTime = moment(startTime, "HH:mm");
    const momentEndTime = momentStartTime.clone().add(30, "minutes");
    const formattedStartTime = momentStartTime.toISOString();
    const formattedEndTime = momentEndTime.toISOString();
    const formattedDate = new Date(date);

    const bookedSlots = await BookingModel.find({
      doctor: doctorId,
      appointmentDate: formattedDate,
      $or: [
        {
          $and: [
            { "timeSlots.startTime": { $lte: formattedStartTime } },
            { "timeSlots.endTime": { $gt: formattedStartTime } },
          ],
        },
        {
          $and: [
            { "timeSlots.startTime": { $lt: formattedEndTime } },
            { "timeSlots.endTime": { $gte: formattedEndTime } },
          ],
        },
      ],
    });

    const availableSlots = doctor.timeSlots.filter((slot) => {
      const isBooked = bookedSlots.some((booking) => {
        return (
          moment(slot.startTime, "HH:mm").isSameOrAfter(startTime) &&
          moment(slot.endTime, "HH:mm").isSameOrBefore(momentEndTime)
        );
      });
      return !isBooked;
    });

    if (availableSlots.length > 0) {
      res.json({ message: "Available slots found", availableSlots });
    } else {
      res.json({ message: "No available slots" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finding available slots" });
  }
};
