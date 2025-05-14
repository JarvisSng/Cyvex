import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exampleImage from '../assets/blockchain.svg';
import logoImage from '../assets/cyvex-logo.png';
import Binance from '../assets/Binance_logo.svg';
import Chainlink from '../assets/Chainlink_logo.svg';
import Coinbase from '../assets/Coinbase_logo.svg';
import Ethereum from '../assets/Ethereum_logo.svg';
import Uniswap from '../assets/Uniswap_logo.svg';

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
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-center">Trusted by Industry Leaders</h2>
        <p className="text-gray-700 text-lg text-center max-w-2xl mx-auto mb-12">
          Cyvex supports a wide range of customers — from individual smart contract developers to major DeFi protocols.
          Our clients trust us for fast, accurate, and scalable security insights.
        </p>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Example Client 1 */}
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <img 
              src={Uniswap}
              alt="Uniswap" 
              className="h-12 object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          
          {/* Example Client 3 */}
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <img 
              src={Ethereum}
              alt="Ethereum" 
              className="h-10 object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          
          {/* Example Client 4 */}
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <img 
              src={Chainlink}
              alt="Chainlink" 
              className="h-10 object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          
          {/* Example Client 5 */}
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <img 
              src={Binance}
              alt="Binance" 
              className="h-10 object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          
          {/* Example Client 6 */}
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <img 
              src={Coinbase}
              alt="Coinbase" 
              className="h-12 object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        <p className="text-gray-700 text-center max-w-2xl mx-auto">
          Join the growing list of secure projects that rely on Cyvex to protect their code and community.
        </p>
      </div>
    ),
    services: (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Advanced tools and expert services to secure your Web3 projects across multiple blockchains
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {/* Core Technology */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Cryptographic Analysis</h3>
            <p className="text-gray-600 text-sm mb-3">
              Automated detection of cryptographic functions and vulnerabilities
            </p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Elliptic curve implementation review</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Signature verification checks</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Random number generation audit</span>
              </li>
            </ul>
          </div>

          {/* Other service cards follow same structure with reduced spacing... */}
          {/* Smart Contract Audits */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Contract Audits</h3>
            <p className="text-gray-600 text-sm mb-3">
              Comprehensive security reviews for EVM and non-EVM contracts
            </p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Automated vulnerability detection</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Manual code review by experts</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Remediation guidance</span>
              </li>
            </ul>
          </div>

          {/* Protocol Design Review */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Protocol Design</h3>
            <p className="text-gray-600 text-sm mb-3">
              Architectural security assessment for blockchain protocols
            </p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Economic model analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Consensus mechanism review</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Attack vector identification</span>
              </li>
            </ul>
          </div>

          {/* Secure Development */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Development</h3>
            <p className="text-gray-600 text-sm mb-3">
              Best practices for building robust smart contracts
            </p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Secure coding standards</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Development lifecycle security</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Upgrade pattern implementation</span>
              </li>
            </ul>
          </div>

          {/* DeFi Security */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">DeFi Security</h3>
            <p className="text-gray-600 text-sm mb-3">
              Specialized protection for decentralized finance
            </p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Oracle security review</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Flash loan attack prevention</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Liquidation mechanism audit</span>
              </li>
            </ul>
          </div>

          {/* Multi-Chain Expertise */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Multi-Chain</h3>
            <p className="text-gray-600 text-sm mb-3">
              Securing projects across blockchain ecosystems
            </p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Ethereum & EVM chains</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Solana programs</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mt-0.5 mr-1.5">•</span>
                <span>Cosmos SDK chains</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
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