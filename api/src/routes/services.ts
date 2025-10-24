import express from "express";
import { createService, deleteService, getServiceById, getServices, getUserServices, updateService } from "../controller/services";
import { verifyAuthorization } from "../middleware/authorization";

const servicesRoute = express.Router();

servicesRoute.post("/create", verifyAuthorization, createService);
servicesRoute.get("/all", verifyAuthorization, getServices);
servicesRoute.get("/each/:serviceId", verifyAuthorization, getServiceById);
servicesRoute.put("/:serviceId", verifyAuthorization, updateService);
servicesRoute.delete("/:serviceId", verifyAuthorization, deleteService);
servicesRoute.get("/all/:userId", verifyAuthorization, getUserServices)

export default servicesRoute;