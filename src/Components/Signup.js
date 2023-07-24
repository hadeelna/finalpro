import React, { useState } from 'react';
import axios from 'axios';
import styles from './login.module.css'

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/signup', { username, password, userType });
      console.log(response.data);
      window.location.href = '/'; // Redirect to admin page

    } catch (error) {
      console.error('Failed to signup:', error);
    }
  };

  return (
    <div className={styles.login}>
      <h2>רישום ראשוני</h2>
      <form onSubmit={handleSignup}>
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
        <label>
          סוג משתמש:
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="">בחר סוג משתמש</option>
            <option value="admin">מנהל</option>
            <option value="deliveryperson">שליח</option>
          </select>
          <br/>
        </label>
        <br />
        <button type="submit">Signup</button>
        <br/>
        <a href='/'>to log in</a>
      </form>
    </div>
  );
};
export default Signup;