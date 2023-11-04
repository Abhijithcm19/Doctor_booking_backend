import jwt from 'jsonwebtoken';
import bcrypt from'bcrypt'
import UserModel from '../../models/UserSchema.js'
import DoctorModel from '../../models/DoctorSchema.js';
import asyncHandler from "express-async-handler";
import Service from '../../models/ServiceSchema.js';
import dotenv from 'dotenv'
dotenv.config()


  export async function adminLogin(req, res) {
    const { email, password } = req.body;
  
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
  
      console.log('Received email:', email);
      console.log('Received password:', password);
      
      // Rest of your code...
      if (email === adminEmail && password === adminPassword) {
        // Create a JWT token for the admin
        const token = jwt.sign(
          {
            email: adminEmail,
            isAdmin: true,
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
  
        return res.status(200).send({
          message: 'Admin Login Successful',
          email: adminEmail,
          token,
        });
      } else {
        return res.status(401).send({ error: 'Unauthorized' });
      }
    } catch (error) {
      return res.status(500).send({ error: 'Internal server error' });
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

    // Find the user by ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Toggle the isBlocked field
    user.isBlocked = !user.isBlocked;

    // Save the updated user
    await user.save();

    // Define a message based on the user's new blocked status
    const message = user.isBlocked
      ? `${user.name} Blocked`
      : `${user.name} Unblocked`;

    return res.status(200).json({ message });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getAllDoctor = async (req, res) => {
  try {
    const getAllDoctor = await DoctorModel.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      AllDoctors: getAllDoctor,
    });
  } catch (error) {
    console.log(error.message);
  }
};


export const blockAndUnblockDoctor = async (req, res) => {
  const doctorId = req.params.doctorId;

  

  try {
    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    doctor.isBlocked = !doctor.isBlocked; // Toggle the isBlocked field

    await doctor.save(); // Save the updated doctor

    const message = doctor.isBlocked
      ? `${doctor.name} Blocked`
      : `${doctor.name} Unblocked`;

    return res.status(200).json({ message }); // Return the appropriate message
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};





export const createService = async (req, res) => {
  try {
      const { name, isBlocked } = req.body;
      const newService = new Service({
          name,
          isBlocked
      });
      const savedService = await newService.save();
      res.status(201).json(savedService);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

// Get all services
export const getAllServices = async (req, res) => {
  try {
      const services = await Service.find();
      res.status(200).json(services);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Update a service by ID
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

// Delete a service by ID
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