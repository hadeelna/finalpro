import React, { useState,useEffect } from 'react';
import Appheader from './Appheader';

function AddProductForm(props) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // Fetch product data from backend API
    fetch('http://localhost:4000/api/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);


  const handleUpdate = async (productId, newQuantity) => {
    const response = await fetch(`http://localhost:4000/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });
    console.log(response)
    const data = await response.json();
    console.log('Server response:', data);
    // Update the product list with the new quantity
    setProducts(products.map(product => {
      if (product.id === productId) {
        return { ...product, quantity: newQuantity };
      } else {
        return product;
      }
    }));
  };
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState();
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
        <tr>
          <th>name</th>
          <th>quantity</th>
          <th>Edit quantity </th>
  
        </tr>
        <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.quantity}</td>
                <td>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}

                  />
      <button onClick={() => handleUpdate(product.id, quantity)}>Update</button>
                </td>{console.log(quantity)}
              </tr>
            ))}
    
      </tbody>
        </table>
    </div>
    </div>
  );
}
export default AddProductForm