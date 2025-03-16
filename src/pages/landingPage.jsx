import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exampleImage from '../assets/blockchain.svg';

const LandingPage = () => {

  const navigate = useNavigate();

  // Function that navigate to the login pages
  const login = () => {
    navigate("/login/email");
  }

  // Function that navigate to the detector tool
  const detector = () => {
    navigate("/detector");
  }

  return (
  <>
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

    {/* Content Section */}
    <main className="mt-24 p-8">
      <div className="flex items-center justify-between">
        {/* Left Text */}
        <div className="w-1/2 pr-8">
          <h1 className="text-3xl font-bold">Welcome to Cyvex</h1>
          <p className="text-lg mt-4">
            We provide cutting-edge solutions to help businesses thrive. Explore our services and see how we can help you grow.
          </p>
        </div>

        {/* Right Image */}
        <div className="w-1/2">
          <img 
            src={exampleImage} 
            alt="Description of the image" 
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </main>
  </>
  );  
};

export default LandingPage;

// Code Reviewed by Jarvis.
// Code good for now.