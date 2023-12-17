import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: [true, "email is require"], unique: true },
  password: { type: String, required: [true, "password is require"] },
  name: { type: String, required:  [true, "name is require"] },
  phone: { type: Number },
  photo: { type: String },
  role: {
    type: String,
    enum: ["patient", "admin"],
    default: "patient",
  },  
  profile: { type: String},

isBlocked:{
    type:Boolean,
    required:true,
    default:false
},
isVerified:{
  type:Boolean,
  required:true,
  default:false
},
  gender: { type: String, enum: ["male", "female", "other"] },
  bloodType: { type: String },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
  notification:{
    type: Array,
    default:[]
  },
  seennotification:{
    type: Array,
    default:[]
  },
},{timestamps: true});

export default mongoose.model.Users|| mongoose.model("User", UserSchema);
