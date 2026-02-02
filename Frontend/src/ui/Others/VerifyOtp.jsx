import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useDispatch } from "react-redux";
import ErrorMessage from "./ErrorMessage";
import { checkAuth } from "@/redux/authSlice";

const VerifyOtp = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();

    const email = state?.email;
    useEffect(() => {
        if (!email) {
            navigate("/user/auth/register");
        }
    }, [])

    const handleVerify = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setError("Enter valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify-otp`,
                { email, otp },
                { withCredentials: true }
            );

            dispatch(checkAuth());

            toast.success("Email verified successfully");
            navigate("/");

        } catch (err) {
            setError(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResendLoading(true);

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/resend-otp`,
                { email },
                { withCredentials: true }
            );

            toast.success("OTP resent successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <form onSubmit={handleVerify} className="space-y-6">
            <div>
                <h1 className="text-xl text-center font-bold text-gray-900">
                    Verify your email
                </h1>
                <p className="text-sm text-center  text-gray-600 mt-1">
                    We sent a 6-digit code to
                    <span className="font-medium"> {email}</span>
                </p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                        {[...Array(6)].map((_, i) => (
                            <InputOTPSlot key={i} index={i} />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
            </div>

            {error && <ErrorMessage error={error} />}

            {/* Verify Button */}
            <button
                disabled={loading}
                className="w-full bg-[#E17100] hover:bg-[#cf6500] text-white font-semibold py-3 rounded-lg transition disabled:opacity-70"
            >
                {loading ? "Verifying..." : "Verify"}
            </button>

            {/* Resend */}
            <p className="text-center text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                    type="button"
                    disabled={resendLoading}
                    className="text-[#E17100] font-medium disabled:opacity-60"
                    onClick={handleResend}
                >
                    {resendLoading ? "Sending..." : "Resend"}
                </button>
            </p>
        </form>
    );
};

export default VerifyOtp;
