import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exampleImage from '../assets/blockchain.svg';
import logoImage from '../assets/cyvex-logo.png';

const LandingPage = () => {

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('solutions');

  const menuItems = ["solutions", "customers", "services", "insights", "company"];
  const tabContent = {
    solutions: (
      <>
        <h2 className="text-2xl font-bold mb-2">Our Solutions</h2>
        <p className="text-gray-700 mt-2">
          Cyvex offers a comprehensive suite of tools for blockchain security and smart contract auditing.
          Our flagship detector tool identifies vulnerabilities, tracks anomalous contract behavior, and helps secure decentralized applications before deployment.
        </p>
        <p className="text-gray-700 mt-2">
          Whether you're a developer, auditor, or enterprise, our AI-assisted solutions streamline compliance and security checks at scale.
        </p>
      </>
    ),
    customers: (
      <>
        <h2 className="text-2xl font-bold mb-2">Trusted by Industry Leaders</h2>
        <p className="text-gray-700 mt-2">
          Cyvex supports a wide range of customers — from individual smart contract developers to major DeFi protocols.
          Our clients trust us for fast, accurate, and scalable security insights.
        </p>
        <p className="text-gray-700 mt-2">
          Join the growing list of secure projects that rely on Cyvex to protect their code and community.
        </p>
      </>
    ),
    services: (
      <>
        <h2 className="text-2xl font-bold mb-2">Professional Services</h2>
        <p className="text-gray-700 mt-2">
          In addition to automated detection, we offer in-depth manual smart contract audits, security consulting,
          and training for Web3 developers.
        </p>
        <p className="text-gray-700 mt-2">
          Our experienced team has worked with projects on Ethereum, Solana, Polygon, and more — helping you launch securely and confidently.
        </p>
      </>
    ),
    insights: (
      <>
        <h2 className="text-2xl font-bold mb-2">Insights & Research</h2>
        <p className="text-gray-700 mt-2">
          Stay ahead of the curve with our regular security reports, vulnerability discoveries, and technical blogs.
          We break down complex vulnerabilities and share lessons from real-world incidents.
        </p>
        <p className="text-gray-700 mt-2">
          Our threat intelligence helps you adapt to the fast-moving blockchain threat landscape.
        </p>
      </>
    ),
    company: (
      <>
        <h2 className="text-2xl font-bold mb-2">About Cyvex</h2>
        <p className="text-gray-700 mt-2">
          Cyvex is a cybersecurity company dedicated to making decentralized technologies safer.
          Founded by a team of security researchers and blockchain engineers, we are on a mission to eliminate vulnerabilities before they reach production.
        </p>
        <p className="text-gray-700 mt-2">
          We believe that security should be accessible, transparent, and efficient — and our tools are built with that philosophy.
        </p>
      </>
    ),
  };

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
      <div className="flex items-center justify-between w-full h-12">
        
        {/* Logo (Left) */}
        <img 
          src={logoImage} 
          alt="Cyvex Logo" 
          className="h-10 w-auto" // adjust height/width to fit your design
        />
  
        {/* Navigation Links (Centered) */}
        <nav className="hidden xl:flex items-center gap-4 lg:gap-8">
          {menuItems.map((item) => (
            <h2
              key={item}
               onClick={() => setActiveTab(item)}
              className={`text-stone-50 text-xl font-bold cursor-pointer ${
                activeTab === item ? "underline underline-offset-4" : ""
              }`}
            >
              {item}
            </h2>
          ))}
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
              {menuItems.map((item) => (
                <h2
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    setIsMenuOpen(false);
                  }}
                  className={`text-stone-50 text-xl font-bold cursor-pointer ${
                    activeTab === item ? "underline underline-offset-4" : ""
                  }`}
                >
                  {item}
                </h2>
              ))}
            
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
            {tabContent[activeTab]}
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