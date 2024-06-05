const jwt = require('jsonwebtoken');
require('dotenv').config();

// Sample user payload
const user = {
  id: 'testUserId',
  username: 'testUser'
};

// Generate JWT token using the secret key from the environment variable
const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log('JWT Token:', token);
