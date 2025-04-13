const storeModel = require("../models/storeModel")
const ratingModel = require("../models/ratingModel")
const userModel = require("../models/userModel")
const db = require('../config/db');
// Import the database connection
const message = require("../utils/message") // Import message utility

const storeController = {
  // Get all stores
  async getAll(req, res) {
    try {
      const filters = {
        name: req.query.name,
        email: req.query.email,
        address: req.query.address,
        sortBy: req.query.sortBy,
        sortDir: req.query.sortDir,
      }

      const stores = await storeModel.getAll(filters)

      // If user is logged in, get their ratings for each store
      if (req.user) {
        const userId = req.user.id

        for (const store of stores) {
          const userRating = await ratingModel.getByUserAndStore(userId, store.id)
          store.user_rating = userRating ? userRating.rating : null
        }
      }

      res.json(stores)
    } catch (error) {
      console.error("Get all stores error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },

  // Get store by ID
  async getById(req, res) {
    try {
      const storeId = req.params.id
      const store = await storeModel.findById(storeId)

      if (!store) {
        return res.status(404).json({ message: "Store not found" })
      }

      // If user is logged in, get their rating for this store
      if (req.user) {
        const userId = req.user.id
        const userRating = await ratingModel.getByUserAndStore(userId, storeId)
        store.user_rating = userRating ? userRating.rating : null
      }

      res.json(store)
    } catch (error) {
      console.error("Get store by ID error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },

  // Create a new store (admin only)
  async create(req, res) {
    try {
      const { name, email, address, owner_id } = req.body

      // Validate input
      if (!name || !email || !address) {
        return res.status(400).json({ message: "Name, email, and address are required" })
      }

      // Validate name length
      if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ message: "Name must be between 20 and 60 characters" })
      }

      // Validate address length
      if (address.length > 400) {
        return res.status(400).json({ message: "Address must not exceed 400 characters" })
      }

      // If owner_id is provided, check if user exists and is a store owner
      if (owner_id) {
        const owner = await userModel.findById(owner_id)

        if (!owner) {
          return res.status(404).json({ message: "Owner not found" })
        }

        // If user is not a store owner, update their role
        if (owner.role !== "store_owner") {
          // Update user role to store_owner
          await db.query("UPDATE users SET role = $1 WHERE id = $2", ["store_owner", owner_id])
        }
      }

      // Create store
      const store = await storeModel.create({
        name,
        email,
        address,
        owner_id,
      })

      res.status(201).json({
        message: "Store created successfully",
        store,
      })
    } catch (error) {
      console.error("Create store error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },

  // Get stores owned by the logged-in user
  async getMyStores(req, res) {
    try {
      const userId = req.user.id
      const stores = await storeModel.getByOwnerId(userId)

      res.json(stores)
    } catch (error) {
      console.error("Get my stores error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },

  // Get users who rated a specific store
  async getStoreRaters(req, res) {
    try {
      const storeId = req.params.id

      // Check if store exists
      const store = await storeModel.findById(storeId)
      if (!store) {
        return res.status(404).json({ message: "Store not found" })
      }

      // Check if user is the owner of this store
      if (req.user.role !== "admin" && store.owner_id !== req.user.id) {
        return res.status(403).json({ message: "Access denied" })
      }

      const ratings = await ratingModel.getByStore(storeId)

      res.json(ratings)
    } catch (error) {
      console.error("Get store raters error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
}

module.exports = storeController
