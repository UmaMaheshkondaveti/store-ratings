"use client"

import { useState, useEffect } from "react"
import Layout from "../../components/Layout"
import api from "../../services/api"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    storeCount: 0,
    ratingCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/users/stats/dashboard")
        setStats(response.data)
      } catch (error) {
        setError("Failed to load dashboard statistics")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Admin Dashboard">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.userCount}</dd>
            </dl>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Stores</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.storeCount}</dd>
            </dl>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Ratings</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.ratingCount}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-md font-medium text-gray-900">Add New Store</h3>
            <p className="mt-1 text-sm text-gray-500">Create a new store and assign it to a store owner.</p>
            <div className="mt-4">
              <a
                href="/admin/stores"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Store
              </a>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-md font-medium text-gray-900">Add New User</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create a new user with admin, store owner, or normal user role.
            </p>
            <div className="mt-4">
              <a
                href="/admin/users"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add User
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
