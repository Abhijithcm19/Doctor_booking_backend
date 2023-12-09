import BookingModel from "../../models/BookingSchema.js"
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const createOrder = async (req, res) => {
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
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user,
      doctor,
      amount,
      day,
      startTime,
      endTime,
      date
    } = req.body;

    console.log("verifyPaymenttttttttt", razorpay_order_id, razorpay_payment_id, razorpay_signature, amount,date);
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
      ticketPrice:amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      timeSlots: [{
        day: day,
        startTime: startTime,
        endTime: endTime,
      }],
      appointmentDate: formattedDate
    });

    res.json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};







