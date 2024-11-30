const express = require('express')

// controller functions
const { signupUser, loginUser, getUser } = require('../controllers/userController')
//ADD: action controllers --> starting time, logging time, etc.

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// get user
router.get('/get', getUser)

module.exports = router