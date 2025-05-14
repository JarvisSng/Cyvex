import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from '../controller/authController';
import logoImage from '../assets/cyvex-logo.png';

const SignUpPassword = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Retrieve email and username from localStorage
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");

     // Function to handle redirection to the sign-up page
    const PasswordResetRedirect = () => {
        navigate('/reset/email');  // Redirect to the sign-up page
    };

    const handleSignUp = async () => {
        if (!password) {
            setError("Please enter a password.");
            return;
        }

        const response = await signUpUser(email, username, password);

        if (response.error) {
            setError(response.error);
            return;
        }

        // Clear localStorage after signup
        localStorage.removeItem("username");
        
        navigate("/signup/confirmation");
    };

    return (
        <div className="bg-blue-950 w-screen h-screen flex flex-col items-center justify-center gap-6">
        <img 
          src={logoImage} 
          alt="Cyvex Logo" 
          className="h-10 w-auto" // adjust height/width to fit your design
        />
            <div className="bg-stone-50 p-8 flex flex-col items-center justify-center gap-4 rounded-md shadow-lg w-100">
                <p className="text-black text-3xl font-regular">welcome</p>
                <p className="text-black text-lg font-regular">almost there! now your password!</p>
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="font-bold p-3 w-60 bg-white text-black opacity-50 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    onClick={handleSignUp}
                    className="w-60 !bg-blue-950 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                    sign up
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
                        onClick={() => window.location.href = "/"}
                    >
                        Have an account?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPassword;

// Code Reviewed by Jarvis
// Code good for now
