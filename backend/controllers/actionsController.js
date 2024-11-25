const User = require('../models/userModel');
const Session = require('../models/session');
const Tank = require('../models/tank');

userSchema.methods.logFocusTime = async function(durationInMinutes) {
    // const user = await User.findById(userId);
    // if (!user) throw new Error('User not found');
  
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
  
  userSchema.methods.startFocusTime = async function (durationInMinutes) {
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
        this.logFocusTime(durationInMinutes);
        return { success: true, timeLasted: durationInMinutes }; // Timer completed successfully
    } catch (error) {
        const elapsedTime = Date.now() - startTime; // Calculate elapsed time
        console.error("Timer interrupted or failed:", error);
        this.logFocusTime(elapsedTime / 1000 / 60);
        return { success: false, timeLasted: elapsedTime / 1000 / 60 }; // Return elapsed time in minutes
    }
};

async function createSession(userId, duration, marineType) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Create the session
  const session = await Session.create({
    user: userId,
    type: marineType,
    duration: duration,
    success: false,
    treePlanted: tree._id,
  });

  const { success, timeLasted } = user.startFocusTime(duration);
  if (success) {
    session.success = true;
  }

  

  return session;
}