const express = require("express")
const router = express.Router()

// Placeholder route
router.get("/", (req, res) => {
  res.json({ message: "Ratings route works!" })
})

module.exports = router
