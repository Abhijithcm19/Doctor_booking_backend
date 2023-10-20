import { populate } from 'dotenv';
import DoctorModel from '../../models/DoctorSchema.js';
import BookingModel from '../../models/BookingSchema.js';

  
  
  export async function updateDoctor(req, res){
    const id = req.params.id
    try {
      const updateUser = await DoctorModel.findByIdAndUpdate(id, {$set:req.body},{new:true})

      res.status(200).send({ success:true ,msg: "Record Updated...!",data:updateUser });
     
    } catch (error) {
      res.status(500).send({ msg: "failed to Updated...!" });
    }
  }

  export async function deleteDoctor(req, res){
    const id = req.params.id
    try {
       await DoctorModel.findByIdAndDelete(id)

      res.status(200).send({ success:true ,msg: "Record deleted...!" });
     
    } catch (error) {
      res.status(500).send({ msg: "failed to delete...!" });
    }
  }

  export async function getSingleDoctor(req, res){
    const id = req.params.id
    try {
      const doctor = await DoctorModel.findById(id).populate('reviews').select("-password")

      res.status(200).send({ success:true ,msg: "doctor Found...!",data:doctor });
     
    } catch (error) {
      res.status(404).send({ msg: "no doctor found...!"});
    }
  }

  export async function getAllDoctor(req, res) {
    try {
      const { query } = req.query;
      let doctors;
  
      if (query) {
        doctors = await DoctorModel.find({
          isApproved: 'approved',
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { specialization: { $regex: query, $options: 'i' } },
          ],
        });
      } else {
        doctors = await DoctorModel.find({ isApproved: 'approved' }).select('-password');
      }
  
      if (doctors && doctors.length > 0) {
        // Return the list of doctors if found
        res.status(200).send({ success: true, msg: 'Doctors Found...!', data: doctors });
      } else {
        // Return a message if no doctors are found
        res.status(404).send({ success: false, msg: 'No doctors found...!' });
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      res.status(500).send({ success: false, msg: 'Failed to fetch doctors...!' });
    }
  }



export const getDoctorProfile = async (req,res)=>{
  const doctorId = req.userId
  try {
 
   const doctor = await DoctorModel.findById(doctorId)
 
   if(!doctor){
     return res.status(404).json({success:false, message:"doctor not found"})
   }
 
   const {password, ...rest} =doctor._doc
   const appointments = await BookingModel.find({doctor:doctorId})
   res.status(200).json({success:true, message:"Profile info is getting", data:{...rest, appointments }})
   
  } catch (err) {
   return res.status(500).json({success:false, message:"Something went wrong can't get"})
 
  }
}

