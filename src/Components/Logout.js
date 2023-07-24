import React from 'react';
import axios from 'axios';

function Logout() {
  const handleLogout = async () => {
    try {
      await axios.post('  http://localhost:4000/logout');
   
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/'; 
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
