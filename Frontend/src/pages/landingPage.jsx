import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exampleImage from '../assets/blockchain.svg';
import logoImage from '../assets/cyvex-logo.png';

const LandingPage = () => {

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('solutions');


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
  const menuItems = ["solutions", "customers", "services", "insights", "company"];
  const tabContent = {
  solutions: (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <h2 className="text-6xl font-bold mb-10">Is Your Blockchain Vulnerable?</h2>
        <p className="text-gray-700 mt-2">
          Cyvex offers a comprehensive suite of tools for blockchain security and smart contract auditing.
          Our flagship detector tool identifies vulnerabilities, tracks anomalous contract behavior, and helps secure decentralized applications before deployment.
        </p>
        <p className="text-gray-700 mt-2">
          Whether you're a developer, auditor, or enterprise, our solutions streamline compliance and security checks at scale.
        </p>
          <button 
            onClick={detector}
            className="mt-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
          Try It Free
         </button>
      </div>
      <div className="md:w-1/2">
        <img
          src={exampleImage}
          alt="Blockchain security"
          className="w-full max-w-md mx-auto md:mx-0 rounded-lg"
          style={{ minWidth: '700px' }}
        />
      </div>
    </div>
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
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Column - Text Content */}
          <div className="md:w-1/2">
            <p className="text-gray-700 text-lg mb-8">
              Cyvex is a cybersecurity company dedicated to making decentralized technologies safer.
              Founded by a team of security researchers and blockchain developers, we are on a mission to eliminate vulnerabilities before they reach blockchain systems.
            </p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                <p className="text-gray-700">
                  We believe security should be accessible, transparent, and efficient. Our tools are built with this philosophy,
                  combining cutting-edge research with practical solutions that scale across blockchain ecosystems.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-4">Core Values</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">✓</span>
                    <span>Security through transparency</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">✓</span>
                    <span>Research-driven innovation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">✓</span>
                    <span>Community-focused solutions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Team and Join Section */}
          <div className="md:w-1/2">
            <div className="space-y-12">
              {/* Team Section */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">The Team</h3>
                <div className="grid grid-cols-3 gap-2">
                  {/* Team Member 1 */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mb-3 mx-auto"></div>
                    <h4 className="font-bold text-center">Sng Zhen Qi, Jarvis</h4>
                    <p className="text-sm text-gray-600 text-center">Team Lead</p>
                  </div>
                  
                  {/* Team Member 2 */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mb-3 mx-auto"></div>
                    <h4 className="font-bold text-center">Jaslina Hazin Binti Jeeyaudeen</h4>
                    <p className="text-sm text-gray-600 text-center">Manager</p>
                  </div>
                  
                  {/* Team Member 3 */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mb-3 mx-auto"></div>
                    <h4 className="font-bold text-center">Yun Pwint Phyu Linn</h4>
                    <p className="text-sm text-gray-600 text-center">Developer</p>
                  </div>
                  
                  {/* Team Member 4 */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mb-3 mx-auto"></div>
                    <h4 className="font-bold text-center">Quek Chun Jeng</h4>
                    <p className="text-sm text-gray-600 text-center">Team Member</p>
                  </div>

                  {/* Team Member 5 */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mb-3 mx-auto"></div>
                    <h4 className="font-bold text-center">Swan Htet</h4>
                    <p className="text-sm text-gray-600 text-center">Team Member</p>
                  </div>
                </div>
              </div>

              {/* Join Our Mission Section */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">Join Our Mission</h3>
                <p className="text-gray-700 mb-4">
                  We're always looking for passionate security researchers and blockchain developers.
                </p>
                <button className="!bg-blue-950 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md transition-colors w-full sm:w-auto">
                  View Open Positions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  };

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
    <main className="pt-24 min-h-screen flex flex-col justify-between bg-white w-full">
      <div className="flex-grow flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-7xl">
          {tabContent[activeTab]}
        </div>
      </div>
      
      {/* Footer Section */}
      <footer className="w-screen bg-blue-950 text-white py-8">
        <div className="w-full px-24"> {/* Full width with padding */}
          <div className="text-center">© 2025 Cyvex. All rights reserved.</div>
        </div>
      </footer>
    </main>
  </>
  );  
};

export default LandingPage;

// Code Reviewed by Jarvis.
// Code good for now.