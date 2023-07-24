import React, { useState,useEffect } from 'react';
import Appheader from './Appheader';
import axios from 'axios';
import styles from './product.module.css';

function AddProductForm() {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState();

  useEffect(() => {    
    fetch('http://localhost:4000/api/products')
      .then(response => response.json())
      .then((data) => setProducts(data.map((product) => ({ ...product, localQuantity: product.quantity }))));
  }, []);
  const handleQuantityChange = (productId, newQuantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, localQuantity: newQuantity };
        } else {
          return product;
        }
      })
    );
  };

  const handleUpdate = async (id, newQuantity) => {
    try {
      const response = await axios.put(`http://localhost:4000/products/${id}`, { quantity: newQuantity });
      console.log(response.data);
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          if (product.id === id) {
            return { ...product, quantity: newQuantity };
          } else {
            return product;
          }
        })
      );
    } catch (error) {
      console.log(error.response.data);
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
    setProducts((prevProducts) => prevProducts.map((product) => ({ ...product, localQuantity: product.quantity })));

  };

  return (
    <div>
      <Appheader/>
      <div className={styles['form-container']}>
        <form onSubmit={handleSubmit}>
          <label className={styles['form-label']}>
           שם המוצר
            <br/>

            <input
              type="text"
              className={styles['form-input']}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className={styles['form-label']}>
            כמות במלאי
            <br/>
            <input
              type="number"
              className={styles['form-input']}
              onChange={(event) => setQuantity(event.target.value)}

            />
          </label>
          <button type="submit" className={styles['form-button']}>
            הוספת מוצר
          </button>
        </form>
      </div>

    <div>
    <table className={styles['product-table']}>
          <thead>
            <tr>
              <th>שם</th>
              <th>כמות במלאי</th>
              <th>הגדלת כמות</th>
              <th> מחיקת מוצר</th>

            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>
                <input
                    type="text"
                    className={styles['product-input']}
                    value={quantity}
                    onChange={(event) => {
                      const newQuantity = Number(event.target.value);
                      handleQuantityChange(product.id, newQuantity);
                    }}
                  />
                  <button
                    className={styles['product-button']}
                    onClick={() => handleUpdate(product.id, product.localQuantity)}
                  >
                    +
                  </button>
                </td>
                <td>
                  <button
                    className={styles['product-button']}
                    onClick={() => handleDelete(product.id)}
                  >
                    למחוק
                  </button>
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