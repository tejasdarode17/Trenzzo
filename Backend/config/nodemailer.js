import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const sendMail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: `"Trenzzo" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Email send failed:", error);
        throw new Error("Unable to send email");
    }
};


export default sendMail