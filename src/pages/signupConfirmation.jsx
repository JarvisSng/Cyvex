import React, { useState, useEffect } from "react";
import { resendVerificationEmail } from "../controller/authController";

const SignUpConfirmation = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showResend, setShowResend] = useState(true);
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

        const response = await resendVerificationEmail(email);

        if (response.error) {
            setMessage("");
            setError(response.error); // Show error message
        } else {
            setError("");
            setMessage("Verification email sent successfully!"); // Show success message
            setShowResend(false); // Hide the button after sending
        }
    };

    return (
        <div>
            <h2>Verify Your Email</h2>
            <p>We sent a verification email to: {email}</p>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {showResend && (
                <button onClick={handleResendEmail}>Resend Verification Email</button>
            )}
        </div>
    );
};

export default SignUpConfirmation;
