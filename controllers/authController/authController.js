import UserModel from "../../models/UserSchema.js";
import DoctorModel from "../../models/DoctorSchema.js";
import { sendOtpEmail, registerMail } from "../../helpers/mailer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import dotenv from "dotenv";
dotenv.config();

export function generateToken(user) {
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );

  return token;
}

export async function login(req, res) {
  const { email } = req.body;

  try {
    let user = null;

    const patient = await UserModel.findOne({ email });
    const doctor = await DoctorModel.findOne({ email });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    if (!user) {
      return res.status(404).json({ message: "user not found " });
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);

    const { password, role, appointment, ...rest } = user._doc;

    res.status(200).json({
      status: true,
      message: "Successfully login",
      role,
      token,
      data: { ...rest },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "fail to login" });
  }
}

/////////////////////////////////////////////////////

export async function register(req, res) {
  try {
    const { name, password, photo, email, role, gender } = req.body;

    const existingUserPatient = await UserModel.findOne({
      $or: [{ name }, { email }],
    });
    const existingUserDoctor = await DoctorModel.findOne({
      $or: [{ name }, { email }],
    });

    if (role === "patient" && existingUserDoctor) {
      return res
        .status(400)
        .send({ error: "Email or username already exists as a doctor" });
    }

    if (role === "doctor" && existingUserPatient) {
      return res
        .status(400)
        .send({ error: "Email or username already exists as a patient" });
    }

    const registrationData = {
      name,
      password: await bcrypt.hash(password, 10),
      photo,
      email,
      role,
      gender,
    };

    req.app.locals.registrationData = registrationData;

    req.app.locals.OTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await sendOtpEmail(email, req.app.locals.OTP);
    console.log("OTP code:", req.app.locals.OTP);

    return res.status(200).send({ msg: "OTP sent to your email" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

export async function verifyOTP(req, res) {
  try {
    const { otp } = req.body;

    const storedOTP = req.app.locals.OTP;

    if (!storedOTP || storedOTP !== otp) {
      return res.status(400).send({ error: "Invalid OTP" });
    }

    req.app.locals.OTP = null;

    const registrationData = req.app.locals.registrationData;

    const { role } = registrationData;

    let newUser;
    if (role === "patient") {
      newUser = new UserModel(registrationData);
    } else if (role === "doctor") {
      newUser = new DoctorModel(registrationData);
    } else {
      return res.status(400).send({ error: "Invalid role" });
    }

    await newUser.save();

    return res
      .status(200)
      .send({ msg: "OTP verified successfully and user registered" });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

export async function resendOTP(req, res) {
  try {
    const email = req.body.email;

    const newOTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    req.app.locals.OTP = newOTP;

    await sendOtpEmail(email, newOTP);
    console.log("New OTP code sent:", newOTP);

    return res.status(200).send({ msg: "New OTP sent to your email" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp: ", otp);
    user.resetOTP = otp;
    user.resetOTPExpiration = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOtpEmail(email, otp);

    return res.status(200).send({ msg: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .send({ error: error.message || "Internal server error" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await UserModel.findOne({
      email,
      resetOTP: otp,
      resetOTPExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({ error: "Invalid or expired OTP" });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).send({ error: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = undefined;
    user.resetOTPExpiration = undefined;
    await user.save();

    return res.status(200).send({ msg: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}
