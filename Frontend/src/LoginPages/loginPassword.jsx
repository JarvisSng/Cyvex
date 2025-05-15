import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/cyvex-logo.png";
import { loginUser } from "../controller/authController";

const LoginUI = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const email = localStorage.getItem("email");
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            navigate("/");
        }
    }, [email, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!password) {
            alert("Please enter your password.");
            return;
        }

        const response = await loginUser(email, password);
        if (response.error) {
            setError(response.error);
            return;
        }

        if (response.role === "admin") {
            navigate("/admin/dashboard");
        } else {
            navigate("/user-dashboard");
        }
    };

    const handleBackToLanding = () => {
        navigate('/');
    };

    const PasswordResetRedirect = () => {
        navigate("/reset/email");
    };

    const handleSignUpRedirect = () => {
        navigate("/signup/email");
    };

    return (
        <div className="bg-blue-950 w-screen h-screen flex flex-col items-center justify-center gap-6">
            <img 
                src={logoImage} 
                alt="Cyvex Logo" 
                className="h-10 w-auto cursor-pointer"
                onClick={handleBackToLanding}
            />
            <form onSubmit={handleLogin} className="bg-stone-50 p-8 flex flex-col items-center justify-center gap-4 rounded-md shadow-lg w-100">
                <p className="text-black text-3xl">welcome</p>
                <p className="text-black text-lg">
                    almost there! now your password!
                </p>
                {error && <p className="text-red-500">{error}</p>}
                
                {/* Hidden username field for accessibility */}
                <input
                    type="email"
                    autoComplete="email"
                    value={email || ""}
                    readOnly
                    className="hidden"
                    aria-hidden="true"
                />
                
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="font-bold p-3 w-60 bg-white text-black opacity-50 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="current-password"
                />
                <button
                    type="submit"
                    className="w-60 !bg-blue-950 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                    Login
                </button>
                <div className="flex justify-between w-80 mt-2">
                    <p
                        className="text-sm text-gray-600 hover:underline cursor-pointer"
                        onClick={PasswordResetRedirect}
                    >
                        Reset Password
                    </p>
                    <p
                        className="text-sm text-gray-600 hover:underline cursor-pointer"
                        onClick={handleSignUpRedirect}
                    >
                        Sign up here
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginUI;

// Code Reviewed by Jarvis
// Code good for now
