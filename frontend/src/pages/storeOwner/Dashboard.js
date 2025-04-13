"use client"

import { useState, useEffect } from "react"
import Layout from "../../components/Layout"
import api from "../../services/api"
import StarRating from "../../components/StarRating"

const StoreOwnerDashboard = () => {
  const [stores, setStores] = useState([])
  const [selectedStore, setSelectedStore] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStores()
  }, [])

  useEffect(() => {
    if (selectedStore) {
      fetchRatings(selectedStore.id)
    }
  }, [selectedStore])

  const fetchStores = async () => {
    try {
      setLoading(true)
      const response = await api.get("/stores/my/stores")
      setStores(response.data)

      // Select the first store by default
      if (response.data.length > 0) {
        setSelectedStore(response.data[0])
      }
    } catch (error) {
      setError("Failed to load your stores")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRatings = async (storeId) => {
    try {
      setLoading(true)
      const response = await api.get(`/stores/${storeId}/raters`)
      setRatings(response.data)
    } catch (error) {
      setError("Failed to load ratings")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !selectedStore) {
    return (
      <Layout title="Store Owner Dashboard">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading your stores...</p>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Store Owner Dashboard">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </Layout>
    )
  }

  if (stores.length === 0) {
    return (
      <Layout title="Store Owner Dashboard">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-700">
            You don't have any stores assigned to you yet. Please contact an administrator.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Store Owner Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Stores</h3>
            <ul className="space-y-2">
              {stores.map((store) => (
                <li key={store.id}>
                  <button
                    onClick={() => setSelectedStore(store)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      selectedStore && selectedStore.id === store.id
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {store.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-3">
          {selectedStore && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">{selectedStore.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedStore.address}</p>
              </div>

              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Average Rating</h3>
                    <div className="flex items-center mt-1">
                      <StarRating rating={Math.round(selectedStore.average_rating || 0)} readOnly />
                      <span className="ml-2 text-lg font-semibold">
                        {selectedStore.average_rating
                          ? `${Number.parseFloat(selectedStore.average_rating).toFixed(1)} / 5.0`
                          : "No ratings yet"}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Total Ratings</h3>
                    <p className="text-lg font-semibold mt-1">{ratings.length}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Ratings</h3>

                {loading ? (
                  <p className="text-gray-500 text-center py-4">Loading ratings...</p>
                ) : ratings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No ratings yet</p>
                ) : (
                  <div className="space-y-4">
                    {ratings.map((rating) => (
                      <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{rating.user_name}</p>
                            <p className="text-sm text-gray-500">{rating.user_email}</p>
                          </div>
                          <div className="flex items-center">
                            <StarRating rating={rating.rating} readOnly />
                            <span className="ml-2 font-semibold">{rating.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default StoreOwnerDashboard
