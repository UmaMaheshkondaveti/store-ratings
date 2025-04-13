const express = require("express")
const router = express.Router()
const storeController = require("../controllers/storeController")
const { auth, checkRole } = require("../middleware/auth")

// Get all stores (public, but enhanced with user ratings if authenticated)
router.get("/", auth, storeController.getAll)

// Get stores owned by the logged-in user (store owner only)
router.get("/my/stores", auth, checkRole(["store_owner"]), storeController.getMyStores)

// Get store by ID (public, but enhanced with user rating if authenticated)
router.get("/:id", auth, storeController.getById)

// Create a new store (admin only)
router.post("/", auth, checkRole(["admin"]), storeController.create)

// Get users who rated a specific store (store owner or admin only)
router.get("/:id/raters", auth, storeController.getStoreRaters)

module.exports = router
