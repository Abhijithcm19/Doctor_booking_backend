import mongoose from "mongoose";
import UserModel from "../../models/UserSchema.js";
import BookingModel from "../../models/BookingSchema.js";
import DoctorModel from "../../models/DoctorSchema.js";
import ContactForm from "../../models/ContactSchema.js";

import dotenv from "dotenv";
dotenv.config();

export async function verifyUser(req, res, next) {
  try {
    const { email } = req.method == "GET" ? req.query : req.body;

    let exist = await UserModel.findOne({ email });
    if (!exist) return res.status(404).send({ error: "Cantfind User" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

export async function updateUser(req, res) {
  const id = req.params.id;
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res
      .status(200)
      .send({ success: true, msg: "Record Updated...!", data: updateUser });
  } catch (error) {
    res.status(500).send({ msg: "failed to Updated...!" });
  }
}

export async function deleteUser(req, res) {
  const id = req.params.id;
  try {
    await UserModel.findByIdAndDelete(id);

    res.status(200).send({ success: true, msg: "Record deleted...!" });
  } catch (error) {
    res.status(500).send({ msg: "failed to delete...!" });
  }
}

export async function getSingleUser(req, res) {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id).select("-password");

    res.status(200).send({ success: true, msg: "User Found...!", data: user });
  } catch (error) {
    res.status(404).send({ msg: "no user found...!" });
  }
}

export async function getAllUser(req, res) {
  try {
    const users = await UserModel.find({}).select("-password");

    if (users && users.length > 0) {
      res
        .status(200)
        .send({ success: true, msg: "Users Found...!", data: users });
    } else {
      res.status(404).send({ success: false, msg: "No users found...!" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: "Failed to fetch users...!" });
  }
}

export const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;
    res
      .status(200)
      .json({
        success: true,
        message: "Profile info is getting",
        data: { ...rest },
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong can't get" });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.params.userId;

    const bookings = await BookingModel.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctor",
          foreignField: "_id",
          as: "doctorDetails",
        },
      },
    ]);

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
};

export const getAllNotification = async (req, res) => {
  try {
    const user = await UserModel.findById({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updateUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in notfication",
      success: false,
      error,
    });
  }
};

export const submitContactForm = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    const newFormEntry = new ContactForm({
      email,
      subject,
      message,
    });
    await newFormEntry.save();

    res
      .status(201)
      .json({ success: true, message: "Form submitted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error submitting form" });
  }
};
