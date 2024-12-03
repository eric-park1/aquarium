const express = require('express')

// controller functions
const { timerSuccess, createSessionUser } = require('../controllers/userController')
//ADD: action controllers

const router = express.Router()

// start focus route
router.post('/createSession', createSessionUser)

module.exports = router