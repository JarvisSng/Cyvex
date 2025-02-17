import React, { useState } from 'react';
import { loginUser } from '../controller/authController';
import { useNavigate } from 'react-router-dom';

const LoginUI = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();  // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser(email, password);

    if (response.error) {
      setError(response.error);
      return;
    }

    setUsername(response.username);
    setMessage(`Logged in as ${response.username}`);
  };

  // Function to handle redirection to the sign-up page
  const handleSignUpRedirect = () => {
    navigate('/signup/email');  // Redirect to the sign-up page
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button type="submit">Login</button>
      </form>
      
      <button onClick={handleSignUpRedirect} style={{ marginTop: '10px' }}>
        Sign Up
      </button>

      {username && <p>Welcome, {username}!</p>}
    </div>
  );
};

export default LoginUI;