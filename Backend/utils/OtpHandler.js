import crypto from "crypto"
import bcrypt from "bcrypt"
import EmailOtp from "../model/emailOtpModel.js";
import sendMailFromResend from "../config/resend.js";

export function generateOTP() {
    const otp = crypto.randomInt(100000, 1000000);
    return otp.toString();
}


export async function sendEmailOtp({ email, role, payload }) {

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);


    await EmailOtp.deleteMany({ email, role });

    await EmailOtp.create({
        email,
        role,
        payload,
        otpHash,
        expiresAt: new Date(Date.now() + 1 * 60 * 1000),
        isUsed: false,
    });

    // 5. Send email
    await sendMailFromResend({
        to: email,
        subject: "Verify your email",
        html: `
        <p>Hi,</p>
        <p>Your Trenzzo verification code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 10 minutes.</p>
        <p>If you didn’t request this, ignore this email.</p>
        `,
    });
}
