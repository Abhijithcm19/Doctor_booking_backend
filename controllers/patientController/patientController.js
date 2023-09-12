import UserModel from '../../models/UserSchema.js'
import DoctorModel from '../../models/DoctorSchema.js';
import Auth from'../../middleware/auth.js'
import { sendOtpEmail, registerMail } from '../../helpers/mailer.js';
import bcrypt from'bcrypt'
import jwt  from 'jsonwebtoken';
import otpGenerator from'otp-generator'
import dotenv from 'dotenv'
dotenv.config()


/*middleware for verify user */
export async function verifyUser(req,res,next){
  try {

    const {email} = req.method == "GET" ? req.query : req.body;

    // check the user existance
    let exist = await UserModel.findOne({email})
    if(!exist) return res.status(404).send({ error: "Cantfind User"})
    next()
    
  } catch (error) {
    return res.status(404).send({error: "Authentication Error"})
  }
}



export async function register(req, res) {
  try {
    const { name, password, profile, email, role, gender } = req.body;

    // Create a registration data object
    const registrationData = {
      name,
      // Hash the password before saving it
      password: await bcrypt.hash(password, 10), // You can adjust the saltRounds (10) as needed
      profile,
      email,
      role,
      gender,
    };

    // Store registrationData in req.app.locals
    req.app.locals.registrationData = registrationData;

    // Check if the given username or email already exists, depending on the role
    const existingUser = role === "patient"
      ? await UserModel.findOne({ $or: [{ name }, { email }] })
      : await DoctorModel.findOne({ $or: [{ name }, { email }] });

    if (existingUser) {
      return res.status(400).send({ error: "Please use a unique username and email" });
    }

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

    // Create a new user document and save it
    const newUser = new UserModel(registrationData);
    await newUser.save();

    return res.status(200).send({ msg: "OTP verified successfully and user registered" });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}


  export async function login(req, res) {
    const { email, password } = req.body;
    try {
      // Find the user by username
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).send({ error: "Username not found" });
      }
  
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(400).send({ error: "Password does not match" });
      }
  
      // Create a JWT token
      const token = jwt.sign({
        userId: user._id,
        email: user.email
      },process.env.JWT_SECRET, { expiresIn: "24h" });
  
      return res.status(200).send({
        msg: "Login Successful",
        email: user.email,
        token
      });
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  }


  export async function getUser(req, res) {
    const { name } = req.params;
    try {
      if (!name) {
        return res.status(400).send({ error: "Invalid Username" });
      }
  
      const user = await UserModel.findOne({ name }).exec();
  
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
  
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  }


  

  export async function updateUser(req, res) {
    try {
      // const id = req.query.id;

      const {userId} = req.user
  
      if (userId) {
        const body = req.body;
  
        // Update the data using await
        const updateResult = await UserModel.updateOne({ _id: userId }, body);
  
        if (updateResult.nModified === 1) {
          return res.status(200).send({ msg: "Record Updated...!" });
        } else {
          return res.status(200).send({ msg: "Record  modified" });
        }
      } else {
        return res.status(401).send({ error: "User not Found...!" });
      }
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  }
  
    
  


// export async function generateOTP (req,res){
// req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars:false})
// res.status(201).send({code:req.app.locals.OTP})
// }


export async function verifyOtp (req,res){
const {code} = req.query
if(parseInt(req.app.locals.OTP)=== parseInt(code)){
  req.app.locals.OTP = null //rest the otp value
  req.app.locals.resetSession = true //start session for reset password
  return res.status(201).send({msg:'verify successfully'})
}
return res.status(400).send({error: "invalid OTP"})

}

export async function createResetSession (req,res){
if(req.app.locals.resetSession){
  req.app.locals.resetSession = false //allow access to this route only once
  return res.status(201).send({ msg : "access granted!"})
}
return res.status(440).send({error : "Session expired"})
}


export async function resetPassword(req, res) {
  try {
    if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired"})

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User email not found" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.updateOne({ email: user.email }, { password: hashedPassword });

      return res.status(201).send({ msg: "record updated" });
    } catch (error) {
      return res.status(500).send({ error: "Unable to hash password" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}
