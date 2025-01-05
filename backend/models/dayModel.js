const mongoose = require('mongoose');
//const Session = require('./session');
const User = require('./userModel');

const daySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  focusEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session', // Reference to the session schema
    },
  ],
});

module.exports = mongoose.model('dayTank', daySchema);