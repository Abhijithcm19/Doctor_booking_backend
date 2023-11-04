import {Router} from "express"
const adminRoute = Router();

import * as adminController from '../../controllers/adminController/adminController.js'



adminRoute.post('/login',adminController.adminLogin )

adminRoute.get('/users',adminController.getAllUser)
adminRoute.put('/users/:userId/block-unblock', adminController.blockAndUnblockUser);

adminRoute.get('/doctors',adminController.getAllDoctor)
adminRoute.put('/doctors/:doctorId/block-unblock', adminController.blockAndUnblockDoctor);


adminRoute.post('/services',adminController.createService )
adminRoute.get('/services', adminController.getAllServices);
adminRoute.put('/services/:id', adminController.updateService);
adminRoute.delete('/services/:id', adminController.deleteService);


export default adminRoute