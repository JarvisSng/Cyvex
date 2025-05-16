// src/pages/Help.jsx
// src/pages/Help.jsx
import React, { useState } from "react";
import AdminNav from "./AdminNav";
import { FiHelpCircle, FiMail, FiLock, FiDownload, FiVideo, FiBookOpen } from "react-icons/fi";

const AdminHelp = () => {
  const [activeTab, setActiveTab] = useState("faq");
  
  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email.",
      icon: <FiLock className="text-blue-500" />
    },
    {
      question: "Where can I find documentation?",
      answer: "Visit our Documentation section or download the PDF guide below.",
      icon: <FiBookOpen className="text-blue-500" />
    },
    {
      question: "How do I contact support?",
      answer: "Email us at cyvexsupport@gmail.com or use the in-app chat during business hours.",
      icon: <FiMail className="text-blue-500" />
    }
  ];

  const resources = [
    {
      title: "User Manual",
      description: "Complete guide to all features",
      icon: <FiBookOpen className="text-2xl text-blue-500" />,
      action: "Download PDF"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      icon: <FiVideo className="text-2xl text-blue-500" />,
      action: "Watch Now"
    },
    {
      title: "API Documentation",
      description: "Technical integration guide",
      icon: <FiDownload className="text-2xl text-blue-500" />,
      action: "View Docs"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNav />
      
      <div className="flex-1 p-6 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center mb-8">
            <FiHelpCircle className="text-4xl text-blue-500 mr-4" />
            <div>
              <p className="text-gray-600">Find answers and resources to help you use our platform</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`px-4 py-2 font-medium ${activeTab === "faq" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("faq")}
            >
              FAQs
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === "resources" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("resources")}
            >
              Resources
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === "contact" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("contact")}
            >
              Contact Support
            </button>
          </div>

          {/* FAQ Section */}
          {activeTab === "faq" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        {faq.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Section */}
          {activeTab === "resources" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Helpful Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col">
                    <div className="mb-4">
                      {resource.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{resource.description}</p>
                    <button className="self-start text-blue-600 hover:text-blue-800 font-medium">
                      {resource.action} →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeTab === "contact" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Our Support Team</h2>
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Support Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FiMail className="text-blue-500 mt-1 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-800">Email Support</h4>
                          <p className="text-gray-600">cyvexsupport@gmail.com</p>
                          <p className="text-sm text-gray-500 mt-1">Response time: 24-48 hours</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FiHelpCircle className="text-blue-500 mt-1 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-800">Live Chat</h4>
                          <p className="text-gray-600">Available Mon-Fri, 9AM-5PM</p>
                          <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                            Start Chat →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Send Us a Message</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                        <input type="email" className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input type="text" className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea rows="4" className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"></textarea>
                      </div>
                      <button type="submit" className="!bg-blue-950 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHelp;