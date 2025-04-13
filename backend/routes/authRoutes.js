const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { auth } = require("../middleware/auth")

// Register a new user
router.post("/register", authController.register)

// Login user
router.post("/login", authController.login)

// Change password (requires authentication)
router.post("/change-password", auth, authController.changePassword)

module.exports = router
