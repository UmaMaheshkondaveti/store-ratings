const db = require("./db")

const ratingModel = {
  // Create or update a rating
  async upsert(ratingData) {
    const { user_id, store_id, rating } = ratingData

    // Check if rating already exists
    const existingQuery = "SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2"
    const existingResult = await db.query(existingQuery, [user_id, store_id])

    if (existingResult.rows.length > 0) {
      // Update existing rating
      const updateQuery = `
        UPDATE ratings
        SET rating = $1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2 AND store_id = $3
        RETURNING id, user_id, store_id, rating
      `

      const result = await db.query(updateQuery, [rating, user_id, store_id])
      return result.rows[0]
    } else {
      // Create new rating
      const insertQuery = `
        INSERT INTO ratings (user_id, store_id, rating)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, store_id, rating
      `

      const result = await db.query(insertQuery, [user_id, store_id, rating])
      return result.rows[0]
    }
  },

  // Get rating by user and store
  async getByUserAndStore(userId, storeId) {
    const query = "SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2"
    const result = await db.query(query, [userId, storeId])
    return result.rows[0]
  },

  // Get all ratings for a store
  async getByStore(storeId) {
    const query = `
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
    `
    const result = await db.query(query, [storeId])
    return result.rows
  },

  // Get all ratings by a user
  async getByUser(userId) {
    const query = `
      SELECT r.*, s.name as store_name
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = $1
    `
    const result = await db.query(query, [userId])
    return result.rows
  },

  // Get average rating for a store
  async getAverageForStore(storeId) {
    const query = "SELECT AVG(rating) as average FROM ratings WHERE store_id = $1"
    const result = await db.query(query, [storeId])
    return Number.parseFloat(result.rows[0].average) || 0
  },

  // Get rating count
  async getCount() {
    const query = "SELECT COUNT(*) as count FROM ratings"
    const result = await db.query(query)
    return Number.parseInt(result.rows[0].count)
  },
}

module.exports = ratingModel
