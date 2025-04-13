const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const authController = {
  // Register a new user
  async register(req, res) {
    try {
      const { name, email, password, address } = req.body

      // Validate input
      if (!name || !email || !password || !address) {
        return res.status(400).json({ message: "All fields are required" })
      }

      // Validate name length
      if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ message: "Name must be between 20 and 60 characters" })
      }

      // Validate address length
      if (address.length > 400) {
        return res.status(400).json({ message: "Address must not exceed 400 characters" })
      }

      // Validate password
      if (password.length < 8 || password.length > 16) {
        return res.status(400).json({ message: "Password must be between 8 and 16 characters" })
      }

      const hasUpperCase = /[A-Z]/.test(password)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

      if (!hasUpperCase || !hasSpecialChar) {
        return res.status(400).json({
          message: "Password must contain at least one uppercase letter and one special character",
        })
      }

      // Check if user already exists
      const existingUser = await userModel.findByEmail(email)
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" })
      }

      // Create user
      const user = await userModel.create({
        name,
        email,
        password,
        address,
        role: "normal_user",
      })

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "24h" })

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
      }

      // Find user
      const user = await userModel.findByEmail(email)
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" })
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" })
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "24h" })

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body
      const userId = req.user.id

      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" })
      }

      // Validate new password
      if (newPassword.length < 8 || newPassword.length > 16) {
        return res.status(400).json({ message: "Password must be between 8 and 16 characters" })
      }

      const hasUpperCase = /[A-Z]/.test(newPassword)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

      if (!hasUpperCase || !hasSpecialChar) {
        return res.status(400).json({
          message: "Password must contain at least one uppercase letter and one special character",
        })
      }

      // Get user with password
      const user = await userModel.findByEmail(req.user.email)

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" })
      }

      // Update password
      await userModel.updatePassword(userId, newPassword)

      res.json({ message: "Password updated successfully" })
    } catch (error) {
      console.error("Change password error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
}

module.exports = authController
