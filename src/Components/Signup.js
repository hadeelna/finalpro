import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/signup', { username, password, userType });
      console.log(response.data);
    } catch (error) {
      console.error('Failed to signup:', error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
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
        <label>
          User Type:
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="">Select User Type</option>
            <option value="admin">Admin</option>
            <option value="deliveryperson">Delivery Person</option>
          </select>
        </label>
        <br />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};
export default Signup;