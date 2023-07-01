const express = require('express');
const cors = require('cors');
const connection = require('./db');
const bcrypt = require('bcrypt');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const jwt = require('jsonwebtoken');
app.use(cors());




app.post('/signup', async (req, res) => {
  const { username, password, userType } = req.body;

  try {
    // Check if the user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    connection.query(checkUserQuery, [username], async (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to create user' });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password,1);

      // Create a new user in the database
      const insertUserQuery = 'INSERT INTO users (username, password, userType) VALUES (?, ?, ?)';
      connection.query(insertUserQuery, [username, hashedPassword, userType], (error, results, fields) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Failed to create user' });
        }

        res.status(201).json({ message: 'User created successfully' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    connection.query(checkUserQuery, [username], async (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to login' });
      }
      if (results.length === 0) {

        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = results[0];

      // Compare the password
      //const saltRounds = 10;
      //const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log(user.password)

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword)

      const passwordMatch = await bcrypt.compare(password, user.password);
      
      console.log(passwordMatch)
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ username: user.username, userType: user.userType }, 'your_secret_key');
      res.status(200).json({ token, userType: user.userType });
      console.log(user.userType)

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to login' });
  }
});
app.post('/Add-product', (req, res) => {
  console.log('Received request:', req.body);
  const { name, quantity } = req.body;
  const ADD_QUERY = `INSERT INTO products(name,quantity) VALUES (?, ?)`;
  connection.query(ADD_QUERY, [name, quantity], (err, result) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Result:', result);
      res.send('product has been added');
    }

  });
});
app.delete('/delete-product/:id', (req, res) => {
  console.log('Received request:', req.params.id);
  const { id } = req.params;
  const DELETE_PACKAGE_QUERY = `DELETE FROM package_products2  WHERE product_id = ?`;
  connection.query(DELETE_PACKAGE_QUERY, [id], (err, result) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Result:', result);
      const DELETE_PRODUCT_QUERY = `DELETE FROM products WHERE id = ?`;
      connection.query(DELETE_PRODUCT_QUERY, [id], (err, result) => {
        if (err) {
          console.log('Error:', err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('Result:', result);
          if (result.affectedRows > 0) {
            res.send(`Product ${id} has been deleted`);
          } else {
            res.send(`Product ${id} not found`);
          }
        }
      });
    }
  });
});

app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const newQuantity = req.body.quantity;
  const sql = 'UPDATE products SET quantity = ?  WHERE id = ?';
  connection.query(sql, [newQuantity, productId], (error, results, fields) => {
    if (error) throw error;
    console.log(`Product with id ${productId} updated with quantity ${newQuantity}`);
    if (!res.headersSent) {
      res.status(200).send('Response sent successfully');
    }
  });


  res.send('Product quantity updated successfully!');
});

app.get("/api/products", (req, res) => {
  const sql = "SELECT * FROM products";
  connection.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get("/type", (req, res) => {
  const sql = "SELECT * FROM packgest";
  connection.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});



app.post('/package_products2/add-product-by-name', (req, res) => {
  const { package_id, name, quantity } = req.body;
  if (!package_id || !name || !quantity) {
    return res.status(400).json({ message: 'Invalid request parameters' });
  }

  const insertQuery = 'INSERT INTO package_products2 (package_id, product_id, quantity) SELECT ?, id, ? FROM products WHERE name = ?';
  const values = [package_id, quantity, name];
  console.log(values)
  connection.query(insertQuery, values, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add product to package' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ message: `Product '${name}' not found` });
      } else {
        console.log(`Product ${name} added to package successfully`);
        res.status(200).json({ message: 'Product added to package successfully' });
      }
    }
  });

});

