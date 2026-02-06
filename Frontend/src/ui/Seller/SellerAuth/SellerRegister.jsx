import ErrorMessage from "@/ui/Others/ErrorMessage";
import axios from "axios";
import { Loader, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SellerRegister = () => {
    const [sellerInput, setSellerInput] = useState({
        name: "",
        email: "",
        address: "",
        password: ""
    });

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleSellerRegistration(e) {
        e.preventDefault();
        try {
            setLoading(true)
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/register`,
                sellerInput,
                { withCredentials: true }
            );
            navigate("/seller/auth/verify-otp", {
                state: { email: sellerInput.email, },
            });
        } catch (err) {
            setError(err?.response?.data?.message || "Server error");
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">
                Seller Registration
            </h1>
            <p className="text-sm text-gray-600 mb-6 text-center">
                Create your seller account
            </p>

            <form className="space-y-5" onSubmit={handleSellerRegistration}>
                <input
                    name="name"
                    placeholder="Full name"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E17100]/30 focus:border-[#E17100]"
                    onChange={(e) => setSellerInput({ ...sellerInput, name: e.target.value })}
                />

                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E17100]/30 focus:border-[#E17100]"
                    onChange={(e) => setSellerInput({ ...sellerInput, email: e.target.value })}
                />

                <textarea
                    name="address"
                    placeholder="Business address"
                    className="w-full px-4 py-3 border rounded-lg min-h-[90px] focus:ring-2 focus:ring-[#E17100]/30 focus:border-[#E17100]"
                    onChange={(e) => setSellerInput({ ...sellerInput, address: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E17100]/30 focus:border-[#E17100]"
                    onChange={(e) => setSellerInput({ ...sellerInput, password: e.target.value })}
                />

                {error && <ErrorMessage error={error}></ErrorMessage>}

                <button disabled={loading} className="w-full bg-[#E17100] hover:bg-[#cf6500] text-white font-semibold py-3 rounded-lg">
                    {loading ? <Loader2 className="animate-spin mx-auto"></Loader2> : " Register as Seller"}
                </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
                Already a seller?{" "}
                <Link to="/seller/auth/login" className="text-[#E17100] font-medium">
                    Login
                </Link>
            </p>
        </>
    );
};


export default SellerRegister;
