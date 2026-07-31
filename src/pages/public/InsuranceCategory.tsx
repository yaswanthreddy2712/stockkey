import { useState, useMemo, type ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import type { InsuranceCategory, InsurancePlan } from '../../types'
import { inr } from '../../lib/utils'
import { IconStar, IconCheck, IconShield, IconHeart, IconCar, IconBike, IconX } from '../../components/icons'
import LeadForm from '../../components/LeadForm'

const valid: InsuranceCategory[] = ['Health', 'Term', 'Car', 'Bike']

const meta: Record<InsuranceCategory, { title: string; subtitle: string; icon: (p: { className?: string }) => ReactNode; coverOptions: number[] }> = {
  Health: { title: 'Health Insurance', subtitle: 'Protect your family from rising medical bills with cashless hospitalisation.', icon: IconHeart, coverOptions: [300000, 500000, 1000000, 1500000, 2000000, 5000000] },
  Term: { title: 'Term Insurance', subtitle: 'High life cover at the lowest premiums — financial security for your loved ones.', icon: IconShield, coverOptions: [2500000, 5000000, 7500000, 10000000, 15000000, 20000000] },
  Car: { title: 'Car Insurance', subtitle: 'Comprehensive car cover with cashless repairs and zero depreciation.', icon: IconCar, coverOptions: [300000, 500000, 750000, 1000000, 1500000] },
  Bike: { title: 'Bike Insurance', subtitle: 'Instant two-wheeler insurance with cashless claims.', icon: IconBike, coverOptions: [50000, 100000, 150000, 300000, 500000] },
}

export default function InsuranceCategoryPage() {
  const { category = '' } = useParams()
  const { insurancePlans } = useData()
  const cat = (valid.includes(category as InsuranceCategory) ? category : 'Health') as InsuranceCategory
  const plans = useMemo(() => insurancePlans.filter((p) => p.category === cat), [insurancePlans, cat])

  const [age, setAge] = useState(30)
  const [cover, setCover] = useState(meta[cat].coverOptions[2])
  const [showLead, setShowLead] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'cards' | 'compare'>('cards')

  const estimatedPremiums = useMemo(() => {
    return plans.map((p) => {
      const ageFactor = 1 + Math.max(0, age - 25) * 0.03
      const coverFactor = cover / (cat === 'Term' ? 10000000 : 1000000)
      return { plan: p, premium: Math.round(p.basePremium * ageFactor * coverFactor) }
    })
  }, [plans, age, cover, cat])

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev)
  }

  const comparePlans = plans.filter((p) => compareIds.includes(p.id))

  if (!plans.length) {
    return <div className="section py-20 text-center text-ink-500">No plans available in this category.</div>
  }

  const CategoryIcon = meta[cat].icon

  return (
    <div>
      {/* Header */}
      <section className="bg-ink-premium relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="section relative py-12 z-10">
          <Link to="/insurance" className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-gold-400 transition-colors mb-4">
            &larr; All Insurance
          </Link>
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/20">
              <CategoryIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-display-lg font-display text-white">{meta[cat].title}</h1>
              <p className="text-ink-400">{meta[cat].subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#F7F8FB] section py-10">
        {/* Premium calculator bar */}
        <div className="premium-card p-5 mb-8">
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex-1 min-w-[200px]">
              <label className="label">Your Age: <span className="font-bold text-gold-600">{age} years</span></label>
              <input type="range" min={18} max={70} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full mt-1" />
              <div className="flex justify-between text-xs text-ink-400 mt-1"><span>18</span><span>70</span></div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="label">Coverage Amount</label>
              <select className="input" value={cover} onChange={(e) => setCover(Number(e.target.value))}>
                {meta[cat].coverOptions.map((c) => <option key={c} value={c}>{inr(c, true)}</option>)}
              </select>
            </div>
            <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500/10 to-gold-500/5 ring-1 ring-gold-500/20 text-center min-w-[180px]">
              <p className="text-xs text-ink-400 uppercase tracking-wide">Your Age Group</p>
              <p className="text-lg font-bold text-gold-700 tabular">{age} yrs</p>
            </div>
          </div>
        </div>

        {/* Tab toggle */}
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setActiveTab('cards')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'cards' ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'}`}>
            Plan Cards
          </button>
          <button onClick={() => setActiveTab('compare')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'compare' ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'}`}>
            Compare ({compareIds.length})
          </button>
        </div>

        {activeTab === 'cards' ? (
          /* Plan cards */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {estimatedPremiums.map(({ plan: p, premium }, i) => (
              <div key={p.id} className={`premium-card p-5 flex flex-col ${i === 0 ? 'ring-2 ring-gold-500/40 shadow-gold' : ''}`}>
                {i === 0 && (
                  <span className="self-start rounded-full bg-gold-gradient px-3 py-1 text-xs font-bold text-ink-900 mb-3">Most Popular</span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-gold-500 text-sm font-semibold">
                    <IconStar className="h-4 w-4 fill-current" /> {p.rating}
                  </span>
                  {p.cashless && (
                    <span className="badge bg-emerald-50 text-emerald-700 text-[10px]"><IconCheck className="h-3 w-3" /> Cashless</span>
                  )}
                  {p.claimSettlementRate && (
                    <span className="badge bg-brand-50 text-brand-700 text-[10px]">{p.claimSettlementRate}% claims</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-ink-800 font-display">{p.planName}</h3>
                <p className="text-sm text-ink-500">by {p.insurer}</p>
                <p className="mt-2 text-sm text-ink-600 leading-relaxed">{p.tagline}</p>

                <div className="mt-4 p-4 rounded-xl bg-ink-50 text-center">
                  <p className="text-xs text-ink-400 uppercase tracking-wide">Estimated Premium</p>
                  <p className="text-3xl font-bold text-gold-700 tabular">{inr(premium)}</p>
                  <p className="text-xs text-ink-400">per year &middot; excl. GST</p>
                </div>

                <ul className="mt-4 space-y-2 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-ink-600">
                      <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" /> {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.highlights.map((h) => (
                    <span key={h} className="badge-gold text-[10px]">{h}</span>
                  ))}
                </div>

                <div className="mt-5 flex gap-2">
                  <button onClick={() => { setSelectedPlan(p); setShowLead(true); }} className="btn-gold flex-1 text-center">
                    Get Quote
                  </button>
                  <button onClick={() => toggleCompare(p.id)} className={`btn-outline flex-1 text-center text-xs ${compareIds.includes(p.id) ? 'border-gold-500 bg-gold-500/5 text-gold-700' : ''}`}>
                    {compareIds.includes(p.id) ? 'Selected' : 'Compare'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Comparison table */
          comparePlans.length === 0 ? (
            <div className="premium-card p-12 text-center text-ink-400">
              <p>Select up to 3 plans from the Cards tab to compare them side by side.</p>
            </div>
          ) : (
            <div className="premium-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ink-50 border-b border-ink-100">
                      <th className="px-5 py-4 text-left font-semibold text-ink-600 w-48">Feature</th>
                      {comparePlans.map((p) => (
                        <th key={p.id} className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <IconStar className="h-3.5 w-3.5 text-gold-500 fill-current" /> <span className="font-bold text-ink-800">{p.rating}</span>
                          </div>
                          <p className="font-bold text-ink-800 font-display">{p.planName}</p>
                          <p className="text-xs text-ink-400">{p.insurer}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-50">
                    <tr className="bg-ink-50/50">
                      <td className="px-5 py-3 font-semibold text-ink-600">Estimated Premium</td>
                      {comparePlans.map((p) => {
                        const ep = estimatedPremiums.find((e) => e.plan.id === p.id)
                        return <td key={p.id} className="px-5 py-3 text-center font-bold text-gold-700 tabular">{ep ? inr(ep.premium) : '—'}</td>
                      })}
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-semibold text-ink-600">Base Premium</td>
                      {comparePlans.map((p) => <td key={p.id} className="px-5 py-3 text-center tabular">{inr(p.basePremium)}</td>)}
                    </tr>
                    <tr className="bg-ink-50/50">
                      <td className="px-5 py-3 font-semibold text-ink-600">Cashless</td>
                      {comparePlans.map((p) => <td key={p.id} className="px-5 py-3 text-center">{p.cashless ? <IconCheck className="mx-auto h-4 w-4 text-emerald-500" /> : <IconX className="mx-auto h-4 w-4 text-ink-300" />}</td>)}
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-semibold text-ink-600">Claim Settlement</td>
                      {comparePlans.map((p) => <td key={p.id} className="px-5 py-3 text-center font-medium">{p.claimSettlementRate ? `${p.claimSettlementRate}%` : '—'}</td>)}
                    </tr>
                    <tr className="bg-ink-50/50">
                      <td className="px-5 py-3 font-semibold text-ink-600">Features</td>
                      {comparePlans.map((p) => (
                        <td key={p.id} className="px-5 py-3">
                          <ul className="space-y-1">
                            {p.features.map((f) => <li key={f} className="flex items-start gap-1 text-xs text-ink-600"><IconCheck className="mt-0.5 h-3 w-3 shrink-0 text-gold-500" /> {f}</li>)}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-semibold text-ink-600">Highlights</td>
                      {comparePlans.map((p) => (
                        <td key={p.id} className="px-5 py-3">
                          <div className="flex flex-wrap gap-1">{p.highlights.map((h) => <span key={h} className="badge-gold text-[10px]">{h}</span>)}</div>
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-ink-50/50">
                      <td className="px-5 py-3"></td>
                      {comparePlans.map((p) => (
                        <td key={p.id} className="px-5 py-3 text-center">
                          <button onClick={() => { setSelectedPlan(p); setShowLead(true); }} className="btn-gold btn-sm">Get Quote</button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* Why Stock Key */}
        <div className="mt-8 premium-card p-5 bg-ink-50">
          <p className="text-sm font-bold text-ink-700 font-display">Why buy through Stock Key?</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              { title: 'Compare All Insurers', desc: 'View plans from 20+ top insurers in one place.' },
              { title: 'Dedicated Claims Help', desc: 'Our team assists you through every step of the claim process.' },
              { title: 'Best Price Guarantee', desc: 'We negotiate the lowest premiums so you save more.' },
            ].map((w) => (
              <div key={w.title} className="flex items-start gap-2">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <div>
                  <p className="text-xs font-bold text-ink-700">{w.title}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lead form modal */}
      {showLead && selectedPlan && (
        <section className="bg-white border-t border-ink-100 py-12">
          <div className="section max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-ink-800 font-display">Get your {meta[cat].title} quote</h2>
                <p className="text-sm text-ink-400 mt-1">
                  Plan: <strong className="text-ink-700">{selectedPlan.planName}</strong> by {selectedPlan.insurer}
                </p>
              </div>
              <button onClick={() => setShowLead(false)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-50 hover:text-ink-600">
                <IconX className="h-5 w-5" />
              </button>
            </div>
            <LeadForm
              type="Insurance"
              insuranceCategory={cat}
              insurancePlanId={selectedPlan.id}
              estimatedPremium={estimatedPremiums.find((e) => e.plan.id === selectedPlan.id)?.premium}
            />
          </div>
        </section>
      )}
    </div>
  )
}
