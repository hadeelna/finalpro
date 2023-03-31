const express = require('express');
const cors = require('cors');
const connection=require('./db');
const bcrypt = require('bcrypt');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(cors());
app.get('/products', (req,res) => {
res.send('list of all products')
})
app.post('/Add-product', (req,res) => {
  console.log('Received request:', req.body);
  const { name, quantity } = req.body;
  const ADD_QUERY = `INSERT INTO products(name,quantity) VALUES (?, ?)`;
connection.query(ADD_QUERY, [name, quantity], (err, result) => {   if (err) {
  console.log('Error:', err);
  res.status(500).send('Internal Server Error');
} else {
  console.log('Result:', result);
  res.send('product has been added');
}
}); });
app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const newQuantity = req.body.quantity;
  const sql =  'UPDATE products SET quantity = ?  WHERE id = ?';
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
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO admin (username, password) VALUES (?, ?)';
  const values = [username, hashedPassword];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error registering user');
    } else {
      res.status(200).send('User registered successfully');
    }
  });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'SELECT * FROM admin WHERE username = ? AND password = ?';
  const values = [username, hashedPassword];

  connection.query(
    query, values, (error, results, fields) => {
 
    if (error) {
      console.log(error);
      res.status(500).send('Error registering user');
    } else {
      res.status(200).send('User registered successfully');
    }
  });
});
// Start the server


app.listen (4000, () => {
console.log('running on port 4000')
})