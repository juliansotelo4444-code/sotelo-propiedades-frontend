import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import MyPropertiesPage from './pages/MyPropertiesPage'
import NewPropertyPage from './pages/NewPropertyPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'


function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen"><span className="spinner" /></div>
  return user ? children : <Navigate to="/login" replace />
}


function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen"><span className="spinner" /></div>
  return !user ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/registro" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Layout con Navbar + Footer */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/propiedades" element={<PropertiesPage />} />
            <Route path="/propiedades/:id" element={<PropertyDetailPage />} />
            <Route path="/mis-propiedades" element={<PrivateRoute><MyPropertiesPage /></PrivateRoute>} />
            <Route path="/nueva-propiedad" element={<PrivateRoute><NewPropertyPage /></PrivateRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
