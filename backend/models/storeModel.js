const db = require("./db")

const storeModel = {
  // Create a new store
  async create(storeData) {
    const { name, email, address, owner_id } = storeData

    const query = `
      INSERT INTO stores (name, email, address, owner_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, address, owner_id
    `

    const result = await db.query(query, [name, email, address, owner_id])
    return result.rows[0]
  },

  // Find store by ID
  async findById(id) {
    const query = `
      SELECT s.*, 
      (SELECT AVG(rating) FROM ratings WHERE store_id = s.id) as average_rating
      FROM stores s
      WHERE s.id = $1
    `
    const result = await db.query(query, [id])
    return result.rows[0]
  },

  // Get all stores
  async getAll(filters = {}) {
    let query = `
      SELECT s.id, s.name, s.email, s.address, 
      (SELECT AVG(rating) FROM ratings WHERE store_id = s.id) as average_rating
      FROM stores s
      WHERE 1=1
    `

    const params = []
    let paramIndex = 1

    if (filters.name) {
      query += ` AND s.name ILIKE $${paramIndex}`
      params.push(`%${filters.name}%`)
      paramIndex++
    }

    if (filters.email) {
      query += ` AND s.email ILIKE $${paramIndex}`
      params.push(`%${filters.email}%`)
      paramIndex++
    }

    if (filters.address) {
      query += ` AND s.address ILIKE $${paramIndex}`
      params.push(`%${filters.address}%`)
      paramIndex++
    }

    if (filters.sortBy) {
      const sortDirection = filters.sortDir === "desc" ? "DESC" : "ASC"
      query += ` ORDER BY s.${filters.sortBy} ${sortDirection}`
    } else {
      query += " ORDER BY s.id ASC"
    }

    const result = await db.query(query, params)
    return result.rows
  },

  // Get stores by owner ID
  async getByOwnerId(ownerId) {
    const query = `
      SELECT s.*, 
      (SELECT AVG(rating) FROM ratings WHERE store_id = s.id) as average_rating
      FROM stores s
      WHERE s.owner_id = $1
    `
    const result = await db.query(query, [ownerId])
    return result.rows
  },

  // Get store count
  async getCount() {
    const query = "SELECT COUNT(*) as count FROM stores"
    const result = await db.query(query)
    return Number.parseInt(result.rows[0].count)
  },
}

module.exports = storeModel
