import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import necessary components for routing
import LoginUI from './pages/loginUI.jsx';
import SignUp from './pages/signUp.jsx';
import './index.css'; // Global styles

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<LoginUI />} />  {/* Route for login page */}
          <Route path="/signup" element={<SignUp />} />  {/* Route for sign-up page */}
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;