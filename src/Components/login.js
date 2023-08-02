import React, { useState } from 'react';
import axios from 'axios';
import styles from './login.module.css'
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });
      const { token, userType } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);

      if (userType === 'admin') {
        window.location.href = '/products'; // Redirect to admin page
       } else {
        window.location.href = '/DeliveryPersonOrders'; // Redirect to default page for other user types
      }

    
    } catch (error) {
      console.error('Failed to login:', error);
      setErrorMessage('שם משתמש או סיסמה שגויים');  
      console.log(error)
    }
  };

  return (
    <div>
    <div className={styles.login} >
      <form onSubmit={handleLogin}>
      {errorMessage && <p>{errorMessage}</p>}
        <label>
          שם משתמש:
          <input type="text2" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          סיסמא:
          <br/>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">כניסה</button>
      </form>
      <a href='signup'>signup</a>
    </div>
    </div>
  );
};

export default Login;
