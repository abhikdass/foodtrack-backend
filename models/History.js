// models/History.js
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orders: [{
    orderId: { type: String, required: true },
    item: { type: String, required: true },
    recipe: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
  }],
});

const History = mongoose.model('History', historySchema);

module.exports = History;
