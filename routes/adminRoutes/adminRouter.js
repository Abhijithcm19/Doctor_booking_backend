import {Router} from "express"
const adminRoute = Router();
import * as adminController from '../../controllers/adminController/adminController.js'
import Auth,{ localVariables } from'../../middleware/auth.js'


adminRoute.post('/login',adminController.adminLogin )














export default adminRoute