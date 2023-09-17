const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyToken = require('../middleware/auth')
const checkAdmin = require('../middleware/checkAdmin')

router.post("/register", userController.registerAccount)
router.post("/register-information", userController.registerInformation)
router.post("/login", userController.loginAccount)

module.exports = router