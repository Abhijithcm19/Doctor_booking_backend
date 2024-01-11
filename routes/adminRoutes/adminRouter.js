import { Router } from "express";
const adminRoute = Router();

import * as adminController from "../../controllers/adminController/adminController.js";

//GET
adminRoute.get("/users", adminController.getAllUser);
adminRoute.get("/doctors", adminController.getAllDoctor);
adminRoute.get("/services", adminController.getAllServices);

//POST
adminRoute.post("/login", adminController.adminLogin);
adminRoute.post("/services", adminController.createService);

//PUT & DEL

adminRoute.put("/users/block-toggle/:id", adminController.userBockAndUnblock);
adminRoute.put("/services/:id", adminController.updateService);
adminRoute.put("/doctors/:id", adminController.doctorApproval);
adminRoute.delete("/services/:id", adminController.deleteService);

export default adminRoute;
