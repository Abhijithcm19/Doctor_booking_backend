import mongoose from "mongoose";
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const passwordComplexity = require("joi-password-complexity")

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  role: {
    type: String,
    enum: ["patient", "admin"],
    default: "patient",
  },
  gender: { type: String, enum: ["male", "female", "other"] },
  bloodType: { type: String },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});

userSchema.methods.generateAuthTocken = function (){
  const token = jwt.sign({_id: this._id},process.env.JWTPRIVATEKEY,{expiresIn:"7d"})
  return token
}

const User =mongoose.model("user,userSchema")

const validate = (data)=>{
  const Schema =Joi.object({

  })
}