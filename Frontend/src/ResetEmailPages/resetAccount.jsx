import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountResetEmail } from "../controller/authController";
import logoImage from '../assets/cyvex-logo.png';

const ResetEmail = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Function to handle redirection to the landing page
    const handleBackToLanding = () => {
        navigate('/');  // Redirect to the landing page (root route)
    };

    // Function that forwards to the next part of the reset page (Account reset)
    const handleReset = async (e) => {
        if (!email) {
            alert("Please enter your email.");
            return;
        }
        // Send the email to database for check and send account reset email
        const response = await AccountResetEmail(email);

        if (response.error) {
			setError(response.error);
			return;
		}
        
        localStorage.setItem("email", email);
        navigate("/reset/resendEmail");
    };

    return (
    <div className="bg-blue-950 w-screen h-screen flex flex-col items-center justify-center gap-6">
            <img 
                src={logoImage} 
                alt="Cyvex Logo" 
                className="h-10 w-auto cursor-pointer" // Added cursor-pointer
                onClick={handleBackToLanding} // Added click handler
            />
            <div className="bg-stone-50 p-8 flex flex-col items-center justify-center gap-4 rounded-md shadow-lg w-100">
                <p className="text-black text-3xl font-regular">welcome</p>
                <p className="text-black text-l font-regular">enter your email. we will find your account</p>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-bold p-3 w-60 bg-white text-black opacity-50 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    onClick={handleReset}
                    className="w-60 !bg-blue-950 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                continue
                </button>
        </div>
    </div>
    );
};

export default ResetEmail;
