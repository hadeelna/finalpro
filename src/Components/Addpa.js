import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appheader from './Appheader';
import styles from './pack.module.css';

function Addpa() {
  const [packages, setPackages] = useState([]);
  const [id, setId] = useState('');
  const [type, setType] = useState('');
  const [packageId, setPackageId] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    axios.get('http://localhost:4000/package_products2')
      .then(response => {
        setPackages(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleSubmit2 = (event) => {
    event.preventDefault();
    const data = { id, type };
    axios.post('http://localhost:4000/Add-pacakge', data)
      .then(response => {
        console.log(response);
        alert('Package has been added');
      })
      .catch(error => {
        console.log(error);
        alert('Error: Please try again later');
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:4000/package_products2/add-product-by-name', {
        type: packageId,
        name: productName,
        quantity: quantity,
        
      })
      console.log(type)
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        setErrorMessage('Failed to add product to package');  
            console.log(error)

      });
  };
  
  function handleDeletePackage(packageId) {
    axios.delete(`http://localhost:4000/delete-package/${packageId}`)
      .then(response => {
        console.log(response.data);
        // Remove the deleted package from the state
        setPackages(prevPackages => prevPackages.filter(pack => pack.package_id !== packageId));
        alert('Package has been deleted');
      })
      .catch(error => {
        console.log(error);
        alert('Error: Please try again later');
      });
  }
  function PlaceOrder(packageId, productId) {
    return fetch('http://localhost:4000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        package_id: packageId,
        productId: productId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create order');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Order created successfully:', data);
        return fetch('http://localhost:4000/update-product-quantities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            packageId: packageId,
            productId: productId,
          }),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('Product stock updated successfully:', data);
      })
      .catch((error) => {
        console.error('Failed to create order or update product stock:', error);
      });
  }
  
  function handlePlaceOrder(packageId, productId) {
    PlaceOrder(packageId, productId)
      .then(() => {
      })
      .catch((error) => {
        console.error('Order creation or product stock update failed:', error);
      });
  }

    return (
    <div>
      <Appheader />
      <div className={styles['form-container']}>
      <form onSubmit={handleSubmit2}>

        <label>
          ID:
          <input type="text" value={id} onChange={e => setId(e.target.value)} />
        </label>
        <label>
          Type:
          <input type="text" value={type} onChange={e => setType(e.target.value)} />
        </label>

        <button type="submit" className={styles['form-button']}>צור חבילה</button>
      </form>
      </div>
      <div className={styles['form-container']}>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p>{errorMessage}</p>}
        <label className={styles['form-label']}>
          Package type:
          <input type="text"    value={packageId} onChange={(event) => setPackageId(event.target.value)} />
        </label>
        <label className={styles['form-label']}>
          Product name:
          <input type="text"  value={productName} onChange={(event) => setProductName(event.target.value)} />
        </label>
        <label className={styles['form-label']}>
          Quantity:
          <input type="text" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
  </label>          

    <button type="submit" className={styles['form-button'] }>הוספת מוצרים לחבילה</button>
      </form>
      </div>
   
      <table>
    <thead>
      <tr>
        <th>סוג החבילה</th>
        <th>שם המוצר</th>
        <th>כמות בחבילה</th>
        <th>פעולות</th>
      </tr>
    </thead>
    <tbody>
      
  {packages.map((pack, index) => (
      <React.Fragment key={index}>
        {index === 0 || pack.package_id !== packages[index - 1].package_id ? (
      <>
        <tr>
          <td colSpan="4">______________________________________________________</td>
        </tr>
        <tr>
          <td rowSpan={packages.filter(p => p.package_id === pack.package_id).length}>{pack.type}</td>
          <td>{pack.name}</td>
          <td>{pack.quantity}</td>
          <td>
            {pack.package_id === packages[index - 1]?.package_id && index !== 0 ? null : (
              <button onClick={() => handlePlaceOrder(pack.package_id, pack.product_id)}> לבצע הזמנה
              </button>
            )}

             {pack.package_id === packages[index - 1]?.package_id && index !== 0 ? null : (
        <button onClick={() => handleDeletePackage(pack.package_id)}>למחוק הזמנה </button>
             ) }  
          </td>
        </tr>
      </>
    ) : (
      <tr>
        <td>{pack.name}</td>
        <td>{pack.quantity}</td>
        <td colSpan="4">
       
               </td>      </tr>
                   
    )}
      </React.Fragment>
    ))}
   </tbody>
  </table>

    </div>
  ); 
}

export default Addpa;
