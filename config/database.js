// Database connection (MONGOURL: Atlas in production, local in dev)

import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const connectionString =
      process.env.MONGOURL || "mongodb://127.0.0.1:27017/Booking_App";

    await mongoose.connect(connectionString);

    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDatabase;
