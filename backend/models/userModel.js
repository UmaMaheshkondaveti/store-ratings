const db = require("./db")
const bcrypt = require("bcrypt")

const userModel = {
  // Create a new user
  async create(userData) {
    const { name, email, password, address, role = "normal_user" } = userData

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const query = `
      INSERT INTO users (name, email, password, address, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, address, role
    `

    const result = await db.query(query, [name, email, hashedPassword, address, role])
    return result.rows[0]
  },

  // Find user by email
  async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1"
    const result = await db.query(query, [email])
    return result.rows[0]
  },

  // Find user by ID
  async findById(id) {
    const query = "SELECT id, name, email, address, role FROM users WHERE id = $1"
    const result = await db.query(query, [id])
    return result.rows[0]
  },

  // Get all users
  async getAll(filters = {}) {
    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, 
      CASE WHEN u.role = 'store_owner' THEN 
        (SELECT AVG(r.rating) FROM ratings r 
         JOIN stores s ON r.store_id = s.id 
         WHERE s.owner_id = u.id)
      ELSE NULL END as rating
      FROM users u
      WHERE 1=1
    `

    const params = []
    let paramIndex = 1

    if (filters.name) {
      query += ` AND u.name ILIKE $${paramIndex}`
      params.push(`%${filters.name}%`)
      paramIndex++
    }

    if (filters.email) {
      query += ` AND u.email ILIKE $${paramIndex}`
      params.push(`%${filters.email}%`)
      paramIndex++
    }

    if (filters.address) {
      query += ` AND u.address ILIKE $${paramIndex}`
      params.push(`%${filters.address}%`)
      paramIndex++
    }

    if (filters.role) {
      query += ` AND u.role = $${paramIndex}`
      params.push(filters.role)
      paramIndex++
    }

    if (filters.sortBy) {
      const sortDirection = filters.sortDir === "desc" ? "DESC" : "ASC"
      query += ` ORDER BY u.${filters.sortBy} ${sortDirection}`
    } else {
      query += " ORDER BY u.id ASC"
    }

    const result = await db.query(query, params)
    return result.rows
  },

  // Update user password
  async updatePassword(userId, newPassword) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    const query = `
      UPDATE users
      SET password = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id
    `

    const result = await db.query(query, [hashedPassword, userId])
    return result.rows[0]
  },

  // Get user count
  async getCount() {
    const query = "SELECT COUNT(*) as count FROM users"
    const result = await db.query(query)
    return Number.parseInt(result.rows[0].count)
  },
}

module.exports = userModel
