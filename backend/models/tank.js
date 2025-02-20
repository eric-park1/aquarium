const mongoose = require('mongoose');
//const Session = require('./session');
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

const getStartOfWeek = (date = new Date()) => {
  const day = date.getDay(); 
  const diff = date.getDate() - day 
  const startOfWeek = new Date(date.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

const getStartOfMonth = (date = new Date()) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0); // Normalize to the beginning of the day
  return startOfMonth;
};

const getStartOfYear = (date = new Date()) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0); // Normalize to the beginning of the day
  return startOfYear;
};

tankSchema.statics.createSession =  async function createSession(email, duration, marineType, success) {

  const User = require("./userModel"); // Ensure this points to your User schema
  const Session = require("./session");

  // Validate user existence
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("User not found with the provided email");
  }

  // Determine the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // create dayModel
  const currentDay = await dayModel.findOneAndUpdate(
    { user: user._id, createdAt: currentDate },
    { $setOnInsert: { user: user._id, createdAt: currentDate, organism: [] }}
  )

  // create weekModel
  const currentWeek = await weekModel.findOneAndUpdate(
    { user: user._id, createdAt: getStartOfWeek(currentDate) },
    { $setOnInsert: { user: user._id, createdAt: getStartOfWeek(currentDate), organism: [] }}
  )

  //create monthModel
  const currentMonth = await monthModel.findOneAndUpdate(
    { user: user._id, createdAt: getStartOfMonth(currentDate) },
    { $setOnInsert: { user: user._id, createdAt: getStartOfMonth(currentDate), organism: [] }}
  )

  const currentYear = await yearModel.findOneAndUpdate(
    { user: user._id, createdAt: getStartOfYear(currentDate) },
    { $setOnInsert: { user: user._id, createdAt: getStartOfYear(currentDate), organism: [] }}
  )

  // Find or create the user's tank for the current month and year
  const currentTank = await this.findOneAndUpdate(
    { user: user._id, month: currentMonth, year: currentYear },
    { $setOnInsert: { user: user._id, month: currentMonth, year: currentYear, organism: [] } },
    { new: true, upsert: true }
  );

  if (!user.dayTank.includes(currentDay._id)) {
    user.dayTank.push(currentDay._id);
    user.markModified('aquarium'); // Ensure the aquarium field is marked as modified
    await user.save();
  }

  if (!user.weekTank.includes(currentWeek._id)) {
    user.weekTank.push(currentWeek._id);
    user.markModified('aquarium'); // Ensure the aquarium field is marked as modified
    await user.save();
  }

  if (!user.monthTank.includes(currentMonth._id)) {
    user.monthTank.push(currentMonth._id);
    user.markModified('aquarium'); // Ensure the aquarium field is marked as modified
    await user.save();
  }

  if (!user.yearTank.includes(currentYear._id)) {
    user.yearTank.push(currentYear._id);
    user.markModified('aquarium'); // Ensure the aquarium field is marked as modified
    await user.save();
  }

  // Add the tank ID to the user's aquarium
  if (!user.aquarium.includes(currentTank._id)) {
    user.aquarium.push(currentTank._id);
    user.markModified('aquarium'); // Ensure the aquarium field is marked as modified
    await user.save();
  }

  // Create the session
  const session = await Session.create({
    user: user._id,
    type: success ? marineType : "Plastic", // Default to 'Plastic' if unsuccessful
    duration,
    success,
  });

  // Add the session ID to the tank’s organism array
  currentDay.FocusEvents.push(session._id);
  currentWeek.FocusEvents.push(session._id);
  currentMonth.FocusEvents.push(session._id);
  currentYear.FocusEvents.push(session._id);
  
  currentTank.organism.push(session._id);

  // Increment total catches in the tank if the session is successful
  if (success) {
    currentTank.totalCatches += 1;
  }

  // Save the updated tank
  await currentTank.save();

  // Update the user stats (optional, depends on your application requirements)
  //this needs to be changed
  user.totalFocusTime = (user.totalFocusTime || 0) + duration;
  await user.save();

  return session;
}

tankSchema.statics.getSessions = async function(tankID) {
  try {
    const tank = await this.findById(tankID).populate('organism');

    if (tank) {
      throw new Error('tank not found');
    }

    if (!tank.organism || tank.organism.length === 0) {
      return []; 
    }

  return tank.organism;
  } catch (error) {
    console.error('Error fetching sessions', error.message);
    throw error;
  }
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