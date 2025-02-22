import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginEmail from "./pages/loginEmail.jsx";
import LoginPassword from "./pages/loginPassword.jsx";
import SignUpEmail from "./pages/signUpEmail.jsx";
import SignUpUsername from "./pages/signUpUsername.jsx";
import SignUpPassword from "./pages/signUpPassword.jsx";
import SignUpConfirmation from "./pages/signUpConfirmation.jsx";
import "./index.css"; // Global styles

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<LoginEmail />} />  {/* Route for login page */}
          <Route path="/login/password" element={<LoginPassword />} />  {/* Route for login page */}
          <Route path="/signup/email" element={<SignUpEmail />} />
          <Route path="/signup/username" element={<SignUpUsername />} />
          <Route path="/signup/password" element={<SignUpPassword />} />
          <Route path="/signup/confirmation" element={<SignUpConfirmation />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;