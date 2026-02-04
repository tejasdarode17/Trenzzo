import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import ErrorMessage from "@/ui/Others/ErrorMessage";
import { Loader2 } from "lucide-react";

const UserRegister = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/register`, form,
        { withCredentials: true }
      );
      navigate("/user/auth/verify-otp", {
        state: { email: form.email, },
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Server Error")
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Create your account
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        It only takes a minute
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          id="name"
          placeholder="Full name"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E17100]/30 focus:border-[#E17100]"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          id="email"
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E17100]/30 focus:border-[#E17100]"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E17100]/30 focus:border-[#E17100]"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <ErrorMessage error={error}></ErrorMessage>}


        <button
          disabled={loading}
          className="w-full bg-[#E17100] hover:bg-[#cf6500] text-white font-semibold py-3 rounded-lg transition disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin mx-auto"></Loader2> : "Create account"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <Link to="/user/auth/login" className="text-[#E17100] font-medium">
          Log in
        </Link>
      </p>


      <p className="text-center text-sm text-gray-600 mt-6">
        Are You Seller?{" "}
        <Link to="/seller/auth/register" className="text-green-600 border p-1  font-medium">
          Login
        </Link>
      </p>

      <p className="text-center text-sm text-gray-600 mt-6">
        Are You Delivery Partner?{" "}
        <Link to="/delivery/auth/register" className="text-green-600 border p-1  font-medium">
          Login
        </Link>
      </p>

    </>
  );
};

export default UserRegister;
