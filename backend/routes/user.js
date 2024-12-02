const express = require('express')

// controller functions
const { signupUser, loginUser, getUser, getTank, getSession } = require('../controllers/userController')
//ADD: action controllers --> starting time, logging time, etc.

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// get user
router.get('/getUser', getUser)

router.get('/getTank', getTank)

router.get('/getSession', getSession)

module.exports = router