import React from 'react'
import styles from './headr.css'
import axios from 'react'

const Appheader = () => {
    const handleLogout = async () => {
      try {
        await axios.post('  http://localhost:4000/logout');
     
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/'; 
      } catch (error) {
        console.error('Failed to logout:', error);
        // Handle any errors that may occur during logout.
      }
    };
  
    
  return (
    <div>
<header >
  <nav>
    <ul>
    <li><a href="/products">ניהול מלאי</a></li>
    <li><a href="/Add">חבילות</a></li>
    <li><a href="/o"> ההזמנות</a></li>
      <li><a href="/Deliverypersons">שליח</a></li>
      <li><a href="/customers">לקוחות</a></li>
      <button onClick={handleLogout}>Logout</button>

    </ul>
  </nav>
</header>

    </div>
  )
}

export default Appheader