//This is the general layout for all pages
import React from "react";
import CodeUploader from "../components/CodeUploader"; // Adjust path if needed
import "./FigmaLayout.css"; // Make sure this file is in the same folder

function FigmaLayout() {
  return (
    <div className="page-wrapper">
      {/* Top Navigation Bar */}
      <header className="top-nav">
        <div className="nav-left">
          <a href="#" className="nav-brand">cyvex</a>
          <nav className="nav-links">
            <a href="#">solutions</a>
            <a href="#">customers</a>
            <a href="#">services</a>
            <a href="#">insights</a>
            <a href="#">company</a>
          </nav>
        </div>
        <div className="nav-right">
          <button className="login-btn">log in</button>
          <button className="try-btn">try it</button>
        </div>
      </header>

      {/* Main Layout: Sidebar and Main Content */}
      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <a href="#">upload code</a>
          <a href="#">view results</a>
          <a href="#">view reports</a>
          <a href="#">settings</a>
          <a href="#">log out</a>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <h1 className="page-title">Upload Code</h1>
          <CodeUploader />
        </main>
      </div>
    </div>
  );
}

export default FigmaLayout;
