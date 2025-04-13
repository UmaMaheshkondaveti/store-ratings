const userModel = require("../models/userModel")
const storeModel = require("../models/storeModel")
const ratingModel = require("../models/ratingModel")

const userController = {
  // Get all users
  async getAll(req, res) {
    try {
      const filters = {
        name: req.query.name,
        email: req.query.email,
        address: req.query.address,
        role: req.query.role,
        sortBy: req.query.sortBy,
        sortDir: req.query.sortDir,
      }

      const users = await userModel.getAll(filters)
      res.json(users)
    } catch (error) {
      console.error("Get all users error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },

  // Get user by ID
  async getById(req, res) {
    try {
      const userId = req.params.id
      const user = await userModel.findById(userId)

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // If user is a store owner, get their rating
      if (user.role === "store_owner") {
        const stores = await storeModel.getByOwnerId(userId)
        if (stores.length > 0) {
          const storeIds = stores.map((store) => store.id)
          const ratings = []

          for (const storeId of storeIds) {
            const avgRating = await ratingModel.getAverageForStore(storeId)
            ratings.push(avgRating)
          }

          // Calculate average rating across all stores
          const avgRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

          user.rating = avgRating
        }
      }

      res.json(user)
    } catch (error) {
      console.error("Get user by ID error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },

  // Create a new user (admin only)
  async create(req, res) {
    try {
      const { name, email, password, address, role } = req.body

      // Validate input
      if (!name || !email || !password || !address || !role) {
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
        role,
      })

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      console.error("Create user error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },

  // Get dashboard stats
  async getDashboardStats(req, res) {
    try {
      const userCount = await userModel.getCount()
      const storeCount = await storeModel.getCount()
      const ratingCount = await ratingModel.getCount()

      res.json({
        userCount,
        storeCount,
        ratingCount,
      })
    } catch (error) {
      console.error("Get dashboard stats error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
}

module.exports = userController
