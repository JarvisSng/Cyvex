import React, { useState, useEffect } from "react";
import { resendVerificationEmail } from "../controller/authController";

const SignUpConfirmation = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [email, setEmail] = useState("");

    // Retrieve email from localStorage (if stored)
    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleResendEmail = async () => {
        if (!email) {
            setError("Email not found. Please sign up again.");
            return;
        }

        setIsDisabled(true); // Disable the button immediately

        const response = await resendVerificationEmail(email);

        if (response.error) {
            setMessage("");
            setError(response.error); // Show error message
        } else {
            setError("");
            setMessage("Verification email sent successfully!"); // Show success message
        }

        // Reset the button state after 10 seconds
        setTimeout(() => {
            window.location.reload(); // This will reload the page
        }, 10000); // 10 seconds delay
    };

    return (
        <div className="bg-blue-950 w-screen h-screen flex flex-col items-center justify-center gap-6">
            <h4 className="text-stone-50 text-5xl font-bold">cyvex</h4>
            <div className="bg-stone-50 p-8 flex flex-col items-center justify-center gap-4 rounded-md shadow-lg w-100">
                <p className="text-black text-lg font-regular">Thank you for signing up!</p>
                <p className="text-black text-lg font-regular mb-0">email not in box?</p>
                <p className="text-black text-lg font-regular mt-0">might want to check your spam...</p>
                {/* Display error or success messages */}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}
                <button 
                    onClick={handleResendEmail}
                    disabled={isDisabled} // Disable button when isDisabled is true
                    className={`w-60 px-6 py-3 rounded-md focus:outline-none 
                        ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "!bg-blue-950 hover:bg-blue-600 text-white"}`}
                >
                    {isDisabled ? "Please wait..." : "Resend Email"}
                </button>
            </div>
        </div>
    );
};

export default SignUpConfirmation;