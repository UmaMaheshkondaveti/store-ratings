"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminUsers from "./pages/admin/Users"
import AdminStores from "./pages/admin/Stores"
import UserDashboard from "./pages/user/Dashboard"
import StoreOwnerDashboard from "./pages/storeOwner/Dashboard"
import ChangePassword from "./pages/ChangePassword"
import NotFound from "./pages/NotFound"

// Protected route component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" />
    } else if (user.role === "store_owner") {
      return <Navigate to="/store-owner/dashboard" />
    } else {
      return <Navigate to="/user/dashboard" />
    }
  }

  return element
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />}
          />
          <Route path="/admin/users" element={<ProtectedRoute element={<AdminUsers />} allowedRoles={["admin"]} />} />
          <Route path="/admin/stores" element={<ProtectedRoute element={<AdminStores />} allowedRoles={["admin"]} />} />

          {/* Normal user routes */}
          <Route
            path="/user/dashboard"
            element={<ProtectedRoute element={<UserDashboard />} allowedRoles={["normal_user"]} />}
          />

          {/* Store owner routes */}
          <Route
            path="/store-owner/dashboard"
            element={<ProtectedRoute element={<StoreOwnerDashboard />} allowedRoles={["store_owner"]} />}
          />

          {/* Common routes */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute element={<ChangePassword />} allowedRoles={["admin", "normal_user", "store_owner"]} />
            }
          />

          {/* Redirect based on role */}
          <Route
            path="/"
            element={
              <ProtectedRoute element={<RoleBasedRedirect />} allowedRoles={["admin", "normal_user", "store_owner"]} />
            }
          />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

// Component to redirect based on user role
const RoleBasedRedirect = () => {
  const { user } = useAuth()

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" />
  } else if (user.role === "store_owner") {
    return <Navigate to="/store-owner/dashboard" />
  } else {
    return <Navigate to="/user/dashboard" />
  }
}

export default App
