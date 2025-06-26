import express from "express";
import {
  confirmCtmBookingController,
  createCtmFlightController,
  updateCtmFlightController,
  generatePnrFlightController,
  updateProviderController,
  updateBidStatusController,
  updateItineraryController,
  updatePriceController,
  updateChargingController,
  updatePassengerController,
  updateBillingController,
  updateRefundController,
  updateChargeBackController,
  updateSendMailInvoiceController,
} from "../controllers/ctmFlightController.js";

const router = express.Router();

router.post("/create-ctm-flight", createCtmFlightController);
router.patch("/update-auth-flight/:flightId", updateCtmFlightController);
router.get("/confirm-ctm-booking/:flightId", confirmCtmBookingController);
router.get("/generatePnrFlight", generatePnrFlightController);

// details-pnr-flight
router.patch("/update-provider/:flightId", updateProviderController);
router.patch("/update-bid-status/:flightId", updateBidStatusController);
router.patch("/update-itinerary-details/:flightId", updateItineraryController);
router.patch("/update-price-details/:flightId", updatePriceController);
router.patch("/update-charging-details/:flightId", updateChargingController);
router.patch("/update-passenger-details/:flightId", updatePassengerController);
router.patch("/update-billing-details/:flightId", updateBillingController);
router.patch("/update-refund-details/:flightId", updateRefundController);
router.patch("/update-chargeBack-details/:flightId", updateChargeBackController);
router.get("/update-send-mail-invoice-details/:flightId", updateSendMailInvoiceController);

export default router;
