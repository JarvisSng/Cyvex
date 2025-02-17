import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpUsername = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    // Function that forwards to the next part of the sign up page (Password)
    const handleNext = () => {
        if (!username) {
            alert("Please enter your username.");
            return;
        }
        localStorage.setItem("username", username);
        navigate("/signup/password");
    };

    return (
        <div>
            <h2>Enter Username</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleNext}>Continue</button>
        </div>
    );
};

export default SignUpUsername;
