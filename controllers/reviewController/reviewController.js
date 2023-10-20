import DoctorModel from '../../models/DoctorSchema.js';
import UserModel from '../../models/UserSchema.js'
import reviewModel from '../../models/ReviewSchema.js'


//get all reviews
export const getAllReviews =async (req,res)=>{
    try {
        const reviews = await reviewModel.find({})

        res.status(200).json({success:true, message: "Successful", data:reviews})
    } catch (error) {
        res.status(200).json({success:false, message: "Not Found"})

    }
}
 
export const createReview = async (req, res) => {
  if (!req.body.doctor) req.body.doctor = req.params.doctorId;
  if (!req.body.user) req.body.user = req.userId;
  const newReview = new  reviewModel(req.body);

  try {
   const savedReview = await newReview.save()
    await DoctorModel.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id },
    });

    res
      .status(200)
      .json({ success: true, message: "Review submitted", data: savedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: err.message });
  }
};