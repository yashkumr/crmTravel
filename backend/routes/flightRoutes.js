import express from "express";
import { BookingMailsController, getFlightController, updateFlightStatusController, webUrlController } from "../controllers/flightController.js";

const router = express.Router();

router.get("/get-flight" ,getFlightController);
router.patch("/status/:id", updateFlightStatusController);
router.get("/get-booking-mails" , BookingMailsController);
router.post("/webUrl", webUrlController);

export default router;