// ResetPassword.js

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const { id, token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3000/reset_password/${id}/${token}`, {
        password: password,
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error('Error during password reset:', error);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <label>New Password:</label>
        <input
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ResetPassword;
