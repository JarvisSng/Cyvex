import React, { useState, useEffect, useRef } from "react";
import AdminNav from "./AdminNav";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiChevronUp } from "react-icons/fi";
import ContactForm from "../components/ContactForm";

const AdminContacts = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const mapRef = useRef(null);
  const contentRef = useRef(null); // New ref for scrollable content

  // Check scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(contentRef.current?.scrollTop > 300);
    };
    const contentElement = contentRef.current;
    contentElement?.addEventListener('scroll', handleScroll);
    return () => contentElement?.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    contentRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Scroll to map function
  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const contactMethods = [
    {
      icon: <FiMail className="text-blue-500 text-2xl" />,
      title: "Email",
      value: "cyvexsupport@gmail.com",
      description: "We'll respond within 24 hours",
      action: () => window.location.href = "mailto:cyvexsupport@gmail.com"
    },
    {
      icon: <FiClock className="text-blue-500 text-2xl" />,
      title: "Support Hours",
      value: "24/7 Emergency",
      description: "Critical issues only",
      action: null
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Fixed Navbar */}
      <AdminNav />

      {/* Scrollable Content Area */}
      <div
        ref={contentRef}
        className="w-screen flex-1 overflow-y-auto pt-16 z-10" // pt-16 accounts for navbar height
      >
        <div className="p-6 md:p-8 lg:p-12  mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Contact Support
            </h1>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100 cursor-pointer"
                onClick={method.action || undefined}
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {method.title}
                  </h3>
                </div>
                <p className="text-gray-700 font-medium mb-1">
                  {method.value}
                </p>
                <p className="text-gray-500 text-sm">
                  {method.description}
                </p>
                {method.action && (
                  <p className="text-blue-600 text-sm mt-2 font-medium">
                    Click to {method.title === "Location" ? "view map" : "contact"}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-12">
            <div className="md:flex">
              {/* Left Side - Information */}
              <div className="md:w-1/3 bg-blue-50 p-8 text-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Get in Touch
                </h2>
                <p className="mb-6">
                  Have questions? Fill out the form and
                  our support team will get back to you promptly.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiSend className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Response Time</h4>
                      <p className="text-sm text-gray-600">
                        Typically within 24 hours (48 hours on weekends)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="md:w-2/3 p-8">
                {formSubmitted ? (
                  <div className="text-center py-12">
                    <div className="text-green-500 text-5xl mb-4">✓</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your message has been sent successfully. Our support team will contact you soon.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <ContactForm onSuccess={() => setFormSubmitted(true)} />
                )}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div
            ref={mapRef}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Cyvex Office Location</h2>
              <p className="text-gray-600 mt-2">461 Clementi Road, Singapore 599491</p>
            </div>
            <iframe
              title="SIM Headquarters Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.747704172798!2d103.76789031533184!3d1.329753999036913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1a4f3d3a4b3d%3A0x3a6b3e3b3a3a3a3a!2sSingapore%20Institute%20of%20Management!5e0!3m2!1sen!2ssg!4v1620000000000!5m2!1sen!2ssg"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="rounded-b-xl"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 !bg-blue-950 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
          aria-label="Back to top"
        >
          <FiChevronUp className="text-xl" />
        </button>
      )}
    </div>
  );
};

export default AdminContacts;