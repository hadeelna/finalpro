import React from 'react'
import { useState } from 'react';
import Appheader from './Appheader';
const Deliverypersonlist = ()=>{
  const [orders, setOrders] = useState([]);

  return (
    <div>    
      <Appheader/>
        <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Client</th>
        <th>Phone Number</th>
        <th>Order ID</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order) => (
        <tr key={order.id}>
          <td>{order.name}</td>
          <td>{order.client}</td>
          <td>{order.phone_number}</td>
          <td>{order.order_id}</td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>
  )
}

export default Deliverypersonlist