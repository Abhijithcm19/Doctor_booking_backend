import UserModel from '../../models/UserSchema.js'
import BookingModel from '../../models/BookingSchema.js';
import DoctorModel from '../../models/DoctorSchema.js';
import Razorpay from 'razorpay';

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






