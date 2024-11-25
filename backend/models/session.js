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
    // treePlanted: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'marine', // Reference to the Tree grown in this session
    // },
    createdAt: {
      type: Date,
      default: Date.now,
    },


  });

//   const User = require('./models/User');
// const Session = require('./models/Session');
// const Tree = require('./models/Tree');

// async function createSession(userId, duration, treeType) {
//   const user = await User.findById(userId);
//   if (!user) throw new Error('User not found');

//   // Create the tree
//   const tree = await Tree.create({
//     type: treeType,
//     growthTime: duration,
//     plantedBy: userId,
//   });

//   // Create the session
//   const session = await Session.create({
//     user: userId,
//     duration,
//     success: true,
//     treePlanted: tree._id,
//   });

//   // Update user stats
//   user.totalFocusTime += duration;
//   user.treesPlanted += 1;
//   user.forest.push(tree._id);
//   await user.save();

//   return session;
// }


  
  const Session = mongoose.model('Session', sessionSchema);
  module.exports = Session;