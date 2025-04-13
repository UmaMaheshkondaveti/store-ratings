"use client"

import { useState, useEffect } from "react"
import Layout from "../../components/Layout"
import api from "../../services/api"
import StarRating from "../../components/StarRating"

const UserDashboard = () => {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    name: "",
    address: "",
  })
  const [sort, setSort] = useState({
    field: "name",
    direction: "asc",
  })
  const [ratingStore, setRatingStore] = useState(null)
  const [ratingValue, setRatingValue] = useState(0)

  useEffect(() => {
    fetchStores()
  }, [filters, sort])

  const fetchStores = async () => {
    try {
      setLoading(true)

      // Build query params
      const params = new URLSearchParams()
      if (filters.name) params.append("name", filters.name)
      if (filters.address) params.append("address", filters.address)
      params.append("sortBy", sort.field)
      params.append("sortDir", sort.direction)

      const response = await api.get(`/stores?${params.toString()}`)
      setStores(response.data)
    } catch (error) {
      setError("Failed to load stores")
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

  const handleRatingClick = (store) => {
    setRatingStore(store)
    setRatingValue(store.user_rating || 0)
  }

  const handleRatingChange = (rating) => {
    setRatingValue(rating)
  }

  const submitRating = async () => {
    try {
      await api.post("/ratings", {
        store_id: ratingStore.id,
        rating: ratingValue,
      })

      // Update the store in the list
      setStores(
        stores.map((store) => {
          if (store.id === ratingStore.id) {
            return { ...store, user_rating: ratingValue }
          }
          return store
        }),
      )

      // Close the modal
      setRatingStore(null)
    } catch (error) {
      console.error("Failed to submit rating:", error)
    }
  }

  return (
    <Layout title="Browse Stores">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <input
            type="text"
            name="name"
            placeholder="Search by name"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Search by address"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.address}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Loading stores...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No stores found</p>
          </div>
        ) : (
          stores.map((store) => (
            <div key={store.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{store.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{store.address}</p>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Overall Rating</p>
                    <div className="flex items-center mt-1">
                      <StarRating rating={Math.round(store.average_rating || 0)} readOnly />
                      <span className="ml-2 text-sm text-gray-600">
                        {store.average_rating ? Number.parseFloat(store.average_rating).toFixed(1) : "No ratings"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Your Rating</p>
                    <div className="flex items-center mt-1">
                      {store.user_rating ? (
                        <div className="flex items-center">
                          <StarRating rating={store.user_rating} readOnly />
                          <span className="ml-2 text-sm text-gray-600">{store.user_rating}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not rated</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRatingClick(store)}
                  className="w-full mt-2 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {store.user_rating ? "Update Rating" : "Submit Rating"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rating Modal */}
      {ratingStore && (
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
                      Rate {ratingStore.name}
                    </h3>

                    <div className="mt-4 flex flex-col items-center">
                      <StarRating rating={ratingValue} onRatingChange={handleRatingChange} />
                      <p className="mt-2 text-sm text-gray-500">
                        {ratingValue === 0 ? "Select a rating" : `Your rating: ${ratingValue} out of 5`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={submitRating}
                  disabled={ratingValue === 0}
                >
                  Submit Rating
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setRatingStore(null)}
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

export default UserDashboard
