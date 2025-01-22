const express = require('express');
const History = require('../models/History');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post('/add', verifyToken, async (req, res) => {
    const { orderId, item, recipe } = req.body;
    const userId = req.user.id; 
    if (!orderId || !item || !recipe) {
      return res.status(400).json({ message: 'Order details are required' });
    }
  
    try {
      let userHistory = await History.findOne({ userId });
  
      if (!userHistory) {
        userHistory = new History({
          userId,
          orders: [{
            orderId,
            item,
            recipe,
          }],
        });
        await userHistory.save();
      } else {
        userHistory.orders.push({
          orderId,
          item,
          recipe,
        });
        await userHistory.save();
      }
  
      res.status(201).json({ message: 'Order history added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error adding order history' });
    }
  });
router.get('/get', verifyToken, async (req, res) => {
  const userId = req.user.id; 

  try {
    const userHistory = await History.findOne({ userId });

    if (!userHistory) {
      return res.status(404).json({ message: 'No order history found for this user' });
    }

    res.json(userHistory.orders); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching order history' });
  }
});

module.exports = router;
