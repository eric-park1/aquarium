const User = require('../models/userModel');
const dayTank = require('../models/dayModel');
const weekTank = require('../models/weekModel');
const monthTank = require('../models/monthModel');
const yearTank = require('../models/yearModel');
const Session = require('../models/session');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.JWT_SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.signup(email, password)
    console.log("user made")
    // create a token
    const token = createToken(user._id)
    console.log("token made")

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const getSession = async (req, res) => {
  const { sessionId } = req.params;
  try {
    // Find tanks where the `user` field matches the provided userId
    const session = await Session.findById(sessionId);

    res.status(200).json(session); // Send the session documents as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDayTank = async (req, res) => {
  const { dayTankId } = req.params; 

  try {
    // Find tanks where the `user` field matches the provided userId
    const tank = await dayTank.findById(dayTankId);

    res.status(200).json(tank); // Send the tank documents as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("couldnt get day tank")
  }
};

const getWeekTank = async (req, res) => {
  const { weekTankId } = req.params; 

  try {
    // Find tanks where the `user` field matches the provided userId
    const tank = await weekTank.findById(weekTankId);

    res.status(200).json(tank); // Send the tank documents as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("couldnt get week tank")
  }
};

const getMonthTank = async (req, res) => {
  const { monthTankId } = req.params; 

  try {
    // Find tanks where the `user` field matches the provided userId
    const tank = await monthTank.findById(monthTankId);

    res.status(200).json(tank); // Send the tank documents as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("couldnt get month tank")
  }
};

const getYearTank = async (req, res) => {
  const { yearTankId } = req.params; 

  try {
    // Find tanks where the `user` field matches the provided userId
    const tank = await yearTank.findById(yearTankId);

    res.status(200).json(tank); // Send the tank documents as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("couldnt get year tank")
  }
};

const getUserId = async (req, res) => {
  const { email } = req.params;
  try {
    // Find user where the `email` field matches the provided userId
    const user = await User.findOne({ email });
    console.log(user);

    res.status(200).json(user); // Send the user documents as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("couldnt get user")
  }
}

const getStartOfDay = (date = new Date()) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

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

async function createSession(email, duration, marineType, success) {

  // Validate user existence
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("User not found with the provided email");
  }

  // Determine the current month and year
  const currentDate = new Date();

  if (!user.focusTime) {
    user.focusTime = { pastDay: 0, pastWeek: 0, pastMonth: 0, pastYear: 0, total: 0 };
  }

  // create dayModel
  const currentDay = await dayTank.findOneAndUpdate(
    { user: user._id, createdAt: getStartOfDay(currentDate) },
    { $setOnInsert: { user: user._id, createdAt: getStartOfDay(currentDate), focusEvents: [] }},
    { upsert: true, new: true } 
  )

  // create weekModel
  const currentWeek = await weekTank.findOneAndUpdate(
    { user: user._id, createdAt: getStartOfWeek(currentDate) },
    { $setOnInsert: { user: user._id, createdAt: getStartOfWeek(currentDate), focusEvents: [] }},
    { upsert: true, new: true } 
  )

  //create monthModel
  const currentMonth = await monthTank.findOneAndUpdate(
    { user: user._id, createdAt: getStartOfMonth(currentDate) },
    { $setOnInsert: { user: user._id, createdAt: getStartOfMonth(currentDate), focusEvents: [] }},
    { upsert: true, new: true } 
  )
  
  //create yearModel
  const currentYear = await yearTank.findOneAndUpdate(
    { user: user._id, createdAt: getStartOfYear(currentDate) },
    { $setOnInsert: { user: user._id, createdAt: getStartOfYear(currentDate), focusEvents: [] }},
    { upsert: true, new: true } 
  )

  //check whether each tank already exists, or whether we have a new id to replace the old one
  //if this is a new tank, set duration to the amount of time, else add to existing
  if (!user.dayTank || user.dayTank.toString() !== currentDay._id.toString()) {
    user.dayTank = currentDay._id;
    user.focusTime.pastDay = duration;
  } else {
    user.focusTime.pastDay += duration;
  }

  if (!user.weekTank || user.weekTank.toString() !== currentWeek._id.toString()) {
    user.weekTank = currentWeek._id;
    user.focusTime.pastWeek = duration;
  } else {
    user.focusTime.pastWeek += duration;
  }

  if (!user.monthTank || user.monthTank.toString() !== currentMonth._id.toString()) {
    user.monthTank = currentMonth._id;
    user.focusTime.pastMonth = duration;
  } else {
    user.focusTime.pastMonth += duration;
  }

  if (!user.yearTank || user.yearTank.toString() !== currentYear._id.toString()) {
    user.yearTank = currentYear._id;
    user.focusTime.pastYear = duration;
  } else {
    user.focusTime.pastYear += duration;
  }

  user.focusTime.total += duration;
  
  // Save the updated user
  await user.save();

  // Create the session
  const session = await Session.create({
    user: user._id,
    type: success ? marineType : "Plastic", // Default to 'Plastic' if unsuccessful
    duration,
    success,
  });

  // Add the session ID to the tank’s FocusEvents array
  currentDay.focusEvents.push(session._id);
  await currentDay.save();
  currentWeek.focusEvents.push(session._id);
  await currentWeek.save();
  currentMonth.focusEvents.push(session._id);
  await currentMonth.save();
  currentYear.focusEvents.push(session._id);
  await currentYear.save();

  return session;
}

