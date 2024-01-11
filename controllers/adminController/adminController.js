import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../../models/UserSchema.js";
import DoctorModel from "../../models/DoctorSchema.js";
import asyncHandler from "express-async-handler";
import Service from "../../models/ServiceSchema.js";
import dotenv from "dotenv";
dotenv.config();

export async function adminLogin(req, res) {
  const { email, password } = req.body;

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log("Received email:", email);
    console.log("Received password:", password);

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign(
        {
          email: adminEmail,
          isAdmin: true,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).send({
        message: "Admin Login Successful",
        email: adminEmail,
        token,
      });
    } else {
      return res.status(401).send({ error: "Unauthorized" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
}

export const getAllUser = async (req, res) => {
  try {
    const getAllUser = await UserModel.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      AllUsers: getAllUser,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const blockAndUnblockUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    const message = user.isBlocked
      ? `${user.name} Blocked`
      : `${user.name} Unblocked`;

    return res.status(200).json({ message });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export async function getAllDoctor(req, res) {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await DoctorModel.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      });
    } else {
      doctors = await DoctorModel.find({});
    }

    if (doctors && doctors.length > 0) {
      res
        .status(200)
        .send({ success: true, msg: "Doctors Found...!", data: doctors });
    } else {
      res.status(404).send({ success: false, msg: "No doctors found...!" });
    }
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res
      .status(500)
      .send({ success: false, msg: "Failed to fetch doctors...!" });
  }
}

export const doctorApproval = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received request to toggle approval for doctor ID:", id);

    const doctor = await DoctorModel.findById(id);
    if (!doctor) {
      return res
        .status(404)
        .send({ success: false, msg: "Doctor not found..." });
    }

    const updatedStatus =
      doctor.isApproved === "approved" ? "cancelled" : "approved";
    doctor.isApproved = updatedStatus;
    await doctor.save();

    console.log("Doctor approval status updated:", doctor);
    res
      .status(200)
      .send({
        success: true,
        msg: "Doctor approval status updated!",
        data: doctor,
      });
  } catch (error) {
    console.error("Error toggling doctor approval status:", error);
    res
      .status(500)
      .send({
        success: false,
        msg: "Failed to update doctor approval status...",
      });
  }
};

export const userBockAndUnblock = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    console.log("User ID:", id);
    if (!user) {
      return res.status(404).send({ success: false, msg: "user not found..." });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: "User status toggled successfully",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, discription, isBlocked } = req.body;
    const newService = new Service({
      name,
      discription,
      isBlocked,
    });
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isBlocked } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, isBlocked },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndRemove(id);
    if (!deletedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
