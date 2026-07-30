import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import { ProtectedRoute, AdminRoute } from './components/RouteGuards'

// Public pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import InvestmentPlans from './pages/public/InvestmentPlans'
import InsuranceHub from './pages/public/InsuranceHub'
import InsuranceCategory from './pages/public/InsuranceCategory'
import Contact from './pages/public/Contact'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Customer
import CustomerDashboard from './pages/customer/Dashboard'
import CustomerPortfolio from './pages/customer/Portfolio'
import CustomerProfile from './pages/customer/Profile'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminPortfolios from './pages/admin/AdminPortfolios'
import AdminLeads from './pages/admin/AdminLeads'

import NotFound from './pages/NotFound'

export default function App() {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <Routes>
      {/* Public pages with full layout (navbar + footer) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/plans" element={<InvestmentPlans />} />
        <Route path="/insurance" element={<InsuranceHub />} />
        <Route path="/insurance/:category" element={<InsuranceCategory />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <NavigateToDashboard isAdmin={isAdmin} />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <NavigateToDashboard isAdmin={isAdmin} />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Customer dashboard — no public navbar/footer, uses own sidebar */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/dashboard/portfolio" element={<CustomerPortfolio />} />
        <Route path="/dashboard/profile" element={<CustomerProfile />} />
      </Route>

      {/* Admin panel */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/portfolios" element={<AdminPortfolios />} />
        <Route path="/admin/insurance-leads" element={<AdminLeads type="Insurance" />} />
        <Route path="/admin/investment-leads" element={<AdminLeads type="Investment" />} />
        <Route path="/admin/contact-leads" element={<AdminLeads type="Contact" />} />
      </Route>
    </Routes>
  )
}

// Small redirect helper
function NavigateToDashboard({ isAdmin }: { isAdmin: boolean }) {
  return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
}