app.get("/package_products2", (req, res) => {
  const sql = "SELECT package_products2.package_id, products.name,package_products2.product_id, package_products2.quantity, packgest.type FROM package_products2 JOIN products ON package_products2.product_id = products.id  JOIN packgest ON package_products2.package_id = packgest.id"
  connection.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.get("/Allorders", (req, res) => {
  const sql = "SELECT orders.id, packgest.type,  DATE_FORMAT(orders.order_date, '%Y-%m-%d') AS order_date, customers.cuname, orders.status FROM orders JOIN customers ON orders.customer_id = customers.id JOIN packgest ON orders.package_id = packgest.id";
  connection.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results)
  });
});
app.get("/package", (req, res) => {
  const sql = "SELECT * FROM packgest";
  connection.query(sql, (error, results) => {
    if (error) throw error;
    res.s8u7y6end(results);
  });
});
app.post('/orders', (req, res) => {
  const { package_id, order_date } = req.body;
  const selectQuery = `SELECT id FROM customers WHERE status = 'ACTIVE'`;
  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Failed to retrieve active customers:', error);
      return res.status(500).json({ message: 'Failed to create orders' });
    }
    const activeCustomerIds = results.map((row) => row.id);
    console.log(activeCustomerIds);

    if (activeCustomerIds.length === 0) {
      console.error('No active customers found');
      return res.status(404).json({ message: 'No active customers found' });
    }

    const insertQuery = `INSERT INTO orders (id, package_id, customer_id, order_date, status) VALUES ?`;

    const values = activeCustomerIds.map((customerId, index) => [
      generateOrderId(index + 1),
      package_id,
      customerId,
      order_date,
      'בהכנה' // או ערך התחלתי אחר שאתה רוצה

    ]);

    function generateOrderId(orderIndex) {
      const orderId = orderIndex.toString().padStart(0);
      return orderId;
    }

    connection.query(insertQuery, [values], (error, results) => {
      if (error) {
        console.error('Failed to create orders:', error);
        return res.status(500).json({ message: 'Failed to create orders' });
      }

      console.log('Orders created successfully');
      res.json({ message: 'Orders created successfully' });
    });
  });
});
// מסלול API לעדכון סטאטוס הזמנה לערך קבוע
app.put('/orders2/:id/status', (req, res) => {
  const orderId = req.params.id;
  const newStatus = 'הלקוח קיבל'; // הערך הקבוע שתרצה לעדכן לסטאטוס ההזמנה

  const updateQuery = 'UPDATE orders SET status = ? WHERE id = ?';
  connection.query(updateQuery, [newStatus, orderId], (error, result) => {
    if (error) {
      console.error('Failed to update order status:', error);
      return res.status(500).json({ message: 'Failed to update order status' });
    }
    res.json({ message: 'Order status updated successfully' });
  });
});
app.put('/orders/:id/status', (req, res) => {
  const orderId = req.params.id;
  const newStatus = 'מוכנה'; // הערך הקבוע שתרצה לעדכן לסטאטוס ההזמנה

  const updateQuery = 'UPDATE orders SET status = ? WHERE id = ?';
  connection.query(updateQuery, [newStatus, orderId], (error, result) => {
    if (error) {
      console.error('Failed to update order status:', error);
      return res.status(500).json({ message: 'Failed to update order status' });
    }
    res.json({ message: 'Order status updated successfully' });
  });
});
app.get('/delivery-persons/orders', (req, res) => {
  const { phone } = req.query;
  const selectQuery = 
  `SELECT orders.id, orders.package_id,  DATE_FORMAT(orders.order_date, '%Y-%m-%d') AS order_date, orders.status, customers.cuname,customers.address, customers.deliveryperson_id, deliveryperson.phone_number
  FROM orders
  JOIN customers ON orders.customer_id = customers.id
  JOIN deliveryperson ON customers.deliveryperson_id = deliveryperson.id
  WHERE (orders.status = 'מוכנה' OR orders.status = 'הלקוח קיבל')
  AND deliveryperson.phone_number = ?`;

  connection.query(selectQuery, [phone], (error, results) => {
    if (error) {
      console.error('Failed to retrieve delivery person orders:', error);
      return res.status(500).json({ message: 'Failed to retrieve delivery person orders' });
    }
    console.log(phone)

    res.json(results);
  });
});



