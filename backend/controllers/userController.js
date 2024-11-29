const User = require('../models/userModel');
// const Session = require('../models/session');
const Tank = require('../models/tank');
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

const createSessionUser = async (req, res) => {
  const { userId, duration, marineType } = req.body;

  try {
    const session = Tank.createSession(userID, duration, marineType);
    console.log("session created")
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const timerSuccess = async (req, res) => {
  
}

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

module.exports = { signupUser, loginUser, createSessionUser }