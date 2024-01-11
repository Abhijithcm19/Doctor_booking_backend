import mongoose from "mongoose";
import Services from "./ServiceSchema.js";

const DoctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  ticketPrice: { type: Number },
  role: { type: String },

  // Fields for doctors only

  specialization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  bio: { type: String, maxLength: 50 },
  about: { type: String },

  // Qualifications array
  qualifications: [
    {
      startingDate: { type: Date },
      endDate: { type: Date },
      degree: { type: String },
      university: { type: String },
    },
  ],

  // Experiences array
  experiences: [
    {
      startingDate: { type: Date },
      endDate: { type: Date },
      position: { type: String },
      hospital: { type: String },
      year: { type: String },
    },
  ],

  // Time slots array
  timeSlots: [
    {
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],

  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 },
  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
  isBlocked: { type: Boolean, required: true, default: false },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});

export default mongoose.model("Doctor", DoctorSchema);
