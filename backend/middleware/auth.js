const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret")
    const user = await userModel.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" })
  }
}

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" })
    }

    next()
  }
}

module.exports = { auth, checkRole }
