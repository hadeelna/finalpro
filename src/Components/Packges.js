import React, { useEffect,useState } from 'react';
import Appheader from './Appheader';

const Packges = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [items, setItems] = useState([]);
  const [packages, setPackages] = useState([]);
  useEffect(() => {
    const savedPackages = localStorage.getItem("packages");
    if (savedPackages) {
      setPackages(JSON.parse(savedPackages));
    }
  }, []);
  const handleAddItem = (event) => {
    event.preventDefault();
    const newItem = { name: name, quantity: quantity };
    setItems([...items, newItem]);
    setName('');
    setQuantity('');
  };

  const handleAddPackage = (event) => {
    event.preventDefault();
    const newPackage = { items: items };
    setPackages([...packages, newPackage]);
    setItems([]);
  };

  return (
    <div>
      <Appheader />
      <form onSubmit={handleAddItem}>
        <label>
          Item Name:
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Quantity:
          <input type="text" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
        </label>
        <button type="submit">Add Item</button>
      </form>
      <form onSubmit={handleAddPackage}>
        {items.map((item, index) => (
          <div key={index}>
            <p>{item.name} - {item.quantity}</p>
          </div>
        ))}
        <button type="submit">Add Package</button>
      </form>
      {packages.map((pack, index) => (
        <div key={index}>
          <h3>Package {index + 1}</h3>
          {pack.items.map((item, index) => (
            <div key={index}>
              <p>{item.name} - {item.quantity}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
  
export default Packges