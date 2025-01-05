const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String, // Type of marine organism
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
    },
    success: {
      type: Boolean, // Whether the session was completed successfully
      default: false,
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
    },

    


  });

  module.exports = mongoose.model('Sessions', sessionSchema);
  