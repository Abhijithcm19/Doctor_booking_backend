import {Router} from "express"
const patientRoute = Router();


import * as patientController from '../../controllers/patientController/patientController.js'
import { authenticate, restrict } from "../../auth/verifyToken.js"




patientRoute.get('/:id',authenticate, restrict(["patient"]), patientController.getSingleUser)
patientRoute.get('/',authenticate, restrict(["admin"]),patientController.getAllUser)
patientRoute.put('/:id',authenticate, restrict(["patient"]),patientController.updateUser)
patientRoute.delete('/:id',authenticate, restrict(["patient"]),patientController.deleteUser)
patientRoute.get('/profile/me',authenticate, restrict(["patient"]),patientController.getUserProfile)
patientRoute.get('/appointments/my-appointments',patientController.getMyAppointments)


// patientRoute.get('/verifyOTP',patientController.verifyOtp)
// patientRoute.get('/createResetSession',patientController.createResetSession)
// patientRoute.get('/available-appointment-slots/:doctorId', patientController.getAvailableTimeSlots)
// patientRoute.post('/book-appointment',authenticate,patientController.bookAppointment)

/* PUT Methods */

// patientRoute.put('/updateuser',Auth,patientController.updateUser)
// patientRoute.put('/resetPassword',patientController.verifyUser,patientController.resetPassword)


/* PUT Methods */


export default patientRoute