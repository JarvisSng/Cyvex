import React, { useState, useEffect } from 'react';
import { loginUser } from '../controller/authController';
import { useNavigate } from 'react-router-dom';

const LoginUI = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const email = localStorage.getItem("email");

  const navigate = useNavigate();  // Initialize navigate

  useEffect(() => {
    if (!email) {
      navigate("/"); // Redirect if email is missing
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

    localStorage.setItem("username", response.username); // Store username for later use
    setMessage(`Logged in as ${response.username}`);
  };

  // Function to handle redirection to the sign-up page
  const handleSignUpRedirect = () => {
    navigate('/signup/email');  // Redirect to the sign-up page
  };

  return (
    <div className="bg-blue-950 w-screen h-screen flex flex-col items-center justify-center gap-6">
      <h4 className="text-stone-50 text-5xl font-bold">cyvex</h4>
        <div className="bg-stone-50 p-8 flex flex-col items-center justify-center gap-4 rounded-md shadow-lg w-100">
            <p className="text-black text-3xl font-regular">welcome</p>
            <p className="text-black text-lg font-regular">almost there! now your password!</p>

            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}

            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-bold p-3 w-60 bg-white text-black opacity-50 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleLogin}
              className="w-60 !bg-blue-950 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Login
            </button>
            <div className="flex justify-between w-80 mt-2">
              <p className="text-sm text-gray-600 hover:underline cursor-pointer">Need help?</p>
              <p 
                className="text-sm text-gray-600 hover:underline cursor-pointer"
                onClick={handleSignUpRedirect}
              >
                Sign up here
              </p>
              </div>
          </div>
    </div>
  );
};

export default LoginUI;