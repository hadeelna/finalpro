// Deliverypersons.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appheader from './Appheader';

const Deliverypersons = () => {
  const [deliverypersons, setDeliverypersons] = useState([]);
  const [name, setName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');

  useEffect(() => {
    fetchDeliverypersons();
  }, []);

  const fetchDeliverypersons = async () => {
    try {
      const response = await axios.get('http://localhost:4000/deliverypersons');
      setDeliverypersons(response.data);
    } catch (error) {
      console.error('Failed to fetch deliverypersons:', error);
    }
  };
 
  const addDeliveryperson = async () => {
    try {
      const response = await axios.post('http://localhost:4000/deliverypersons', { name, phone_number });
      console.log(response.data);
      fetchDeliverypersons();
    } catch (error) {
      console.error('Failed to add deliveryperson:', error);
        alert('שליח קיים!');
    }
  };
  const updateDeliveryperson = async (DeliverypersonId) => {
    const updatedName = prompt(':הקלד שם חדש');
    const updatedPhone_number = prompt(':הקלד מספר טלפון חדש');
    try {
      const response = await axios.put(`http://localhost:4000/deliverypersons/${DeliverypersonId}`, {
        name: updatedName,
        phone_number: updatedPhone_number
      });
      console.log(response.data);
      fetchDeliverypersons();
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };
  const deleteDeliveryperson = async (deliverypersonId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/deliverypersons/${deliverypersonId}`);
      console.log(response.data);
      fetchDeliverypersons();
    } catch (error) {
      console.error('Failed to delete deliveryperson:', error);
    }
  };

  return (
    <div>
      <Appheader/>
      <h2>רשימת שליחים</h2>

      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button onClick={addDeliveryperson}>הוסף שליח</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>שם מלא</th>
            <th>מספר טלפון</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {deliverypersons.map((deliveryperson) => (
            <tr key={deliveryperson.id}>
              <td>{deliveryperson.name}</td>
              <td>{deliveryperson.phone_number}</td>
              <td>
                <button onClick={() => deleteDeliveryperson(deliveryperson.id)}>
                  Delete
                </button>
                <button onClick={() => updateDeliveryperson(deliveryperson.id)}>
          Update
        </button>
        
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Deliverypersons;
