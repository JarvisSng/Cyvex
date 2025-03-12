import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpEmail = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    // Function to handle redirection to the sign-up page
    const PasswordResetRedirect = () => {
        navigate('/reset/email');  // Redirect to the sign-up page
    };

    // Function that forwards to the next part of the sign up page (Username)
    const handleNext = () => {
        if (!email) {
            alert("Please enter your email.");
            return;
        }
        localStorage.setItem("email", email);
        navigate("/signup/username");
    };

    return (
        <div className="bg-blue-950 w-screen h-screen flex flex-col items-center justify-center gap-6">
            <h4 className="text-stone-50 text-5xl font-bold">cyvex</h4>
            <div className="bg-stone-50 p-8 flex flex-col items-center justify-center gap-4 rounded-md shadow-lg w-100">
                <p className="text-black text-3xl font-regular">welcome</p>
                <p className="text-black text-lg font-regular">nice to have you signing up!</p>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-bold p-3 w-60 bg-white text-black opacity-50 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    onClick={handleNext}
                    className="w-60 !bg-blue-950 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                    continue
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

export default SignUpEmail;

// Code Reviewed by Jarvis
// Good for now