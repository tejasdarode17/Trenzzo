import { Input } from "@/components/ui/input";
import ErrorMessage from "@/Main Components/Other/ErrorMessage";
import axios from "axios";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DeliveryRegistration = () => {
    const [partnerInput, setPartnerInput] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        vehicle: "bike",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handlePartnerRegistration(e) {
        e.preventDefault();

        try {
            setLoading(true);

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delivery/register`,
                partnerInput,
                { withCredentials: true }
            );

            navigate("/delivery/auth/verify-otp", {
                state: { email: partnerInput.email },
            });

        } catch (err) {
            setError(err?.response?.data?.message || "Server Error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h2 className="text-2xl font-semibold text-center mb-6">
                Delivery Partner Registration
            </h2>

            <form onSubmit={handlePartnerRegistration} className="space-y-4">
                <Input id="name" label="Full Name" placeholder="John Rider" required
                    onChange={(e) => setPartnerInput((p) => ({ ...p, name: e.target.value }))}
                />

                <Input id="email" label="Email" type="email" placeholder="rider@example.com" required
                    onChange={(e) => setPartnerInput((p) => ({ ...p, email: e.target.value }))}
                />

                <Input id="phone" label="Phone (optional)" placeholder="9876543210"
                    onChange={(e) => setPartnerInput((p) => ({ ...p, phone: e.target.value }))}
                />

                <Input label="Password" type="password" placeholder="*******" required
                    onChange={(e) => setPartnerInput((p) => ({ ...p, password: e.target.value }))}
                />

                <div>
                    <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                    <select
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E17100]"
                        onChange={(e) => setPartnerInput((p) => ({ ...p, vehicle: e.target.value }))}
                    >
                        <option value="bike">Bike</option>
                        <option value="miniTruck">Mini Truck</option>
                        <option value="truck">Truck</option>
                    </select>
                </div>

                {error && <ErrorMessage error={error} />}

                <button
                    disabled={loading}
                    className="w-full bg-[#E17100] text-white py-3 rounded-lg font-semibold"
                >
                    {loading ? <Loader className="animate-spin"></Loader> : "Register"}
                </button>
            </form>

            <p className="text-center text-sm mt-4">
                Already registered?{" "}
                <Link to="/delivery/auth/login" className="text-[#E17100] font-medium">
                    Login
                </Link>
            </p>
        </>
    );
};


export default DeliveryRegistration;
