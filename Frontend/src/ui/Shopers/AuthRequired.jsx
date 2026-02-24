import { useNavigate } from "react-router-dom"

const AuthRequired = () => {

    const navigate = useNavigate()

    const handleLogin = () => {
        navigate("/user/auth/login")
    }

    return (
        <div className="w-full min-h-[80vh] flex items-center justify-center bg-gray-50">

            <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">

                <img
                    src="https://cdn-icons-png.flaticon.com/512/595/595067.png"
                    className="w-20 mx-auto mb-4"
                />

                <h2 className="text-2xl font-semibold mb-2">
                    Please sign in to continue
                </h2>

                <p className="text-gray-500 mb-6">
                    You need an account to access this page
                </p>

                <button
                    onClick={handleLogin}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Login / Signup
                </button>

            </div>

        </div>
    )
}

export default AuthRequired
