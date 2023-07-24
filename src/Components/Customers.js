import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appheader from './Appheader';
import App from '../App';
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [status, setstatus] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [address, setaddress] = useState('');
  const [deliveryperson_id, setdeliveryperson] = useState();
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const addCustomer = async () => {
    try {
      const response = await axios.post('http://localhost:4000/customers', { name, phone_number, status, address,       deliveryperson_name: deliveryperson_id // משנה את השם של השדה לשם המתאים בטבלת deliveryperson
    });
      console.log(response.data);
      fetchCustomers();
      setName('');
      setPhone_number('');
      setstatus('');
      setaddress('');
      setdeliveryperson('');
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/customers/${customerId}`);
      console.log(response.data);
      fetchCustomers();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const updateCustomer = async (customerId) => {
    const updatedName = prompt('Enter new name:');
    const updatedPhone_number = prompt('Enter new phone_number:');

    try {
      const response = await axios.put(`http://localhost:4000/customers/${customerId}`, {
        name: updatedName,
        phone_number: updatedPhone_number
      });
      console.log(response.data);
      fetchCustomers();
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  return (
    <div>
      <Appheader/>
      <table>
        <thead>
          <tr>
            <th>שם מלא</th>
            <th>מספר טלפון</th>
            <th>כתובת</th>
            <th>סטאטוס</th>
            <th>שליח</th>
            <th>תשלום</th>

          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.cuname}</td>
              <td>{customer.phone_number}</td>
              <td>{customer.address}</td>
              <td>{customer.status}</td>
              <td>{customer.deliveryperson_name}</td>
              <td>{customer.payment}</td>
              {console.log(customer.name)}
              <td>
                <button onClick={() => deleteCustomer(customer.id)}>מחיקה</button>
                <button onClick={() => updateCustomer(customer.id)}>עדכון</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>להוספת לקוח </h3>
      <input
        type="text"
        placeholder="שם מלא"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="phone_number"
        placeholder="מס טלפון"
        value={phone_number}
        onChange={(e) => setPhone_number(e.target.value)}
      />
         <input
        type="text"
        placeholder="כתובת"
        value={address}
        onChange={(e) => setaddress(e.target.value)}
      /> 
            <input
      type="text"
      placeholder="סטאטוס"
      value={status}
      onChange={(e) => setstatus(e.target.value)}
    />
           <input
        type="text"
        placeholder="שם השליח"
        value={deliveryperson_id}
        onChange={(e) => setdeliveryperson(e.target.value)}
      />
      <button onClick={addCustomer}>הוספה</button>
    </div>
  );
};

export default Customers;
