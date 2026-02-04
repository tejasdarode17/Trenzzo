import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMailFromResend = async ({ to, subject, html }) => {
    
    try {
        console.log(to);
        console.log("called form sendMailFromResend");

        await resend.emails.send({
            from: "Trenzzo <onboarding@resend.dev>",
            to,
            subject,
            html,
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
};


export default sendMailFromResend
