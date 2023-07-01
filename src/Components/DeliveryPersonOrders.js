import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeliveryPersonOrders() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    if (phone) {
      fetchDeliveryPersonOrders();
    }
  }, [phone]);

  const fetchDeliveryPersonOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/delivery-persons/orders?phone=${phone}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch delivery person orders:', error);
    }
  };

  const updateOrderStatus2 = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/orders2/${orderId}/status`, { status: newStatus });
      setForceUpdate(!forceUpdate); // Trigger force update
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const updateAllOrdersStatus2 = async (newStatus) => {
    try {
      await Promise.all(
        orders.map((order) => axios.put(`http://localhost:4000/orders2/${order.id}/status`, { status: newStatus }))
      );
      // Update the status in the orders list
      const updatedOrders = orders.map((order) => ({ ...order, status: newStatus }));
      setOrders(updatedOrders);
      setForceUpdate(!forceUpdate); // Trigger force update
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  return (
    <div>
      <h3>אנא הקליד את מס הטלפון</h3>
      <input type="text" value={phone} onChange={handlePhoneChange} />
      <button onClick={fetchDeliveryPersonOrders}>Fetch Orders</button>
      <table>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.type}</td>
              <td>{order.order_date}</td>
              <td>{order.cuname}</td>
              <td>{order.address}</td>

              <td>{order.status}</td>
              <td>
                <button onClick={() => updateOrderStatus2(order.id, order.status)}>לאישור קבלת הלקוח</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      <div>
        <button onClick={() => updateAllOrdersStatus2('הלקוח קיבל')}>עדכן כל ההזמנות שהתקבלו</button>
      </div>
    </div>
  );
}
export default DeliveryPersonOrders;