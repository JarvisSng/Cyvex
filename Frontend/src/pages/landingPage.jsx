import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exampleImage from '../assets/blockchain.svg';
import logoImage from '../assets/cyvex-logo.png'; // Update the path and filename as needed

const LandingPage = () => {

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
      <div className="flex items-center justify-between w-full h-10">
        
        {/* Logo (Left) */}
        <img 
          src={logoImage} 
          alt="Cyvex Logo" 
          className="h-10 w-auto" // adjust height/width to fit your design
        />
  
        {/* Navigation Links (Centered) */}
        <nav className="hidden xl:flex items-center gap-4 lg:gap-8">
          <h2 className="text-stone-50 text-xl font-bold cursor-pointer">solutions</h2>
          <h2 className="text-stone-50 text-xl font-bold cursor-pointer">customers</h2>
          <h2 className="text-stone-50 text-xl font-bold cursor-pointer">services</h2>
          <h2 className="text-stone-50 text-xl font-bold cursor-pointer">insights</h2>
          <h2 className="text-stone-50 text-xl font-bold cursor-pointer">company</h2>
        </nav>
  
        {/* Buttons (Right) */}
        <div className="hidden xl:flex items-center gap-4 lg:gap-8">
          <button 
            onClick={login}
            className="w-24 lg:w-32 bg-stone-50 text-black px-4 lg:px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Login
          </button>
          <button 
            onClick={detector}
            className="w-24 lg:w-32 bg-stone-50 text-black px-4 lg:px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Try It
          </button>
        </div>
          {/* Mobile Menu Button (Visible only on small screens) */}
          <button 
            className="xl:hidden text-black text-2xl"
            onClick={toggleMenu}
          >
            ☰
          </button>
      </div>

      {/* Mobile Menu (Conditionally rendered) */}
      {isMenuOpen && (
        <div className="xl:hidden bg-blue-900 w-full py-4 px-8 absolute left-0 top-20 shadow-lg">
          <nav className="flex flex-col items-center gap-4">
            <h2 className="text-stone-50 text-xl font-bold cursor-pointer">solutions</h2>
            <h2 className="text-stone-50 text-xl font-bold cursor-pointer">customers</h2>
            <h2 className="text-stone-50 text-xl font-bold cursor-pointer">services</h2>
            <h2 className="text-stone-50 text-xl font-bold cursor-pointer">insights</h2>
            <h2 className="text-stone-50 text-xl font-bold cursor-pointer">company</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
              <button 
                onClick={login}
                className="w-full sm:w-auto bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Login
              </button>
              <button 
                onClick={detector}
                className="w-full sm:w-auto bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Try It
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>

    {/* Content Section */}
    <main className="mt-24 p-8">
      <div className="flex items-start flex-wrap">
        {/* Left Text */}
        <div className="w-full md:w-1/2 lg:pr-8">
          <h1 className="text-3xl font-bold">Welcome to Cyvex</h1>
          <p className="text-lg mt-4">
            We provide cutting-edge solutions to help businesses thrive. Explore our services and see how we can help you grow.
          </p>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex-shrink-0 mt-8 md:mt-0">
          <img 
            src={exampleImage} 
            alt="Description of the image" 
            className="w-full rounded-lg md:w-auto"
            style={{minWidth: '400px'}}
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