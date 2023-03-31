import React from 'react'
import { useState } from 'react';
import {  useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
      event.preventDefault();
      try {
      fetch('http://localhost:4000/signup', {  

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })

      }) 
      navigate("/");

    } catch (error) {
     

    }
    };
  return (
    <form onSubmit={handleSubmit}>
        
    <label>
      Username:
      <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
    </label>
    <br />
    <label>
      Password:
      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
    </label>
    <br />
    <button type="submit">Sign up</button>
  </form>
);
}

export default Signup