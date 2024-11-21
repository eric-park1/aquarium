const SessionSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    treePlanted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tree', // Reference to the Tree grown in this session
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Session = mongoose.model('Session', SessionSchema);
  module.exports = Session;