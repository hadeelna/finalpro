import React from 'react'
import { useState } from 'react'
import {  useNavigate } from "react-router-dom";

const Login = () => {

    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
          const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })

          }); console.log("Request data: ", JSON.stringify({ username, password }));

          console.log(response);
        
          if (response.ok) {
            navigate("/products");

            console.log(response);
          } else if (response.status === 401) {
            console.error('Error: Invalid username or password');
          } else {
            console.error(`Error: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error(`Network error: `);
        }
        

    }			    

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
    <button type="submit">Login</button>
    <a href="/signup"> click to sign up</a>  </form>
  )
}

export default Login