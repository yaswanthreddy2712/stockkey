import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { motion } from 'framer-motion'
import { LayoutDashboard, Shield, Heart, Car, Bike, Star, Check, ArrowUpRight, BarChart3, Wallet } from 'lucide-react'
import { inr } from '../../lib/utils'
import LeadForm from '../../components/LeadForm'
import type { InsuranceCategory, InsurancePlan } from '../../types'
import type { ReactNode } from 'react'

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

const categoryMeta: Record<InsuranceCategory, { icon: (p: { className?: string }) => ReactNode; color: string; gradient: string }> = {
  Health: { icon: Heart, color: 'text-emerald-400', gradient: 'from-emerald-500 to-teal-400' },
  Term: { icon: Shield, color: 'text-blue-400', gradient: 'from-blue-500 to-cyan-400' },
  Car: { icon: Car, color: 'text-amber-400', gradient: 'from-amber-500 to-orange-400' },
  Bike: { icon: Bike, color: 'text-purple-400', gradient: 'from-purple-500 to-pink-400' },
}

export default function CustomerInsurance() {
  const { user } = useAuth()
  const { insurancePlans } = useData()
  const [activeCategory, setActiveCategory] = useState<InsuranceCategory | 'All'>('All')
  const [showLead, setShowLead] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null)

  const filtered = useMemo(() =>
    activeCategory === 'All' ? insurancePlans : insurancePlans.filter((p) => p.category === activeCategory),
  [insurancePlans, activeCategory])

  const grouped = useMemo(() => {
    const map: Record<string, InsurancePlan[]> = {}
    filtered.forEach((p) => { (map[p.category] ??= []).push(p) })
    return map
  }, [filtered])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Insurance</h1>
                <p className="text-xs text-gray-400">Compare and buy insurance plans</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
              <Link to="/dashboard/portfolio" className="text-gray-400 hover:text-white transition-colors">
                <BarChart3 className="w-5 h-5" />
              </Link>
              <Link to="/dashboard/profile" className="text-gray-400 hover:text-white transition-colors">
                <Wallet className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {(['All', 'Health', 'Term', 'Car', 'Bike'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === c
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600/50 hover:text-white'
              }`}
            >
              {c === 'All' ? 'All Plans' : c}
              <span className="ml-1.5 text-xs opacity-60">({c === 'All' ? insurancePlans.length : insurancePlans.filter((p) => p.category === c).length})</span>
            </button>
          ))}
        </motion.div>

        {/* Plans by Category */}
        {Object.entries(grouped).map(([cat, catPlans]) => {
          const cm = categoryMeta[cat as InsuranceCategory]
          const Icon = cm.icon
          return (
            <motion.div 
              key={cat} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cm.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{cat} Insurance</h2>
                  <p className="text-xs text-gray-400">{catPlans.length} plans available</p>
                </div>
              </div>
              
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {catPlans.map((p) => (
                  <motion.div 
                    key={p.id}
                    whileHover={{ y: -2 }}
                    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all duration-300 flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 text-amber-400 text-sm font-semibold">
                        <Star className="w-4 h-4 fill-current" /> {p.rating}
                      </span>
                      {p.cashless && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Check className="w-3 h-3" /> Cashless
                        </span>
                      )}
                      {p.claimSettlementRate && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {p.claimSettlementRate}% claims
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-base font-semibold text-white mb-1">{p.planName}</h3>
                    <p className="text-xs text-gray-500 mb-2">by {p.insurer}</p>
                    <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-4">{p.tagline}</p>
                    
                    <div className="p-4 bg-gray-800/30 rounded-xl mb-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Starting from</p>
                      <p className="text-xl font-bold text-white">{inr(p.basePremium)}</p>
                      <p className="text-xs text-gray-500">per year</p>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {p.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-gray-400">
                          <Check className="mt-0.5 w-3.5 h-3.5 shrink-0 text-emerald-400" /> {f}
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => { setSelectedPlan(p); setShowLead(true); }}
                      className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                    >
                      Get Quote
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}

        {/* Lead Form Modal */}
        {showLead && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLead(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-800/50 rounded-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Get Quote</h3>
                    <p className="text-sm text-gray-400">{selectedPlan.planName} by {selectedPlan.insurer}</p>
                  </div>
                  <button
                    onClick={() => setShowLead(false)}
                    className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <LeadForm
                  type="Insurance"
                  insuranceCategory={selectedPlan.category}
                  insurancePlanId={selectedPlan.id}
                  estimatedPremium={selectedPlan.basePremium}
                  compact
                />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
