require('dotenv').config({ path: '../.env' });
const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());


const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const jwt = require('jsonwebtoken');

//Sign Up Route
app.post('/api/signup', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('study-sphere');
    const users = database.collection('users');

    // Check if the user already exists
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const newUser = { firstName, lastName, email, password: hashedPassword };
    await users.insertOne(newUser);

    res.status(201).json({ message: 'User created successfully' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

//Signin Route
app.post('/api/login', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('study-sphere');
    const users = database.collection('users');

    const { email, password } = req.body;
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Sign the JWT token and populate the payload with the user ID
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );
      res.status(200).json({ message: 'Login successful', token: token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
