import express from "express";
import { loginController, registerController } from "../controllers/authController.js";
import { protect, admin, superAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
// router.get("/logout", );

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
