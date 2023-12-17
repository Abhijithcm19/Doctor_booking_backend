import UserModel from '../../models/UserSchema.js'
import DoctorModel from '../../models/DoctorSchema.js';
import { sendOtpEmail, registerMail } from '../../helpers/mailer.js';
import bcrypt from'bcrypt'
import jwt  from 'jsonwebtoken';
import otpGenerator from'otp-generator'
import dotenv from 'dotenv';

dotenv.config()




// Generate a JWT token
export function generateToken(user) {
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15d' }
  );

  return token;
}


export async function login(req, res) {
  const { email } = req.body;

  try {
    let user = null
 
    const patient = await UserModel.findOne({email})
    const doctor = await DoctorModel.findOne({email})



    if (patient) {
     user= patient
    }
    if(doctor){
      user = doctor

    }

    if (!user) {
      return res.status(404).json({ message: 'user not found ' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ status:false, message: 'Invalid credentials' });
    }

    // Create a JWT token for authentication
    const token = generateToken(user)

    const {password,role,appointment, ...rest} = user._doc

    res.status(200).json({ status: true, message:"Successfully login" ,role ,token, data:{...rest} });
  } catch (err) {
    console.error(err);
    res.status(500).json({status:false, message: 'fail to login' });
  }
}

/////////////////////////////////////////////////////

export async function register(req, res) {

    try {
      const { name, password, photo, email, role, gender } = req.body;
  
      // Check if the given username or email already exists in either UserModel or DoctorModel
      const existingUserPatient = await UserModel.findOne({ $or: [{ name }, { email }] });
      const existingUserDoctor = await DoctorModel.findOne({ $or: [{ name }, { email }] });
      
      if (role === 'patient' && existingUserDoctor) {
        return res.status(400).send({ error: "Email or username already exists as a doctor" });
      }
      
      if (role === 'doctor' && existingUserPatient) { // Remove the extra space after 'doctor'
        return res.status(400).send({ error: "Email or username already exists as a patient" });
      }
  
      // Create a registration data object
      const registrationData = {
        name,
        // Hash the password before saving it
        password: await bcrypt.hash(password, 10), // You can adjust the saltRounds (10) as needed
        photo,
        email,
        role,
        gender,
      };
  
      // Store registrationData in req.app.locals
      req.app.locals.registrationData = registrationData;
  
      // Generate a 6-digit OTP
      req.app.locals.OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
  
      // Send the OTP via email
      await sendOtpEmail(email, req.app.locals.OTP);
      console.log('OTP code:', req.app.locals.OTP);
  
      // Respond immediately without waiting for OTP verification
      return res.status(200).send({ msg: "OTP sent to your email" });
  
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).send({ error: "Internal server error" });
    }
  }


  export async function verifyOTP(req, res) {
    try {
      const { otp } = req.body;
  
      // Check if the provided OTP matches the OTP stored in app.locals
      const storedOTP = req.app.locals.OTP;
  
      if (!storedOTP || storedOTP !== otp) {
        return res.status(400).send({ error: "Invalid OTP" });
      }
  
      // Clear the OTP from app.locals
      req.app.locals.OTP = null;
  
      // Retrieve the registration data from app.locals
      const registrationData = req.app.locals.registrationData;
  
      // Determine the role from the registration data
      const { role } = registrationData;
  
      // Create a new user document based on the role and save it
      let newUser;
      if (role === 'patient') {
        newUser = new UserModel(registrationData);
      } else if (role === 'doctor') {
        newUser = new DoctorModel(registrationData);
      } else {
        return res.status(400).send({ error: "Invalid role" });
      }
  
      await newUser.save();
  
      return res.status(200).send({ msg: "OTP verified successfully and user registered" });
    } catch (error) {
      console.error("Error during OTP verification:", error);
      return res.status(500).send({ error: "Internal server error" });
    }
  }
  
  
  