const express = require('express')

// controller functions
const { signupUser, loginUser, getDayTank, getWeekTank, getMonthTank, getYearTank, getSession, getUserId } = require('../controllers/userController')
//ADD: action controllers --> starting time, logging time, etc.


const router = express.Router()

//get day tank
router.get('/daytank/:dayTankId', getDayTank)

//get week tank
router.get('/weektank/:weekTankId', getWeekTank)

//get month tank
router.get('/monthtank/:monthTankId', getMonthTank)

//get year tank
router.get('/yeartank/:yearTankId', getYearTank)

//get session
router.get('/session/:sessionId', getSession)

//get user ID
router.get('/email/:email', getUserId)

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)


module.exports = router