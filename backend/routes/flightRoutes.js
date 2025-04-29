import express from "express";
import { getFlightController, updateFlightStatusController } from "../controllers/flightController.js";

const router = express.Router();

router.get("/get-flight" ,getFlightController);
router.patch("/status/:id", updateFlightStatusController);

export default router;