const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Define the server port
const port = 3019;

const app = express();

// Middleware for serving static files
app.use(express.static(path.join(__dirname)));

// Middleware to parse incoming form data (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/logininfo', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check for connection success
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the schema for user data
const userSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Message: String,
});

// Create the model
const Users = mongoose.model('Users', userSchema);

// Serve the HTML file on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/post', async (req, res) => {
  try {
    const { Name, Email, Message } = req.body;

    // Create a new user document
    const user = new Users({
      Name,
      Email,
      Message
    });

    // Save the user document to MongoDB
    await user.save();
    console.log('New User Entry:', user);

    // Send a response to the client
 res.send ('<h2>Thank you for your submission!</h2>')
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('<h2>Something went wrong. Please try again.</h2>');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
