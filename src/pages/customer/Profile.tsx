import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { motion } from 'framer-motion'
import { LayoutDashboard, User, Mail, Phone, Calendar, CreditCard, MapPin, Shield, TrendingUp, Wallet, BarChart3, Check, ArrowUpRight } from 'lucide-react'
import { inr, formatDate } from '../../lib/utils'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

export default function CustomerProfile() {
  const { user } = useAuth()
  const { getCustomer } = useData()
  const customer = user?.customerId ? getCustomer(user.customerId) : undefined

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400">Account setup in progress.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Profile</h1>
                <p className="text-xs text-gray-400">Your personal and investment details</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                <LayoutDashboard className="w-5 h-5" />
              </a>
              <a href="/dashboard/portfolio" className="text-gray-400 hover:text-white transition-colors">
                <BarChart3 className="w-5 h-5" />
              </a>
              <a href="/dashboard/insurance" className="text-gray-400 hover:text-white transition-colors">
                <Shield className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 text-center"
          >
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/25 mb-4">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">{customer.name}</h2>
            <p className="text-sm text-gray-400 mb-4">{customer.email}</p>
            
            <div className="flex flex-col items-center gap-2 mb-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                customer.kycVerified 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {customer.kycVerified ? <Check className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                {customer.kycVerified ? 'KYC Verified' : 'KYC Pending'}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                customer.status === 'Active' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                <span className={`w-2 h-2 rounded-full ${customer.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {customer.status}
              </span>
            </div>
            
            <div className="p-4 bg-gray-800/30 rounded-xl">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-1">
                <Calendar className="w-4 h-4" />
                Member since
              </div>
              <div className="font-medium text-white">{formatDate(customer.joinDate)}</div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <User className="w-4 h-4" />
                    Full Name
                  </div>
                  <div className="font-medium text-white">{customer.name || '—'}</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                  <div className="font-medium text-white">{customer.email || '—'}</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <Phone className="w-4 h-4" />
                    Phone
                  </div>
                  <div className="font-medium text-white">{customer.phone || '—'}</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    Date of Birth
                  </div>
                  <div className="font-medium text-white">{customer.dateOfBirth || '—'}</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <CreditCard className="w-4 h-4" />
                    Aadhaar
                  </div>
                  <div className="font-medium text-white">{customer.aadhaar || '—'}</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <CreditCard className="w-4 h-4" />
                    PAN
                  </div>
                  <div className="font-medium text-white">{customer.pan || '—'}</div>
                </div>
                <div className="sm:col-span-2 p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <MapPin className="w-4 h-4" />
                    Address
                  </div>
                  <div className="font-medium text-white">{customer.address || '—'}</div>
                </div>
              </div>
            </div>

            {/* Investment Details */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Investment Details</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Plan</div>
                  <div className="font-medium text-white">{customer.plan || '—'}</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Invested Amount</div>
                  <div className="font-medium text-white">{inr(customer.investedAmount)}</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Monthly Payout</div>
                  <div className="font-medium text-white">{inr(customer.monthlyPayout)}</div>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                To update your details, please contact your advisor at <a href="tel:+917013178382" className="text-indigo-400 hover:text-indigo-300 transition-colors">+91 70131 78382</a>.
              </p>
            </div>

            {/* Payment Details */}
            {customer.utrNumber && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Payment Details</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="p-4 bg-gray-800/30 rounded-xl">
                    <div className="text-sm text-gray-400 mb-1">Payment Method</div>
                    <div className="font-medium text-white">{customer.paymentMethod || '—'}</div>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-xl">
                    <div className="text-sm text-gray-400 mb-1">UTR / Transaction No.</div>
                    <div className="font-medium text-white">{customer.utrNumber || '—'}</div>
                  </div>
                  {customer.referenceNo && (
                    <div className="p-4 bg-gray-800/30 rounded-xl">
                      <div className="text-sm text-gray-400 mb-1">Reference No.</div>
                      <div className="font-medium text-white">{customer.referenceNo}</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
