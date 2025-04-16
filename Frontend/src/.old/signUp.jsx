import React, { useState } from 'react';
import { signUpUser, resendVerificationEmail } from '../controller/authController';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [showResend, setShowResend] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    try {
      const response = await signUpUser(email, username, password);

      if (response.error) {
        setError(response.error);
        return;
      }

      setMessage('Sign-up successful! Check your email for confirmation.');
      // Show "Resend Email" button if sign-up is successful
      if (!response.error) setShowResend(true);
    } catch (err) {
      setError('An error occurred during sign-up.');
    }
  };

  const handleResendEmail = async () => {
    const response = await resendVerificationEmail(email);
    
    if (response.error) {
      setMessage('');
      setError(response.error); // Show error message
    } else {
      setError('');
      setMessage(response.message); // Show success message
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {showResend && (
        <button onClick = {handleResendEmail}>Resend Vertification Email</button>
      )}
    </div>
  );
};

export default SignUp;