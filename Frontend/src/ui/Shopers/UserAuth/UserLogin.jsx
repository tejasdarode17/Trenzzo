import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { checkAuth, } from "@/redux_temp/authSlice";
import { useDispatch } from "react-redux";
import ErrorMessage from "@/ui/Others/ErrorMessage";

const UserLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, form,
        { withCredentials: true }
      );
      dispatch(checkAuth())
      navigate("/")
    } catch (err) {
      setError(err?.response?.data?.message || "Server Error")
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome back
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Please enter your credentials to continue
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E17100]/30 focus:border-[#E17100]"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-[#E17100] hover:underline"
            >
              Forgot?
            </Link>
          </div>

          <input
            type="password"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E17100]/30 focus:border-[#E17100]"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>


        {error && <ErrorMessage error={error}></ErrorMessage>}

        <button
          disabled={loading}
          className="w-full bg-[#E17100] hover:bg-[#cf6500] text-white font-semibold py-3 rounded-lg transition disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link to="/user/auth/register" className="text-[#E17100] font-medium">
          Sign up
        </Link>
      </p>

      <p className="text-sm text-center text-gray-600 mt-6">
        Are you a Seller?{" "}
        <Link to="/seller/auth/login" className="text-green-600 border p-1 font-medium">
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

export default UserLogin
