const express = require('express')

// controller functions
const { logFocusTime, createSessionUser } = require('../controllers/userController')
//ADD: action controllers --> starting time, logging time, etc.

const router = express.Router()

// log focus route
//router.post('/logFocus', logFocusTime)

// start focus route
router.post('/createSession', createSessionUser)

module.exports = router