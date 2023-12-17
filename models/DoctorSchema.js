import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  ticketPrice: { type: Number },
  role: { type: String },

  // Fields for doctors only
  specialization: { type: String },
  bio: { type: String, maxLength: 50 },
  about: { type: String },
  
  // Qualifications array
  qualifications: [{
    startingDate: { type: Date },
    endDate: { type: Date },
    degree: { type: String },
    university: { type: String },
  }],

  // Experiences array
  experiences: [{
    startingDate: { type: Date },
    endDate: { type: Date },
    position: { type: String },
    hospital: { type: String },
    year: { type: String },
  }],

  // Time slots array (assuming it stores time slot objects)
  timeSlots: [{
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  }],

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
  serviceName: {
    type: String,
    required: true,
    unique: true 
},
serviceDiscription:{
    type: String,
    required: true,
    unique: true 
},
serviceIBlocked:{
    type:Boolean,
    default:false,
 }
});


export default mongoose.model("Doctor", DoctorSchema);
