import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AccountResetEmail } from "../controller/authController";

const ResendEmail = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            setError("No email found. Redirecting to login...");
            setTimeout(() => navigate("/reset/email"), 3000); // Redirect after 3 seconds
        }
    }, [navigate]);


    const handleResendEmail = async () => {
        if (!email) {
            setError("Please enter your email.");
            return;
        }

        setError(""); // Clear errors
        setMessage(""); // Clear previous messages

        const response = await AccountResetEmail(email);

        if (response.success) {
            setMessage("Password reset email sent! Check your inbox or spam folder.");
        } else {
            setError(response.message || "Failed to resend reset email.");
        }
    };

    return (
    <div className="bg-blue-950 w-screen h-screen flex flex-col items-center justify-center gap-6">
        <h4 className="text-stone-50 text-5xl font-bold">cyvex</h4>
            <div className="bg-stone-50 p-8 flex flex-col items-center justify-center gap-4 rounded-md shadow-lg w-100">
                <p className="text-black text-3xl font-regular">Email has been reset!</p>
                <p className="text-black text-lg font-regular">email not in inbox?</p>
                <p className="text-black text-lg font-regular">might want to check your spam...</p>
                <button 
                    onClick={handleResendEmail}
                    className="w-60 !bg-blue-950 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                Resend Email
                </button>
        </div>
    </div>
    );
};

export default ResendEmail;
