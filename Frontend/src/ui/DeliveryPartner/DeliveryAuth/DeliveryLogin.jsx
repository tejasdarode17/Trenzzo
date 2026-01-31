import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { checkAuth, } from "@/redux_temp/authSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import ErrorMessage from "@/ui/Others/ErrorMessage";

const DeliveryLogin = () => {
    const [input, setInput] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleDeliveryPartnerLogin(e) {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delivery/login`,
                {
                    ...input,
                    email: input.email.toLowerCase(),
                },
                { withCredentials: true }
            );
            dispatch(checkAuth())
            navigate("/delivery/dashboard");
        } catch (error) {
            setError(error.response.data.message || "Server Error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <h2 className="text-2xl font-semibold text-center mb-6">
                Delivery Partner Login
            </h2>

            <form onSubmit={handleDeliveryPartnerLogin} className="space-y-4">
                <Input
                    required
                    label="Email"
                    htmlfor="email"
                    type="email"
                    placeholder="partner@example.com"
                    onChange={(e) => setInput((p) => ({ ...p, email: e.target.value }))}
                />

                <Input
                    required
                    label="Password"
                    type="password"
                    placeholder="******"
                    onChange={(e) => setInput((p) => ({ ...p, password: e.target.value }))}
                />

                {error && <ErrorMessage error={error} />}

                <button
                    disabled={loading}
                    className="w-full bg-[#E17100] text-white py-3 rounded-lg font-semibold"
                >
                    {loading ? <Loader className="animate-spin"></Loader> : "Register"}
                </button>

            </form>

            <p className="text-center text-sm mt-4">
                Don’t have an account?{" "}
                <Link to="/delivery/auth/register" className="text-[#E17100] font-medium">
                    Register
                </Link>
            </p>
        </>
    );
};


export default DeliveryLogin;
