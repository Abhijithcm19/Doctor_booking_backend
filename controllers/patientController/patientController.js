import UserModel from '../../models/UserSchema.js'
import BookingModel from '../../models/BookingSchema.js';
import DoctorModel from '../../models/DoctorSchema.js';

import bcrypt from'bcrypt'
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





  // export async function getUser(req, res) {
  //   const { name } = req.params;
  //   try {
  //     if (!name) {
  //       return res.status(400).send({ error: "Invalid Username" });
  //     }
  
  //     const user = await UserModel.findOne({ name }).exec();
  
  //     if (!user) {
  //       return res.status(404).send({ error: "User not found" });
  //     }
  
  //     return res.status(200).send(user);
  //   } catch (error) {
  //     return res.status(500).send({ error: "Internal server error" });
  //   }
  // }


  export async function updateUser(req, res){
    const id = req.params.id
    try {
      const updateUser = await UserModel.findByIdAndUpdate(id, {$set:req.body},{new:true})

      res.status(200).send({ success:true ,msg: "Record Updated...!",data:updateUser });
     
    } catch (error) {
      res.status(500).send({ msg: "failed to Updated...!" });
    }
  }

  export async function deleteUser(req, res){
    const id = req.params.id
    try {
       await UserModel.findByIdAndDelete(id)

      res.status(200).send({ success:true ,msg: "Record deleted...!" });
     
    } catch (error) {
      res.status(500).send({ msg: "failed to delete...!" });
    }
  }

  export async function getSingleUser(req, res){
    const id = req.params.id
    try {
      const user = await UserModel.findById(id).select("-password")

      res.status(200).send({ success:true ,msg: "User Found...!",data:user });
     
    } catch (error) {
      res.status(404).send({ msg: "no user found...!"});
    }
  }


  export async function getAllUser(req, res) {
    try {
      const users = await UserModel.find({}).select("-password");
  
      if (users && users.length > 0) {
        // Return the list of users if found
        res.status(200).send({ success: true, msg: "Users Found...!", data: users });
      } else {
        // Return a message if no users are found
        res.status(404).send({ success: false, msg: "No users found...!" });
      }
    } catch (error) {
      res.status(500).send({ success: false, msg: "Failed to fetch users...!" });
    }
  }
  // export async function updateUser(req, res) {
  //   try {
  //     // const id = req.query.id;

  //     const {userId} = req.user
  
  //     if (userId) {
  //       const body = req.body;
  
  //       // Update the data using await
  //       const updateResult = await UserModel.updateOne({ _id: userId }, body);
  
  //       if (updateResult.nModified === 1) {
  //         return res.status(200).send({ msg: "Record Updated...!" });
  //       } else {
  //         return res.status(200).send({ msg: "Record  modified" });
  //       }
  //     } else {
  //       return res.status(401).send({ error: "User not Found...!" });
  //     }
  //   } catch (error) {
  //     return res.status(500).send({ error: "Internal server error" });
  //   }
  // }
  
    
  


// export async function generateOTP (req,res){
// req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars:false})
// res.status(201).send({code:req.app.locals.OTP})
// }


// export async function verifyOtp (req,res){
// const {code} = req.query
// if(parseInt(req.app.locals.OTP)=== parseInt(code)){
//   req.app.locals.OTP = null //rest the otp value
//   req.app.locals.resetSession = true //start session for reset password
//   return res.status(201).send({msg:'verify successfully'})
// }
// return res.status(400).send({error: "invalid OTP"})

// }

// export async function createResetSession (req,res){
// if(req.app.locals.resetSession){
//   req.app.locals.resetSession = false //allow access to this route only once
//   return res.status(201).send({ msg : "access granted!"})
// }
// return res.status(440).send({error : "Session expired"})
// }


// export async function resetPassword(req, res) {
//   try {
//     if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired"})

//     const { email, password } = req.body;

//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       return res.status(404).send({ error: "User email not found" });
//     }

//     try {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       await UserModel.updateOne({ email: user.email }, { password: hashedPassword });

//       return res.status(201).send({ msg: "record updated" });
//     } catch (error) {
//       return res.status(500).send({ error: "Unable to hash password" });
//     }
//   } catch (error) {
//     return res.status(401).send({ error });
//   }
// }





// export async function bookAppointment(req, res) {
//   try {
//     const { doctor, user, ticketPrice, appointmentDate } = req.body;

//     // Create a new booking document
//     const booking = new BookingModel({
//       doctor,
//       user,
//       ticketPrice,
//       appointmentDate,
//       status: 'pending', // You can set the initial status as 'pending'
//     });

//     // Save the booking to the database
//     await booking.save();

//     return res.status(201).json({ msg: 'Appointment booked successfully', booking });
//   } catch (error) {
//     console.error('Error while booking appointment:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }



/////////////////////////////////////////


// export async function bookAppointment(req, res) {
//   try {
//     // Create a new booking
//     const newBooking = new BookingModel(req.body);

//     // Save the booking to the database
//     await newBooking.save();

//     // Update the Doctor and User schemas (example: add booking ID to appointments array)
//     await DoctorModel.findOneAndUpdate(
//       { _id: req.body.doctor },
//       { $push: { appointments: newBooking._id } }
//     );

//     await UserModel.findOneAndUpdate(
//       { _id: req.body.user },
//       { $push: { appointments: newBooking._id } }
//     );

//     res.status(201).json({ message: 'Booking successful', booking: newBooking });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }




// export async function getAvailableTimeSlots(req, res) {
//   try {
//     const { doctorId } = req.params;

//     // Find the doctor by ID
//     const doctor = await DoctorModel.findById(doctorId);

//     if (!doctor) {
//       return res.status(404).json({ error: 'Doctor not found' });
//     }

//     // Fetch all appointments for the doctor
//     const appointments = await BookingModel.find({ doctor: doctorId });

//     // Assuming you have a predefined set of time slots for a day
//     const allTimeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

//     // Filter out the time slots that are not booked
//     const availableTimeSlots = allTimeSlots.filter((slot) => {
//       // Check if the slot is not included in any appointment
//       return !appointments.some((appointment) => {
//         const startTime = appointment.appointmentDate.getHours() + ':' + appointment.appointmentDate.getMinutes();
//         return startTime === slot;
//       });
//     });

//     res.status(200).json({ availableTimeSlots });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }




export const getUserProfile = async(req,res)=>{
  const userId =req.userId
 try {

  const user = await UserModel.findById(userId)

  if(!user){
    return res.status(404).json({success:false, message:"User not found"})
  }

  const {password, ...rest} =user._doc
  res.status(200).json({success:true, message:"Profile info is getting", data:{...rest}})
  
 } catch (err) {
  return res.status(500).json({success:false, message:"Something went wrong can't get"})

 }
}


export const getMyAppointments = async (req,res)=>{
  try {
    //setp -1 : retrives appointments from booking

    const bookings = await BookingModel.find({user:req.userId})

    //setp -2 : extract doctor id appointments from booking
    const doctorIds = bookings.map(el=>el.doctor.id)
    //setp -3 : retrive doctors using doctor ids
    const doctors = await DoctorModel.find({_id: {$in:doctorIds}}).select('-password')

    res.status(200).json({success:true, message:'Appointments are getting',data:doctors})

  } catch (err) {
    return res.status(500).json({success:false, message:"Something went wrong can't get"})
  }      
}