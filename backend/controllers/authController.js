import { comparePassword, hashPassword } from "../helper/authHelper.js";
import User from "../models/User.js";
import JWT from "jsonwebtoken";
import nodemailer from 'nodemailer';

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
      status = "approved"
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

    const otpAgent = await User.find({ role: 'agent' });

    res.status(200).send({
      success: true,
      message: 'otpAgent fetched successfully',
      data: otpAgent,
    });

  } catch (error) {
    console.log(error);
    res.status(5000).send({
      success: false,
      message: "Error in getting all otpAgent",
      error,
    })
  }
}
export const updateAgentOptController = async (req, res) => {
  try {
    const { otpEmail,otpStatus } = req.body;
    console.log(req.body);
    console.log(req.params.id)

    if (!otpEmail) {
      return res.status(200).send({ success: false, message: 'Email is required' });
    }

    const user = await User.findById(req.params.id);
    console.log(user);
   

    if (!user) {
      return res.status(200).send({ success: false, message: `${user.role}  not found` });
    }
    if (otpEmail ==! user) {
      return res.status(200).send({ success: false, message: 'This is Email is not matched ' });
    }

    if (user.status !== 'approved') {
      return res.status(200).send({ success: false, message: `This ${user.role} is not approved` });
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
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: otpEmail,
      subject: 'Your OTP',
      text: `Your OTP is ${otpStatus}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ success: true, message: 'OTP sent to user email' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error generating OTP', error });
  }
};

export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);

    if (!email) {
      return res.status(200).send({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).send({ success: false, message: "This Email is not registered" });
    }

    if (user.status !== 'approved') {
      return res.status(200).send({ success: false, message: `This ${user.role} is not approved` });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    // Save OTP in the database
    user.otp = { value: otp, expiresAt };
    console.log('OTP before saving:', user.otp);
    await user.save();
    console.log('OTP after saving:', user.otp);


    // Nodemailer configuration
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL,
    //     pass: process.env.PASSWORD,
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.EMAIL,
    //   to: email,
    //   subject: 'Your OTP',
    //   text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    // };

    // await transporter.sendMail(mailOptions);

    res.status(200).send({ success: true, message: `OTP sent  to  ${user.role} mail` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error generating OTP', error });
  }
};


export const loginController = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp) {
      return res.status(400).send({ success: false, message: 'Email, password, and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }

    // Validate OTP
    if (!user.otp || user.otp.value !== parseInt(otp) || new Date() > new Date(user.otp.expiresAt)) {
      return res.status(200).send({ success: false, message: 'Invalid or expired OTP' });
    }

    // Validate password
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(401).send({ success: false, message: 'Invalid password' });
    }

    // Generate JWT token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Clear OTP after successful login
    user.otp = null;
    await user.save();

    res.status(200).send({
      success: true,
      message: 'Login successful',
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
    res.status(500).send({ success: false, message: 'Error logging in', error });
  }
};



// getAllUsersController
export const getAllUsersController = async (req, res) => {
  try {

    const getAllusers = await User.find({});

    res.status(200).send({
      success: true,
      message: "Users Data Fetched Successully",
      getAllusers
    })

  } catch (error) {
    console.log(error);
    res.status(5000).send({
      success: false,
      message: "Error in getting all users",
      error,
    })
  }
}

export const updateStatusController = async (req, res) => {

  const { status } = req.body;
  await User.findByIdAndUpdate(req.params.id, { status });
  res.status(200).send({
    success: true,
    message: "Users Data Fetched Successully",

  })
}

// getAllAdminContrller
export const getAllAdminContrller = async (req, res) => {
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
}

// getAllAgentRequestController
export const getAllAgentRequestController = async (req, res) => {
  try {

    const admins = await User.find({ role: 'agent' });

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
}
