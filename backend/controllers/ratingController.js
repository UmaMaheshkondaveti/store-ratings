const ratingModel = require("../models/ratingModel")
const storeModel = require("../models/storeModel")

const ratingController = {
  // Submit or update a rating
  async submitRating(req, res) {
    try {
      const { store_id, rating } = req.body
      const user_id = req.user.id

      // Validate input
      if (!store_id || !rating) {
        return res.status(400).json({ message: "Store ID and rating are required" })
      }

      // Validate rating value
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" })
      }

      // Check if store exists
      const store = await storeModel.findById(store_id)
      if (!store) {
        return res.status(404).json({ message: "Store not found" })
      }

      // Submit or update rating
      const ratingResult = await ratingModel.upsert({
        user_id,
        store_id,
        rating,
      })

      res.json({
        message: "Rating submitted successfully",
        rating: ratingResult,
      })
    } catch (error) {
      console.error("Submit rating error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },

  // Get user's rating for a specific store
  async getUserRating(req, res) {
    try {
      const storeId = req.params.storeId
      const userId = req.user.id

      const rating = await ratingModel.getByUserAndStore(userId, storeId)

      if (!rating) {
        return res.status(404).json({ message: "Rating not found" })
      }

      res.json(rating)
    } catch (error) {
      console.error("Get user rating error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },

  // Get all ratings by the logged-in user
  async getUserRatings(req, res) {
    try {
      const userId = req.user.id
      const ratings = await ratingModel.getByUser(userId)

      res.json(ratings)
    } catch (error) {
      console.error("Get user ratings error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
}

module.exports = ratingController
