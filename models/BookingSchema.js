import mongoose from "mongoose";
import Doctor from "./DoctorSchema.js";
import User from "./UserSchema.js";

const bookingSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketPrice: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "approved",
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
    },

    timeSlots: [
      {
        startTime: { type: String },
        endTime: { type: String },
      },
    ],
    dateOfPayment: {
      type: Date,
      default: Date,
    },
    appointmentDate: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
