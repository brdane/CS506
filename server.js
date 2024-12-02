// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8000;
const MONGO_URI = 'mongodb://localhost:27017/mydatabase';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    initializeData(); // Initialize data after connection
  })
  .catch(err => console.error('MongoDB connection error:', err));


// Define the Product schema
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 }
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

// Function to initialize data
async function initializeData() {
  const existingProducts = await Product.find();
  if (existingProducts.length === 0) {
    const products = [
      { productName: 'Product 1', price: 10 },
      { productName: 'Product 2', price: 20 },
      { productName: 'Product 3', price: 30 }
    ];
    try {
      await Product.insertMany(products);
      console.log('Products initialized');
    } catch (error) {
      console.error('Error initializing products:', error);
    }
  } else {
    console.log('Products already initialized');
  }
}

// Simple API endpoint
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});



app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { quantity } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { quantity },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