app.post('/Add-pacakge', (req, res) => {
  console.log('Received request:', req.body);
  const { id, type } = req.body;
  const ADD_QUERY = `INSERT INTO packgest (id,type) VALUES (?, ?)`;
  connection.query(ADD_QUERY, [id, type], (err, result) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Result:', result);
      res.send('product has been added');
    }
  });
});
app.post('/order-ready', (req, res) => {
  const selectQuery = `SELECT id FROM orders WHERE status = 'ready'`;
  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Failed to retrieve active customers:', error);
      return res.status(500).json({ message: 'Failed to create orders' });
    }
  })
})
app.post('/update-product-quantities', (req, res) => {
  const packageId = req.body.packageId;
  // שאילתת ה-SQL לחישוב כמות המוצרים בחבילה
  const packageQuantitiesQuery = `
    SELECT package_id, SUM(quantity) AS totalQuantity
    FROM package_products2
    WHERE package_id = ?
    GROUP BY package_id;
  `;
  // שאילתת ה-SQL לעדכון המלאי של המוצרים
  const updateStockQuery = `
    UPDATE products
    SET quantity = quantity - (
      SELECT SUM(quantity) AS totalQuantity
      FROM package_products2
      WHERE package_id = ?
    )
    WHERE id IN (
      SELECT product_id
      FROM package_products2
      WHERE package_id = ?
    ) AND quantity >= (
      SELECT SUM(quantity) AS totalQuantity
      FROM package_products2
      WHERE package_id = ?
    );
  `;

  // שאילתת ה-SQL לשליפת הכמות המעודכנת מהטבלה
  const getUpdatedQuantityQuery = `
    SELECT quantity
    FROM products
    WHERE id = ?;
  `;

  connection.query(packageQuantitiesQuery, [packageId], (packageErr, packageResults) => {
    if (packageErr) {
      console.error('Error calculating package quantities:', packageErr);
      return res.status(500).json({ error: 'Failed to calculate package quantities' });
    }

    const packageQuantity = packageResults.length > 0 ? packageResults[0].totalQuantity : 0;

    connection.query(
      updateStockQuery,
      [packageId, packageId, packageId],
      (updateErr, updateResults) => {
        if (updateErr) {
          console.error('Error updating product stock:', updateErr);
          return res.status(500).json({ error: 'Failed to update product stock' });
        }

        connection.query(getUpdatedQuantityQuery, [packageId], (quantityErr, quantityResults) => {
          if (quantityErr) {
            console.error('Error retrieving updated quantity:', quantityErr);
            return res.status(500).json({ error: 'Failed to retrieve updated quantity' });
          }

          const updatedQuantity = quantityResults.length > 0 ? quantityResults[0].quantity : 0;

          console.log('Product stock updated successfully');
          return res.status(200).json({ message: 'Product stock updated successfully', quantity: updatedQuantity });
        });
      }
    );
  });
});
app.get('/customers', (req, res) => {


  const selectQuery = "SELECT customers.id, customers.cuname, customers.phone_number, customers.status, customers.address, deliveryperson.name FROM customers JOIN deliveryperson ON customers.deliveryperson_id = deliveryperson.id;  "
  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Failed to retrieve customers:', error);
      return res.status(500).json({ message: 'Failed to retrieve customers' });
    }
    res.json(results);
  });
});
app.post('/customers', (req, res) => {
  const { name, phone_number, status, address, deliveryperson_name } = req.body;
  const insertQuery = 'INSERT INTO customers (cuname, phone_number, status, address, deliveryperson_id) VALUES (?, ?, ?, ?, (SELECT id FROM deliveryperson WHERE name = ? LIMIT 1))';
  const values = [name, phone_number, status, address, deliveryperson_name];

  connection.query(insertQuery, values, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add customer' });
    } else {
        console.log(`customer ${name} added successfully`);
        res.status(200).json({ message: 'Customer added successfully' });
    }
  });
});
app.get('/customers/:deliverypersonName', (req, res) => {
  const deliverypersonName = req.params.deliverypersonName;
  
  const selectQuery = 'SELECT * FROM customers WHERE deliveryperson_id = (SELECT id FROM deliveryperson WHERE name = ? LIMIT 1)';
  connection.query(selectQuery, [deliverypersonName], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch customers' });
    } else {
      res.status(200).json(results);
    }
  });
});



