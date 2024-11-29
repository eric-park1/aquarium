const express = require('express')

// controller functions
const { timerSuccess, createSessionUser } = require('../controllers/userController')
//ADD: action controllers --> starting time, logging time, etc.

const router = express.Router()

// log focus route
//router.post('/logFocus', logFocusTime)

// start focus route
router.post('/createSession', createSessionUser)

//router.post('/timerSuccess', timerSuccess)

module.exports = router