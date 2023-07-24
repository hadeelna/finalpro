import React from 'react'
import { useState,useEffect } from 'react';
import axios from'axios'
import Appheader from './Appheader';
const Orders = () => {
  const [orders, setorders] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:4000/Allorders')
      .then(response => {
        setorders(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/orders/${orderId}/status`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };
  const updateAllOrdersStatus = async (newStatus) => {
    try {
      // Update the status for all orders
      await Promise.all(
        orders.map((order) => axios.put(`http://localhost:4000/orders/${order.id}/status`, { status: newStatus }))
      );
      // Refresh the orders list after updating the status
      const updatedOrders = orders.map((order) => ({ ...order, status: newStatus }));
      setorders(updatedOrders);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const deleteorder = async (orderId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/orders/${orderId}`);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to delete orders:', error);
    }
  };
  const deleteAllorders = async (ordeId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/orders`);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to delete orders:', error);
    }
  };
  return (
       
  <div> 
        <Appheader/>
 <table>
        <thead>
          <tr>
            <th> הזמנה מספר</th>
            <th>  סוג </th>
            <th>  תאריך </th>
            <th>   שם הלקח</th>
            <th> סטאטוס</th>
            <th> להזמנה מוכנה</th>
            <th> למחיקה</th>

          </tr>
        </thead>
         <tbody>
          {orders.map((order,index) => (
        <tr key={order.id}>      
             <td>{order.id}</td>
              <td>{order.type}</td>
              <td>{order.order_date}</td>
              <td>{order.cuname}</td>
              <td>{order.status}</td>

            <td> <button onClick={() => updateOrderStatus(order.id,order.status)}>להזמנה מוכנה</button>
            </td>     
            <td>
            <button onClick={() => deleteorder(order.id)}> מחיקה  </button>
            </td>
            </tr>
          ))}
        </tbody>  
</table>
<div>

        <button onClick={() => updateAllOrdersStatus('מוכנה')}>עדכן כל ההזמנות למוכנות</button>
        <button onClick={() => deleteAllorders()}> מחיקת כל ההזמנות</button>

      </div>
  </div>

           
  )
}
export default Orders