import {Router} from "express"
const patientRoute = Router();

import * as patientController from '../../controllers/patientController/patientController.js'
import { authenticate, restrict } from "../../auth/verifyToken.js"
import { createOrder, verifyPayment } from "../../controllers/bookingController/bookingController.js";

patientRoute.get('/:id',authenticate, restrict(["patient"]), patientController.getSingleUser)
patientRoute.get('/',authenticate, restrict(["admin"]),patientController.getAllUser)
patientRoute.put('/:id',authenticate, restrict(["patient"]),patientController.updateUser)
patientRoute.delete('/:id',authenticate, restrict(["patient"]),patientController.deleteUser)
patientRoute.get('/profile/me',authenticate, restrict(["patient"]),patientController.getUserProfile)
patientRoute.get('/appointments/my-appointments',patientController.getMyAppointments)
patientRoute.post('/payments', authenticate,createOrder);
patientRoute.post('/paymentverification',authenticate,  verifyPayment);
// patientRoute.get('/getkey',getKey);

// patientRoute.get('/verifyOTP',patientController.verifyOtp)
// patientRoute.get('/createResetSession',patientController.createResetSession)
// patientRoute.get('/available-appointment-slots/:doctorId', patientController.getAvailableTimeSlots)
// patientRoute.post('/book-appointment',authenticate,patientController.bookAppointment)

/* PUT Methods */

// patientRoute.put('/updateuser',Auth,patientController.updateUser)
// patientRoute.put('/resetPassword',patientController.verifyUser,patientController.resetPassword)


/* PUT Methods */


export default patientRoute



// export const createOrder = async (req, res) => {
//   try {
//     const razorpay = new Razorpay({
//       key_id: process.env.KEY,
//       key_secret: process.env.SECRET,
//     });

//     const options = req.body;
//     const order = await razorpay.orders.create(options);

//     if (!order) {
//       return res.status(500).send("Error");
//     }

//     res.json(order);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error");
//   }
// };





// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     const body = razorpay_order_id + '|' + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.SECRET)
//       .update(body.toString())
//       .digest('hex');
//     const isAuth = expectedSignature === razorpay_signature;

//     if (isAuth) {
//       await BookingModel.create({
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,
//       });
//       res.redirect(`http://localhost:5173/success?reference=${razorpay_payment_id}`);
//     } else {
//       res.status(400).json({ success: false });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Error verifying payment' });
//   }
// };

// export const getKey = (req, res) => {
//   console.log("keyyyyyyyyyyyyyyyyy",process.env.KEY)
//   return res.status(200).json({ key: process.env.KEY });
// };