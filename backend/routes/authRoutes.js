import express from "express";
import { getAllAdminContrller, getAllAgentRequestController, getAllUsersController, getOtpAgentController, loginController, registerController, sendOtpController, updateAgentOptController, updateStatusController} from "../controllers/authController.js";
import { protect, admin, superAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import { getAllAgentController } from "../controllers/flightController.js";

const router = express.Router();
router.post("/register", registerController);
router.post("/login", loginController);

router.post("/send-otp", sendOtpController);
router.get("/get-otp-agent",getOtpAgentController)
router.post("/agent-otp-status/:id", updateAgentOptController)

router.get("/get-all-users", getAllUsersController)
router.patch("/status/:id", updateStatusController);

// admins
router.get("/get-all-admins", getAllAdminContrller);

// agents
router.get("/get-all-agents", getAllAgentController);
router.get("/agent-request", getAllAgentRequestController)

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-dashboard", requireSignIn, admin, (req, res) => {
  res.status(200).send({ ok: true });
  // res.status(200).json({ message: "Admin dashboard" });
});
// Route to get all admins
router.get("/superadmin-dashboard", requireSignIn,  superAdmin, (req, res) => {
  res.status(200).send({ ok: true });
  // res.status(200).json({ message: "Superadmin dashboard" });
});

router.get('/admins', superAdmin, async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.status(200).send({
      success: true,
      message: 'Admins fetched successfully',
      data: admins,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching admins',
      error: error.message,
    });
  }
});

export default router;
