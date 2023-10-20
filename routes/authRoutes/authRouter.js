import {Router} from "express"
const authRoute = Router();

import * as authController from '../../controllers/authController/authController.js'
import Auth,{ localVariables } from'../../middleware/auth.js'
import * as patientController from '../../controllers/patientController/patientController.js'


// authRoute.post('/register',localVariables,authController.register)
// authRoute.post('/verify-otp', authController.verifyOTP);
authRoute.post('/login',authController.login )
authRoute.post('/register',authController.register)







export default authRoute