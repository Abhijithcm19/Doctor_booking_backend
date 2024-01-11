import {Router} from "express"
const patientRoute = Router();

import * as patientController from '../../controllers/patientController/patientController.js'
import { authenticate, restrict } from "../../auth/verifyToken.js"
import { createOrder, verifyPayment,getAvailableSlot } from "../../controllers/bookingController/bookingController.js";

patientRoute.get('/:id',authenticate, restrict(["patient"]), patientController.getSingleUser)
patientRoute.get('/',authenticate, restrict(["admin"]),patientController.getAllUser)
patientRoute.put('/:id',authenticate, restrict(["patient"]),patientController.updateUser)
patientRoute.delete('/:id',authenticate, restrict(["patient"]),patientController.deleteUser)
patientRoute.get('/profile/me',authenticate, restrict(["patient"]),patientController.getUserProfile)
patientRoute.get('/my-appointments/:userId', authenticate, patientController.getUserAppointments);
patientRoute.post('/payments', authenticate,createOrder);
patientRoute.post('/paymentverification',authenticate, verifyPayment);
patientRoute.post('/get-all-notification',authenticate,  patientController.getAllNotification);
patientRoute.post('/available-slots',authenticate,getAvailableSlot);
patientRoute.post('/submitForm',patientController.submitContactForm);

export default patientRoute


