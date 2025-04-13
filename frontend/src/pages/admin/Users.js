"use client"

import { useState, useEffect } from "react"
import Layout from "../../components/Layout"
import api from "../../services/api"

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  })
  const [sort, setSort] = useState({
    field: "name",
    direction: "asc",
  })

  // Form state for adding new user
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "normal_user",
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchUsers()
  }, [filters, sort])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      // Build query params
      const params = new URLSearchParams()
      if (filters.name) params.append("name", filters.name)
      if (filters.email) params.append("email", filters.email)
      if (filters.address) params.append("address", filters.address)
      if (filters.role) params.append("role", filters.role)
      params.append("sortBy", sort.field)
      params.append("sortDir", sort.direction)

      const response = await api.get(`/users?${params.toString()}`)
      setUsers(response.data)
    } catch (error) {
      setError("Failed to load users")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleNewUserChange = (e) => {
    const { name, value } = e.target
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const errors = {}

    // Validate name (20-60 characters)
    if (newUser.name.length < 20 || newUser.name.length > 60) {
      errors.name = "Name must be between 20 and 60 characters"
    }

    // Validate address (max 400 characters)
    if (newUser.address.length > 400) {
      errors.address = "Address must not exceed 400 characters"
    }

    // Validate password (8-16 characters, uppercase, special char)
    if (newUser.password.length < 8 || newUser.password.length > 16) {
      errors.password = "Password must be between 8 and 16 characters"
    } else if (!/[A-Z]/.test(newUser.password)) {
      errors.password = "Password must contain at least one uppercase letter"
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newUser.password)) {
      errors.password = "Password must contain at least one special character"
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      errors.email = "Please enter a valid email address"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddUser = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await api.post("/users", newUser)
      setShowAddModal(false)
      setNewUser({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "normal_user",
      })
      fetchUsers()
    } catch (error) {
      setFormErrors({
        general: error.response?.data?.message || "Failed to add user",
      })
    }
  }

  return (
    <Layout title="Manage Users">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New User
          </button>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            name="name"
            placeholder="Filter by name"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Filter by email"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.email}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Filter by address"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.address}
            onChange={handleFilterChange}
          />
          <select
            name="role"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.role}
            onChange={handleFilterChange}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
            <option value="normal_user">Normal User</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name
                {sort.field === "name" && <span className="ml-1">{sort.direction === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email
                {sort.field === "email" && <span className="ml-1">{sort.direction === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("address")}
              >
                Address
                {sort.field === "address" && <span className="ml-1">{sort.direction === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("role")}
              >
                Role
                {sort.field === "role" && <span className="ml-1">{sort.direction === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{user.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "store_owner"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : user.role === "store_owner" ? "Store Owner" : "Normal User"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role === "store_owner" && user.rating !== null
                      ? `${Number.parseFloat(user.rating).toFixed(1)} / 5.0`
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Add New User
                    </h3>

                    {formErrors.general && (
                      <div
                        className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                      >
                        <span className="block sm:inline">{formErrors.general}</span>
                      </div>
                    )}

                    <form onSubmit={handleAddUser} className="mt-4">
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={newUser.name}
                          onChange={handleNewUserChange}
                        />
                        {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={newUser.email}
                          onChange={handleNewUserChange}
                        />
                        {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={newUser.password}
                          onChange={handleNewUserChange}
                        />
                        {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea
                          name="address"
                          id="address"
                          rows="3"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={newUser.address}
                          onChange={handleNewUserChange}
                        ></textarea>
                        {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <select
                          name="role"
                          id="role"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={newUser.role}
                          onChange={handleNewUserChange}
                        >
                          <option value="normal_user">Normal User</option>
                          <option value="store_owner">Store Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddUser}
                >
                  Add User
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default AdminUsers