// מסלול PUT לעדכון פרטי לקוח
app.put('/customers/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  const { name, phone_number } = req.body;
  const updateQuery = 'UPDATE customers SET cuname = ?, phone_number = ? WHERE id = ?';
  const values = [name, phone_number, customerId];

  connection.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error('Failed to update customer:', error);
      return res.status(500).json({ message: 'Failed to update customer' });
    }
    res.json({ message: 'Customer updated successfully' });
  });
});

// מסלול DELETE למחיקת לקוח
app.delete('/customers/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  const deleteQuery = 'DELETE FROM customers WHERE id = ?';

  connection.query(deleteQuery, customerId, (error, results) => {
    if (error) {
      console.error('Failed to delete customer:', error);
      return res.status(500).json({ message: 'Failed to delete customer' });
    }
    res.json({ message: 'Customer deleted successfully' });
  });
});


// Get all deliverypersons
app.get('/deliverypersons', (req, res) => {
  const selectQuery = 'SELECT * FROM deliveryperson';

  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Failed to fetch deliverypersons:', error);
      return res.status(500).json({ message: 'Failed to fetch deliverypersons' });
    }
    res.json(results);
  });
});

// Add a new deliveryperson
app.post('/deliverypersons', (req, res) => {
  const { name, phone_number } = req.body;
  const checkQuery = 'SELECT * FROM deliveryperson WHERE phone_number = ?';
  const insertQuery = 'INSERT INTO deliveryperson (name, phone_number) VALUES (?, ?)';
  const values = [name, phone_number];

  // Check if the deliveryperson already exists
  connection.query(checkQuery, [phone_number], (error, results) => {
    if (error) {
      console.error('Failed to check deliveryperson:', error);
      return res.status(500).json({ message: 'Failed to add deliveryperson' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Deliveryperson already exists' });
    }

    // Add the deliveryperson
    connection.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error('Failed to add deliveryperson:', error);
        return res.status(500).json({ message: 'Failed to add deliveryperson' });
      }
      res.json({ message: 'Deliveryperson added successfully' });
    });
  });
});


// Update a deliveryperson
app.put('/deliverypersons/:deliverypersonId', (req, res) => {
  const deliverypersonId = req.params.deliverypersonId;
  const { name, phone_number } = req.body;
  const updateQuery = 'UPDATE deliveryperson SET name = ?, phone_number = ? WHERE id = ?';
  const values = [name, phone_number, deliverypersonId];

  connection.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error('Failed to update deliveryperson:', error);
      return res.status(500).json({ message: 'Failed to update deliveryperson' });
    }
    res.json({ message: 'Deliveryperson updated successfully' });
  });
});

// Delete a deliveryperson
app.delete('/deliverypersons/:deliverypersonId', (req, res) => {
  const deliverypersonId = req.params.deliverypersonId;
  const deleteQuery = 'DELETE FROM deliveryperson WHERE id = ?';

  connection.query(deleteQuery, deliverypersonId, (error, results) => {
    if (error) {
      console.error('Failed to delete deliveryperson:', error);
      return res.status(500).json({ message: 'Failed to delete deliveryperson' });
    }
    res.json({ message: 'Deliveryperson deleted successfully' });
  });
});



// קריאה לפונקציה לעדכון כמויות המוצרים

//UPDATE products JOIN ( SELECT package_id, SUM(quantity) AS total_quantity FROM package_products2 GROUP BY package_id ) AS package_quantities ON products.id = package_quantities.package_id SET products.quantity = products.quantity - package_quantities.total_quantity WHERE products.quantity >= package_quantities.total_quantity;


app.listen(4000, () => {
  console.log('running on port 4000')
});