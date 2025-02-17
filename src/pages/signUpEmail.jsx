import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpEmail = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

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
        <div>
            <h2>Enter Email</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleNext}>Continue</button>
        </div>
    );
};

export default SignUpEmail;