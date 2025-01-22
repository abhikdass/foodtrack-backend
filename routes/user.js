const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
//registration
router.post('/register', async (req, res) => {
  try {
    
    const { name, email, password, username, gender, age } = req.body;
    if (!name || !email || !password || !username || !gender || !age) {
        return res.status(400).json({ message: 'All fields are required' });
      }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already in use' });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: 'Username already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
      gender,
      age,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '9999days' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '9999days' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {name: user.name, username: user.username, gender : user.gender, age :user.age},
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});
router.get('/checkUsername/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: 'Username already taken' });
  
      res.status(200).json({ message: 'Username is available' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  });
  
module.exports = router;
