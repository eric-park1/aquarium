const marineSchema = new mongoose.Schema({
    type: {
      type: String, 
      required: true,
    },
    catchTime: {
      type: Number, 
      required: true,
    },
    caughtBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session', 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Tree = mongoose.model('Tree', TreeSchema);
  module.exports = Tree;