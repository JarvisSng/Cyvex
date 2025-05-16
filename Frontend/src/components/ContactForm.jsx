// src/components/ContactForm.jsx
import React, { useState } from "react";
import { FiUser, FiMail, FiMessageSquare } from "react-icons/fi";

const ContactForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    onSuccess();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiUser className="text-gray-400" />
          </div>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="pl-10 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Bob"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="pl-10 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Your Message
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3">
            <FiMessageSquare className="text-gray-400" />
          </div>
          <textarea
            id="message"
            name="message"
            rows="5"
            required
            value={formData.message}
            onChange={handleChange}
            className="pl-10 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="How can we help you?"
          ></textarea>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full !bg-blue-950 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactForm;