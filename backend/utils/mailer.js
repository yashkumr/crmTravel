import nodemailer from 'nodemailer';
import nodeMailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: 'Your OTP for Login',
        text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};
