import React, { useState,useEffect } from 'react';
import Appheader from './Appheader';
import axios from 'axios';

function AddProductForm() {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState();

  useEffect(() => {
    
    // Fetch product data from backend API
    fetch('http://localhost:4000/api/products')

      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  const handleUpdate = async (id, newQuantity) => {
    try {
      const response = await axios.put(`http://localhost:4000/products/${id}`, { quantity: newQuantity });
      console.log(response.data); // success message from the server
  
      // Update the product list with the new quantity
      setProducts(prevProducts =>
        prevProducts.map(product => {
          if (product.id === id) {
            return { ...product, quantity: newQuantity };
          } else {
            return product;
          }
        })
      );
    } catch (error) {
      console.log(error.response.data); // error message from the server
    }
  };
  
  function handleDelete(name) {
    axios.delete(`http://localhost:4000/delete-product/${name}`)
      .then(response => {
        console.log(response.data); // success message from the server
      })
      .catch(error => {
        console.log(error.response.data); // error message from the server
      });
  }
  const [name, setName] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:4000/Add-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
            },
      body: JSON.stringify({ name, quantity }),
    });
    const data = await response.json();
    console.log('Server response:', data);
  };

  return (
    <div>
      <Appheader/>
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label>
        Quantity:
        <input
          type="number"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
      </label>
                <button type="submit">Add Product</button>

    </form>  

    <div>
  <table>
    <thead>
      <tr>
        <th>name</th>
        <th>quantity</th>
        <th>Edit quantity</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <tr key={product.id}>
          <td>{product.name}</td>
          <td>{product.quantity}</td>
          <td>
            <input
              type="number"
              defaultValue={product.quantity}
              onChange={(event) => {
                const newQuantity = Number(event.target.value);
                handleUpdate(product.id, newQuantity);
              }}
            />
            <button onClick={() => handleUpdate(product.id, product.quantity)}>Update</button>
          </td>
          <td>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
}
export default AddProductForm