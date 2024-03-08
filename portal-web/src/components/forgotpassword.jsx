
import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/forgotpassword', {
        email: email,
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error('Error during forgot password:', error);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ForgotPassword;