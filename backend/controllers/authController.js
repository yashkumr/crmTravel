import { comparePassword, hashPassword } from "../helper/authHelper.js";
import hotelModel from "../models/hotelModel.js";
import flightModel from "../models/flightModel.js";
import User from "../models/User.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
import cron from "node-cron";

export const registerController = async (req, res) => {
  const { userName, email, password, role, number } = req.body;

  let status = "pending";

  try {
    //validations
    if (!userName) {
      return res.send({ message: "UserName is Required" });
    }
    if (!number) {
      return res.send({ message: "Number  is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }

    //check user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already register please login",
      });
    }

    if (role === "superadmin") {
      status = "approved";
    }

    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new User({
      userName,
      number,
      email,
      password: hashedPassword,
      role,
      status,
    }).save();

    res.status(200).send({
      success: true,
      message: `${user.role} Registered successfully`,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration ",
      error,
    });
  }
};
const otpStore = {}; // Global object to store OTPs with expiration logic

// get-otp-agent
export const getOtpAgentController = async (req, res) => {
  try {
    const otpAgent = await User.find({ role: "agent" }).sort({ created: -1 });

    res.status(200).send({
      success: true,
      message: "otpAgent fetched successfully",
      data: otpAgent,
    });
  } catch (error) {
    console.log(error);
    res.status(5000).send({
      success: false,
      message: "Error in getting all otpAgent",
      error,
    });
  }
};

// get-otp-all
export const getOtpAllControlller = async (req, res) => {
  try {
    const otpAgent = await User.find().sort({ "otp.expiresAt": -1 });

    res.status(200).send({
      success: true,
      message: "all otp  fetched successfully",
      data: otpAgent,
    });
  } catch (error) {
    console.log(error);
    res.status(5000).send({
      success: false,
      message: "Error in getting all otpAgent",
      error,
    });
  }
};
export const updateAgentOptController = async (req, res) => {
  try {
    const { otpEmail, otpStatus } = req.body;
    // console.log(req.body);
    // console.log(req.params.id);

    if (!otpEmail) {
      return res
        .status(200)
        .send({ success: false, message: "Email is required" });
    }

    const user = await User.findById(req.params.id);
    // console.log(user);

    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: `${user.role}  not found` });
    }
    if (otpEmail == !user) {
      return res
        .status(200)
        .send({ success: false, message: "This is Email is not matched " });
    }

    if (user.status !== "approved") {
      return res
        .status(200)
        .send({ success: false, message: `This ${user.role} is not approved` });
    }

    // Generate OTP
    // const otp = Math.floor(100000 + Math.random() * 900000);
    // const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP in the database
    // user.otp = { value: otp, expiresAt };
    // console.log('OTP before saving:', user.otp);
    // await user.save();
    // console.log('OTP after saving:', user.otp);

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: otpEmail,
      subject: "Your OTP",
      text: `Your OTP is ${otpStatus}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ success: true, message: "OTP sent to user email" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error generating OTP", error });
  }
};

export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);

    if (!email) {
      return res
        .status(200)
        .send({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "This Email is not registered" });
    }

    if (user.status !== "approved") {
      return res
        .status(200)
        .send({ success: false, message: `This ${user.role} is not approved` });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    // Save OTP in the database
    user.otp = { value: otp, expiresAt };
    console.log("OTP before saving:", user.otp);
    await user.save();
    console.log("OTP after saving:", user.otp);

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL, // Send the OTP to the email defined in the environment variable
      subject: 'Your OTP',
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .send({ success: true, message: `OTP sent to the admin email address` });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error generating OTP", error });
  }
};


export const loginController = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp) {
      return res.status(400).send({
        success: false,
        message: "Email, password, and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    // Validate OTP
    if (
      !user.otp ||
      user.otp.value !== parseInt(otp) ||
      new Date() > new Date(user.otp.expiresAt)
    ) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid or expired OTP" });
    }

    // Validate password
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Clear OTP after successful login
    user.otp = null;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error logging in", error });
  }
};

// getAllUsersController
// getAllUsersController
export const getAllUsersController = async (req, res) => {
  try {
    const roleOrder = ["superadmin", "admin", "agent", "user"]; // Define the role hierarchy
    const getAllusers = await User.find({})
      .sort({ createdAt: -1 }) // Sort by createdAt first
      .then((users) =>
        users.sort(
          (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role) // Custom role sorting
        )
      );

    res.status(200).send({
      success: true,
      message: "Users Data Fetched Successfully",
      getAllusers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all users",
      error,
    });
  }
};

export const updateStatusController = async (req, res) => {
  try {
    console.log("updateStatusController called");
    const { status, approvedBy } = req.body;
    console.log(req.body);

    // Update both status and approvedBy fields
    await User.findByIdAndUpdate(req.params.id, { status, approvedBy });

    res.status(200).send({
      success: true,
      message: "User status and approvedBy updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating status and approvedBy",
      error,
    });
  }
};

// getAllAdminContrller
export const getAllAdminContrller = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching admins",
      error: error.message,
    });
  }
};

// getAllAgentRequestController
export const getAllAgentRequestController = async (req, res) => {
  try {
    const admins = await User.find({ role: "agent" }).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching admins",
      error: error.message,
    });
  }
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, // Use an App Password
  },
});

// Function to send emails
const sendEmails = async () => {
  try {
    const users = await User.find({});
    if (!users.length) {
      return;
    }

    const flights = await flightModel.find({});

    const hotels = await hotelModel.find({});

    for (const user of users) {
      const userFlights = flights.filter(
        (flight) => flight.email === user.email
      );
      const userHotels = hotels.filter((hotel) => hotel.email === user.email);

      let emailContent = `Hello ${user.userName},\n\nHere are your booked deals:\n\n`;

      if (userFlights.length) {
        emailContent += `Flights:\n`;
        userFlights.forEach((flight) => {
          emailContent += ` - Booking ID: ${flight.bookingId}\n   Status: ${
            flight.status
          }\n   Total Amount: ${flight.totalAmount} ${
            flight.currency
          }\n   Created At: ${new Date(flight.createdAt).toLocaleString()}\n\n`;
        });
      } else {
        emailContent += `No flights booked.\n`;
      }

      if (userHotels.length) {
        emailContent += `\nHotels:\n`;
        userHotels.forEach((hotel) => {
          emailContent += ` - Organization: ${hotel.org}\n   Rooms: ${
            hotel.rooms
          }\n   Status: ${hotel.status}\n   Updated At: ${new Date(
            hotel.updatedAt
          ).toLocaleString()}\n\n`;
        });
      } else {
        emailContent += `\nNo hotels booked.\n`;
      }

      emailContent += `\nThank you for choosing our service!\n\nBest regards,\nYour Team`;

      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Update on Your Booked Deals",
        text: emailContent,
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (err) {
    console.error("Error sending emails:", err);
  }
};

// cron.schedule('*/2 * * * *', () => {
//     console.log('Cron job triggered...');
//     sendEmails().catch(err => console.error('Error in scheduled job:', err));
// });

// Controller
export const moveToTrashController = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.isTrashed = true; // Mark the user as trashed

    user.status = "pending";

    await user.save();

    res.status(200).send({
      success: true,
      message: "User moved to Trash successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
