const express = require('express')

// controller functions
const { createSessionUser, updateCurrency, addSpecies } = require('../controllers/userController')

//ADD: action controllers

const router = express.Router()

// start focus route
router.post('/createSession', createSessionUser)

router.post('/updateCurrency', updateCurrency)

router.post('/addSpecies', addSpecies)

module.exports = router