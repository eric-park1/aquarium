const User = require('../models/userModel');
// const Session = require('../models/session');
const Tank = require('../models/tank');
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

const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ error: 'couldnt get user id' });
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send back the user data (excluding sensitive info like password)
    res.status(200).json({
      email: user.email,
      focusTime: user.focusTime,
      fishCaught: user.fishCaught,
      aquarium: user.aquarium,
      achievements: user.achievements,
    });
  } catch (error) {
    console.error('Error retrieving user:', error.message);
    res.status(500).json({ error: 'An error occurred while retrieving the user' });
  }
};

const getTank = async (req, res) => {
  const { tankId } = req.params; // Assuming the userId is sent as a route parameter

  try {
    // Find tanks where the `user` field matches the provided userId
    const tank = await Tank.findById(tankId);

    res.status(200).json(tank); // Send the tank documents as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSession = async (req, res) => {
  const { sessionId } = req.params; // Assuming the userId is sent as a route parameter

  try {
    // Find tanks where the `user` field matches the provided userId
    const session = await Session.findbyId(sessionId);

    res.status(200).json(session); // Send the tank documents as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createSessionUser = async (req, res) => {
  const { email, duration, marineType, success } = req.body; // Destructure from req.body

  try {
    // Call the Tank's static method to create the session
    const session = await Tank.createSession(email, duration, marineType, success);

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

module.exports = { signupUser, loginUser, createSessionUser, getUser, getTank, getSession }