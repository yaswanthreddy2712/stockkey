import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import DashboardShell from '../../components/DashboardShell'
import { useData } from '../../context/DataContext'
import { inr } from '../../lib/utils'
import { IconStar, IconCheck, IconHeart, IconShield, IconCar, IconBike } from '../../components/icons'
import LeadForm from '../../components/LeadForm'
import type { InsuranceCategory, InsurancePlan } from '../../types'
import type { ReactNode } from 'react'

const categoryMeta: Record<InsuranceCategory, { icon: (p: { className?: string }) => ReactNode; color: string; bg: string }> = {
  Health: { icon: IconHeart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  Term: { icon: IconShield, color: 'text-brand-600', bg: 'bg-brand-50' },
  Car: { icon: IconCar, color: 'text-amber-600', bg: 'bg-amber-50' },
  Bike: { icon: IconBike, color: 'text-violet-600', bg: 'bg-violet-50' },
}

export default function CustomerInsurance() {
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
    <DashboardShell variant="customer">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 font-display">Insurance Marketplace</h1>
          <p className="text-ink-500 text-sm">Compare and buy insurance from top insurers — Health, Term, Car &amp; Bike.</p>
        </div>
        <Link to="/insurance" className="btn-outline text-sm">View Full Marketplace &rarr;</Link>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['All', 'Health', 'Term', 'Car', 'Bike'] as const).map((c) => (
          <button key={c} onClick={() => setActiveCategory(c)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeCategory === c ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'}`}>
            {c === 'All' ? 'All Plans' : c}
            <span className="ml-1.5 text-xs opacity-60">({c === 'All' ? insurancePlans.length : insurancePlans.filter((p) => p.category === c).length})</span>
          </button>
        ))}
      </div>

      {/* Plans by category */}
      {Object.entries(grouped).map(([cat, catPlans]) => {
        const cm = categoryMeta[cat as InsuranceCategory]
        const Icon = cm.icon
        return (
          <div key={cat} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${cm.bg} ${cm.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-ink-800 font-display">{cat} Insurance</h2>
              <span className="text-sm text-ink-400">({catPlans.length} plans)</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {catPlans.map((p) => (
                <div key={p.id} className="premium-card p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-gold-500 text-sm font-semibold">
                      <IconStar className="h-4 w-4 fill-current" /> {p.rating}
                    </span>
                    {p.cashless && <span className="badge bg-emerald-50 text-emerald-700 text-[10px]"><IconCheck className="h-3 w-3" /> Cashless</span>}
                    {p.claimSettlementRate && <span className="badge bg-brand-50 text-brand-700 text-[10px]">{p.claimSettlementRate}% claims</span>}
                  </div>
                  <h3 className="text-base font-bold text-ink-800 font-display">{p.planName}</h3>
                  <p className="text-xs text-ink-500">by {p.insurer}</p>
                  <p className="mt-2 text-sm text-ink-600 leading-relaxed flex-1">{p.tagline}</p>
                  <div className="mt-3 p-3 rounded-xl bg-ink-50 text-center">
                    <p className="text-xs text-ink-400 uppercase tracking-wide">Starting from</p>
                    <p className="text-xl font-bold text-gold-700 tabular">{inr(p.basePremium)}</p>
                    <p className="text-xs text-ink-400">per year</p>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-ink-600">
                        <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => { setSelectedPlan(p); setShowLead(true); }} className="mt-4 w-full btn-gold text-center text-sm">
                    Get Quote
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Lead form */}
      {showLead && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setShowLead(false)} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto premium-card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-ink-800 font-display">Get Quote</h3>
                  <p className="text-sm text-ink-400">{selectedPlan.planName} by {selectedPlan.insurer}</p>
                </div>
                <button onClick={() => setShowLead(false)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-50">&times;</button>
              </div>
              <LeadForm
                type="Insurance"
                insuranceCategory={selectedPlan.category}
                insurancePlanId={selectedPlan.id}
                estimatedPremium={selectedPlan.basePremium}
                compact
              />
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
