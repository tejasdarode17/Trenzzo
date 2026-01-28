import mongoose from "mongoose";

const emailOtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
    },

    otpHash: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["user", "seller", "deliveryPartner"],
        required: true,
    },

    // Pending registration data
    payload: {
        type: Object,
        required: true,
    },

    expiresAt: {
        type: Date,
        required: true,
    },

    isUsed: {
        type: Boolean,
        default: false,
    },

    attempts: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Auto delete expired OTPs
emailOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const EmailOtp = mongoose.model("EmailOtp", emailOtpSchema);
export default EmailOtp;





// that isUsed is required because after 10min monogodb will delete but
// what if someone somehow manage to send two or three req at one time on /verify-otp within 10 min
// that isUsed is making sure only One-time consumption of that OTP 


