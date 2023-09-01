import {Router} from "express"
const patientRoute = Router();


import * as patientController from '../../controllers/patientController/patientController.js'
import Auth,{ localVariables } from'../../middleware/auth.js'
import {registerMail} from'../../helpers/mailer.js'


/* POST Methods */
patientRoute.post('/register',patientController.register)
patientRoute.post('/registerMail',registerMail) //send the mail
patientRoute.post('/authenticate',((req,res)=>res.end()) )
patientRoute.post('/login',patientController.verifyUser,patientController.login )


/* GET Methods */

patientRoute.get('/user/:name',patientController.getUser)
patientRoute.get('/generateOTP',patientController.verifyUser,localVariables,patientController.generateOTP)
patientRoute.get('/verifyOTP',patientController.verifyOTP)
patientRoute.get('/createResetSession',patientController.createResetSession)


/* PUT Methods */

patientRoute.put('/updateuser',Auth,patientController.updateUser)
patientRoute.put('/resetPassword',patientController.verifyUser,patientController.resetPassword)





export default patientRoute