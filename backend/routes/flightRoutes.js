import express from "express";
import { BookingMailsController, getFareswayController, getFlightController, getTravelowaysController, updateFlightStatusController, webUrlController } from "../controllers/flightController.js";

const router = express.Router();

router.get("/get-flight" ,getFlightController);
router.patch("/status/:id", updateFlightStatusController);
router.get("/get-booking-mails" , BookingMailsController);
router.post("/webUrl", webUrlController);
router.get("/traveloways-booking",  getTravelowaysController)
router.get("/faresway-booking", getFareswayController)

export default router;