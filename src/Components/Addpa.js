import React, {useEffect, useState } from 'react';
import axios from 'axios';
import Appheader from './Appheader';
function Addpa() {
  const [packages, setPackages] = useState([]);
  const [packages1, setPackages2] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:4000/type')
      .then(response => {
        setPackages2(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    // Fetch product data from backend API
    fetch('http://localhost:4000/package_products2')
    .then(response => response.json())
    .then(data => setPackages(data));
}, []);
    const [id, setId] = useState('');
    const [type, setType] = useState('');
    const handleSubmit2 = (event) => {
      event.preventDefault();
      const data = { id, type };
      axios.post('http://localhost:4000/Add-pacakge', data)
        .then(response => {
          console.log(response);
          alert('Product has been added');
        })
        .catch(error => {
          console.log(error);
          alert('Error: Please try again later');
        });
    };
  const [packageId, setPackageId] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:4000/update-product-quantities', { packageId })
      .then(response => {
        console.log('Stock updated successfully');
        // כאן תוכלי להוסיף פעולות נוספות שתרצי לבצע לאחר עדכון המלאי
  
        // בקשה שנייה
        return axios.post('http://localhost:4000/package_products2/add-product-by-name', {
          package_id: packageId,
          name: productName,
          quantity: quantity,
        });
      })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Failed to update stock:', error);
        setErrorMessage('Failed to add product to package');
      });
  };
  function PlaceOrder(packageId, productId) {
    fetch('http://localhost:4000/update-product-quantities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        packageId: packageId,
        productId: productId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Product stock updated successfully:', data);
      })
      .catch((error) => {
        console.error('Failed to update product stock:', error);
      });
  }
  
  function handlePlaceOrder(packageId, productId) {
    fetch('http://localhost:4000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        package_id: packageId,
        productId: productId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Order created successfully:', data);
        // קריאה לפונקציה PlaceOrder לעדכון המלאי
        PlaceOrder(packageId, productId);
      })
      .catch((error) => {
        console.error('Failed to create order:', error);
      });
  }
  

  return (
    <div>
      <Appheader/>
    <form onSubmit={handleSubmit}>
      {errorMessage && <p>{errorMessage}</p>}
      <label>
        Package ID:
        <input type="text" value={packageId} onChange={(event) => setPackageId(event.target.value)} />
      </label>
      <label>
        Product name:
        <input type="text" value={productName} onChange={(event) => setProductName(event.target.value)} />
      </label>
      <label>
        Quantity:
        <input type="text" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
      </label>
      <button type="submit">Add Product</button>
    </form>
       <form onSubmit={handleSubmit2}>
      <label>
        ID:
        <input type="text" value={id} onChange={e => setId(e.target.value)} />
      </label>
      <br />
      <label>
        Type:
        <input type="text" value={type} onChange={e => setType(e.target.value)} />
      </label>
      <br />
      <button type="submit">Add Package</button>
    </form>
    <table>
  <thead>
    <tr>
      <th>סוג החבילה</th>
      <th>שם המוצר</th>
      <th>כמות בחבילה</th>
    </tr>
  </thead>
  <tbody>
    {packages.map((pack, index) => (
      <tr key={index}>
        <td>{index === 0 ? pack.type : ''}</td>
        <td>{pack.name}</td>
        <td>{pack.quantity}</td>
        <td>{pack.product_id}</td>
        <td>
          {index === 0 && <button onClick={() => handlePlaceOrder(pack.package_id, pack.product_id)}>Place Order</button>}
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}
export default Addpa