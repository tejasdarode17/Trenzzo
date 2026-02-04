import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP error:", error);
    } else {
        console.log("SMTP server is ready");
    }
});

const sendMailFromNodemailer = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Trenzzo" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Nodemailer send failed:", error);
        throw error;
    }
};

export default sendMailFromNodemailer;
