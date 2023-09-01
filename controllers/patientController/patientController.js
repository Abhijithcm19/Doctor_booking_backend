import UserModel from '../../models/UserSchema.js'
import DoctorModel from '../../models/DoctorSchema.js';
import Auth from'../../middleware/auth.js'
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
        const { name, password, profile, email, role, gender, specialization } = req.body;

        // Check for existing user with the same username
        const existingUsername = await UserModel.findOne({ name });
        if (existingUsername) {
            return res.status(400).send({ error: "Please use a unique username" });
        }

        // Check for existing user with the same email
        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).send({ error: "Please use a unique email" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user based on role and save it to the database
        let savedUser;
        if (role === "patient" || role === "admin") {
            const user = new UserModel({
                name,
                password: hashedPassword,
                profile: profile || '',
                email,
                role,
                gender
            });
            savedUser = await user.save();
        } else if (role === "doctor") {
            const doctor = new DoctorModel({
                name,
                password: hashedPassword,
                profile: profile || '',
                email,
                role,
                gender
                // You can add more doctor-specific fields here
            });
            savedUser = await doctor.save();
        } else {
            return res.status(400).send({ error: "Invalid role" });
        }

        return res.status(200).send({ msg: "User Register Successfully", user: savedUser });
    } catch (error) {
        console.error("Error during registration:", error);
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
  
    
  


export async function generateOTP (req,res){
req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars:false})
res.status(201).send({code:req.app.locals.OTP})
}


export async function verifyOTP (req,res){
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
