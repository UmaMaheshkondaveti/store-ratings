const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { auth, checkRole } = require("../middleware/auth")

// Get all users (admin only)
router.get("/", auth, checkRole(["admin"]), userController.getAll)

// Get user by ID (admin only)
router.get("/:id", auth, checkRole(["admin"]), userController.getById)

// Create a new user (admin only)
router.post("/", auth, checkRole(["admin"]), userController.create)

// Get dashboard stats (admin only)
router.get("/stats/dashboard", auth, checkRole(["admin"]), userController.getDashboardStats)

module.exports = router
