const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] }, 
  age: { type: Number, required: true, min: 0 }, 
}, {
  timestamps: true, 
});

module.exports = mongoose.model('User', userSchema);
