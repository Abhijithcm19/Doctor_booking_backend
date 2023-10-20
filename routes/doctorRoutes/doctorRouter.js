import express from "express"

import {
    getSingleDoctor,
    getAllDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorProfile
} from '../../controllers/doctorController/doctorController.js'
import { authenticate, restrict } from "../../auth/verifyToken.js"
import reviewRoute from '../reviewRoutes/reviewRouter.js'
import { get } from "mongoose";
const router = express.Router();
//nested route

router.use("/:doctorId/reviews", reviewRoute);

router.get('/:id',getSingleDoctor)
router.get('/',getAllDoctor)
router.put('/:id',authenticate, restrict(["doctor"]),updateDoctor)
router.delete('/:id',authenticate, restrict(["doctor"]),deleteDoctor)
router.get('/profile/me', authenticate, restrict(['doctor']),getDoctorProfile)


export default  router;