import DoctorModel from '../../models/DoctorSchema.js';
import BookingModel from '../../models/BookingSchema.js';
import mongoose from 'mongoose';

  
  
export const updateDoctor = async (req, res) => {
  const doctorId = req.params.id;
  const updatedDoctorData = req.body;


  try {
    const updatedDoctor = await DoctorModel.findByIdAndUpdate(doctorId, updatedDoctorData, { new: true });

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor updated successfully', doctor: updatedDoctor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor', error: error.message });
  }
};

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
       
        res.status(200).send({ success: true, msg: 'Doctors Found...!', data: doctors });
      } else {
      
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


export const getUserAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    let convertedDoctorId;
    try {
      convertedDoctorId = mongoose.Types.ObjectId.createFromHexString(doctorId);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid doctorId' });
    }

    const pipeline = [
      {
        $match: {
          doctor: convertedDoctorId
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      }
    ];

    const bookings = await BookingModel.aggregate(pipeline);

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this doctor' });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};
