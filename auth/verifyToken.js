import jwt from 'jsonwebtoken';
import UserModel from '../models/UserSchema.js';
import DoctorModel from '../models/DoctorSchema.js';
import dotenv from 'dotenv';
dotenv.config();

export const authenticate = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  const token = authToken.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Here, you might want to validate the user's identity based on the token
    // and fetch user information, if needed.

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export const restrict = (roles) => (req, res, next) => {
  const userRole = req.role;

  if (!roles.includes(userRole)) {
    return res.status(403).json({ success: false, message: "You're not authorized" });
  }

  next();
};


// Middleware for authenticating user tokens
// export const authenticate = (req, res, next) => {
//   const authToken = req.headers.authorization;

//   if (!authToken || !authToken.startsWith("Bearer ")) {
//     return res.status(401).json({ success: false, message: "No token, authorization denied" });
//   }

//   const token = authToken.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Here, you might want to validate the user's identity based on the token
//     // and fetch user information, if needed.

//     req.userId = decoded.id;
//     req.role = decoded.role;

//     next();
//   } catch (error) {
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token expired' });
//     }
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };

// export const restrict = roles => async (req, res, next) => {
//   // Ensure that req.userId is correctly set by the authenticate middleware
//   const userId = req.userId;
//   console.log("User id:", userId);

//   if (!userId) {
//     return res.status(401).json({ success: false, message: "User ID not found" });
//   }

//   try {
//     let user;

//     // Find the user based on the userId
//     const patient = await UserModel.findById(userId);
//     const doctor = await DoctorModel.findById(userId);

//     // Determine the user type (doctor or patient)
//     if (patient) {
//       user = patient;
//     } else if (doctor) {
//       user = doctor;
//     } else {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }

//     // Log the user's role
//     console.log("User Role:", user.role);

//     if (!user || !user.role) {
//       return res.status(401).json({ success: false, message: "User role not found" });
//     }

//     // Check if the user has the required role
//     if (!roles.includes(user.role)) {
//       return res.status(401).json({ success: false, message: "You're not authorized" });
//     }

//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };


// export const restrict = roles => async (req, res, next) => {
//   const userId = req.userId;

//   try {
//     // Attempt to find the user by ID in UserModel
//     const user = await UserModel.findById(userId);

//     // If the user is not found in UserModel, try to find in DoctorModel
//     if (!user) {
//       const doctor = await DoctorModel.findById(userId);
//       if (doctor) {
//         user = doctor;
//       }
//     }

//     if (!user || !user.role) {
//       return res.status(401).json({ success: false, message: "You're not authorized" });
//     }

//     if (!roles.includes(user.role)) {
//       return res.status(401).json({ success: false, message: "You're not authorized" });
//     }

//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
