
  //TODO: Add a way to allow admin to navigate to admin dashboard
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

  const navigate = useNavigate();

  const login = () => {
    navigate("/login/email");
  }

  const detector = () => {
    navigate("/detector");
  }

  return (
    <header className="bg-blue-950 fixed top-0 left-0 w-full py-4 px-8 shadow-md">
      {/* Header Container */}
      <div className="flex items-center justify-between w-full h-20">
        
        {/* Logo (Left) */}
        <h2 className="text-stone-50 text-4xl font-bold flex items-center">cyvex</h2>
  
        {/* Navigation Links (Centered) */}
        <nav className="flex items-center gap-8">
          <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">solutions</h2>
          <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">customers</h2>
          <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">services</h2>
          <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">insights</h2>
          <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">company</h2>
        </nav>
  
        {/* Buttons (Right) */}
        <div className="flex items-center gap-4">
          <button 
            onClick={login}
            className="w-32 bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Login
          </button>
          <button 
            onClick={detector}
            className="w-32 bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Try It
          </button>
        </div>
  
      </div>
    </header>
  );  
};

export default LandingPage;