import ErrorMessage from "@/ui/Others/ErrorMessage";
import { checkAuth, } from "@/redux/authSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, } from "react-router-dom";
import { toast } from "sonner";

const SellerLogin = () => {
    const [sellerInput, setSellerInput] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handleSellerLogin(e) {
        e.preventDefault();

        if (!sellerInput.email || !sellerInput.password) {
            return toast.error("Please fill all the fields");
        }
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/login`,
                sellerInput,
                { withCredentials: true }
            );
            dispatch(checkAuth())
        } catch (error) {
            setError(error.response.data.message || "Server Error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <h2 className="text-2xl font-semibold text-center mb-6">
                Seller Login
            </h2>

            <form onSubmit={handleSellerLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E17100]"
                        onChange={(e) => setSellerInput((prev) => ({ ...prev, email: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E17100]"
                        onChange={(e) => setSellerInput((prev) => ({ ...prev, password: e.target.value }))}
                    />
                </div>

                {error && <ErrorMessage error={error}></ErrorMessage>}

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-[#E17100] text-white py-3 rounded-lg font-semibold"
                >
                    {loading ? <Loader2 className="animate-spin mx-auto"></Loader2> : "Login"}
                </button>
            </form>

            <p className="text-center text-sm mt-4">
                Don't have an account?{" "}
                <Link to="/seller/auth/register" className="text-[#E17100] font-medium">
                    Register
                </Link>
            </p>
        </>
    );
};

export default SellerLogin;