const updateCurrency = async (req, res) => {
  const { email, currency } = req.body;

  try {
      const user = await User.updateOne({ email }, { $set: { currency } });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Currency updated successfully' });
  } catch (error) {
      console.error('Error updating currency:', error);
      res.status(500).json({ message: 'Failed to update currency' });
  }
}

const addSpecies = async (req, res) => {
  const { email, species } = req.body;

  try {
    // Ensure species doesn't already exist in speciesOwned array
    const user = await User.findOneAndUpdate(
      { email, speciesOwned: { $ne: species } }, // $ne ensures the species isn't already in the array
      { 
        $push: { speciesOwned: species }
      },
      { new: true }  // Return the updated user object
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found or species already owned' });
    }

    res.status(200).json({ message: 'Species purchased and currency updated successfully', user });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Failed to update user data' });
  }
}

const createSessionUser = async (req, res) => {
  const { email, duration, marineType, success } = req.body; // Destructure from req.body

  try {
    // Call the Tank's static method to create the session
    const session = await createSession(email, duration, marineType, success);

    console.log("Session created successfully:", session);
    
    // Respond with the created session data
    res.status(201).json({
      message: "Session created successfully",
      session,
    });
  } catch (error) {
    console.error("Error creating session:", error.message);

    // Respond with error details
    res.status(400).json({
      error: error.message,
    });
  }
};

async function resetFocusTimePeriods() {
  const now = new Date();

  // Get the current start of day, week, month, year
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Reset or roll over time for all users
  const users = await User.find();
  for (const user of users) {
    const { focusTime } = user;

    // Reset `pastDay` at the start of each day
    focusTime.pastDay = 0;

    // Reset `pastWeek` if we're at the start of a new week
    if (now.getTime() === startOfWeek.getTime()) {
      focusTime.pastWeek = 0;
    }

    // Reset `pastMonth` if it's a new month
    if (now.getTime() === startOfMonth.getTime()) {
      focusTime.pastMonth = 0;
    }

    // Reset `pastYear` if it's a new year
    if (now.getTime() === startOfYear.getTime()) {
      focusTime.pastYear = 0;
    }

    await user.save();
  }
}

module.exports = { 
  signupUser, 
  loginUser, 
  createSessionUser,  
  getSession, 
  getUserId,
  getDayTank, 
  getWeekTank,
  getMonthTank,
  getYearTank,
  updateCurrency,
  addSpecies
}