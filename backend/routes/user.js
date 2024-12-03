const express = require('express')

// controller functions
const { signupUser, loginUser, getUser, getTank, getSession, getUserId } = require('../controllers/userController')
//ADD: action controllers --> starting time, logging time, etc.

const router = express.Router()

// get user
router.get('/user/:userId', getUser)

//get tank
router.get('/tank/:tankId', getTank)

//get session
router.get('/session/:sessionId', getSession)

//get user ID
router.get('/email/:email', getUserId)

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)


module.exports = router