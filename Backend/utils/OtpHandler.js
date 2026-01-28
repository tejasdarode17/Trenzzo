import crypto from "crypto"
import bcrypt from "bcrypt"
import sendMail from "../config/nodemailer.js";
import EmailOtp from "../model/emailOtpModel.js";

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
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        isUsed: false,
    });

    // 5. Send email
    await sendMail({
        to: email,
        subject: "Verify your email",
        html: `
          <h2>Email Verification</h2>
          <p>Your OTP is <strong>${otp}</strong></p>
          <p>This OTP is valid for 10 minutes.</p>
        `,
    });
}
