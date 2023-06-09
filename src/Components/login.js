import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });
      const { token, userType } = response.data;

      // Store the token and user type in the browser's localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);

      // Redirect to appropriate page based on user type
      if (userType === 'admin') {
        window.location.href = '/products'; // Redirect to admin page
       } else {
        window.location.href = '/DeliveryPersonOrders'; // Redirect to default page for other user types
      }
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
