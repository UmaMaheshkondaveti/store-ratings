// src/contexts/AuthContext.js

"use client"

import { createContext, useState, useContext, useEffect } from "react"
import api from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      const { user, token } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)

      return user
    } catch (error) {
      throw error.response?.data?.message || "Login failed"
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData)
      const { user, token } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)

      return user
    } catch (error) {
      throw error.response?.data?.message || "Registration failed"
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword })
    } catch (error) {
      throw error.response?.data?.message || "Password change failed"
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
