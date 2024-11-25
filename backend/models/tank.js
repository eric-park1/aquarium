const mongoose = require('mongoose');
const Session = require('./session');
const User = require('./userModel');

const tankSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  month: {
    type: Number, // Month (1-12)
    required: true,
  },
  year: {
    type: Number, // Year (e.g., 2024)
    required: true,
  },
  totalCatches: {
    type: Number,
    default: 0,
  },
  organism: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session', // Reference to the session schema
    },
  ],
});

async function logFocusTime(durationInMinutes, userID) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const now = new Date();

  // Add time to the total
  user.focusTime.total += durationInMinutes;

  // Update time for the relevant periods
  user.focusTime.pastDay += durationInMinutes;
  user.focusTime.pastWeek += durationInMinutes;
  user.focusTime.pastMonth += durationInMinutes;
  user.focusTime.pastYear += durationInMinutes;

  await user.save();
  return user;
}

async function startFocusTime(durationInMinutes, userID) {
  const startTime = Date.now(); // Record the start time
  const durationInMilliseconds = durationInMinutes * 60 * 1000;

  try {
      console.log(`Timer started for ${durationInMinutes} minutes...`);

      // Simulate the timer with a Promise
      await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
              clearTimeout(timer);
              resolve(); // Timer completed successfully
          }, durationInMilliseconds);
      });

      console.log("Timer completed!");
      logFocusTime(durationInMinutes, userID);
      return { success: true, timeLasted: durationInMinutes }; // Timer completed successfully
  } catch (error) {
      const elapsedTime = Date.now() - startTime; // Calculate elapsed time
      console.error("Timer interrupted or failed:", error);
      logFocusTime(elapsedTime / 1000 / 60, userID);
      return { success: false, timeLasted: elapsedTime / 1000 / 60 }; // Return elapsed time in minutes
  }
};

tankSchema.statics.createSession =  async function createSession(email, duration, marineType) {

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Incorrect email');
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; 
  const currentYear = currentDate.getFullYear();

  try {
    // Query to find the user's tank for the current month and year
    const currentTank = await Tank.findOne({
      user: user._id, // The logged-in user's ID
      month: currentMonth, // Current month
      year: currentYear,  // Current year
    })

    if (!currentTank) {
      throw new Error('No tank found for this user in the current month');
    }
  } catch (error) {
    console.error(error);
    throw error; // Handle or re-throw error based on your app's error handling logic
  }

  // Create the session
  const session = await session.create({
    user: user._id,
    type: marineType,
    duration: duration,
    success: false,
    treePlanted: tree._id,
  });

  const { success, timeLasted } = startFocusTime(duration, user._id);
  if (success) {
    session.success = true;
  } else {
    session.duration = timeLasted;
    session.type = 'Plastic';
  }

  currentTank.push(session);

  return session;
}

//reset tank function: upon the end of the month, will start a new tank
tankSchema.statics.resetTank = async function (userID) {
  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();

  // Find or create the user's tank for the current month
  let tank = await Tank.findOne({ user: userId, month: currentMonth, year: currentYear });

  if (!tank) {
    tank = await Tank.create({
      month: currentMonth,
      year: currentYear,
      user: userId,
    });
  }
};


module.exports = mongoose.model('Tank', tankSchema);