import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  email: String,
  subject: String,
  message: String,
});

export default mongoose.model("Contact", ContactSchema);
