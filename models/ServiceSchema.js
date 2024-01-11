import mongoose from "mongoose";
const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  discription: {
    type: String,
    required: true,
    unique: true,
  },
  iBlocked: {
    type: Boolean,
    default: false,
    default: true,
  },
});

export default mongoose.model("Service", ServiceSchema);
