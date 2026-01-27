import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import SingleProductPage from "./pages/SingleProductPage"
import CartPage from "./pages/CartPage"
import LoginPage from "./pages/LoginPage"
import AdminDashboard from "./pages/AdminDashboard"
import "./App.css"
import "./Auth.css"

import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#12121A',
            color: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid rgba(255, 77, 0, 0.2)',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          },
          success: {
            iconTheme: {
              primary: '#FF4D00',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF4D00',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<SingleProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  )
}

export default App