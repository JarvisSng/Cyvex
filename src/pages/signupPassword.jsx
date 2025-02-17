import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from '../controller/authController';

const SignUpPassword = () => {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Retrieve email and username from localStorage
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");

    const handleSignUp = async () => {
        if (!password) {
            alert("Please enter a password.");
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
        <div>
            <h2>Set Password</h2>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default SignUpPassword;
