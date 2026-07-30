import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import type { InsuranceCategory } from '../../types'
import { inr } from '../../lib/utils'
import { IconStar, IconCheck, IconShield } from '../../components/icons'
import LeadForm from '../../components/LeadForm'

const valid: InsuranceCategory[] = ['Health', 'Term', 'Car', 'Bike']

const meta: Record<InsuranceCategory, { title: string; subtitle: string; emoji: string }> = {
  Health: { title: 'Health Insurance', subtitle: 'Protect your family from rising medical bills with cashless hospitalisation.', emoji: '🩺' },
  Term: { title: 'Term Insurance', subtitle: 'High life cover at the lowest premiums — financial security for your loved ones.', emoji: '🛡️' },
  Car: { title: 'Car Insurance', subtitle: 'Comprehensive car cover with cashless repairs and zero depreciation.', emoji: '🚗' },
  Bike: { title: 'Bike Insurance', subtitle: 'Instant two-wheeler insurance with cashless claims.', emoji: '🏍️' },
}

export default function InsuranceCategoryPage() {
  const { category = '' } = useParams()
  const { insurancePlans } = useData()
  const cat = (valid.includes(category as InsuranceCategory) ? category : 'Health') as InsuranceCategory
  const plans = useMemo(() => insurancePlans.filter((p) => p.category === cat), [insurancePlans, cat])

  // premium calculator inputs
  const [age, setAge] = useState(35)
  const [cover, setCover] = useState(cat === 'Term' ? 10000000 : 1000000)
  const [selectedId, setSelectedId] = useState<string>(plans[0]?.id ?? '')
  const [showLead, setShowLead] = useState(false)

  // simple premium estimate derived from base premium
  const estimatedPremium = useMemo(() => {
    const base = plans[0]?.basePremium ?? 10000
    const ageFactor = 1 + Math.max(0, age - 25) * 0.03
    const coverFactor = cover / (cat === 'Term' ? 10000000 : 1000000)
    return Math.round(base * ageFactor * coverFactor)
  }, [plans, age, cover, cat])

  const selectedPlan = plans.find((p) => p.id === selectedId) ?? plans[0]

  if (!plans.length) {
    return <div className="section py-20 text-center text-slate-500">No plans available in this category.</div>
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="section py-12">
          <Link to="/insurance" className="text-sm text-brand-200 hover:text-white">← All Insurance</Link>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-4xl">{meta[cat].emoji}</span>
            <div>
              <h1 className="text-3xl font-bold">{meta[cat].title}</h1>
              <p className="text-brand-100">{meta[cat].subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section py-12 grid gap-8 lg:grid-cols-3">
        {/* Plans list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Available Plans ({plans.length})</h2>
          {plans.map((p) => (
            <div key={p.id} className={`card p-5 ${selectedId === p.id ? 'ring-2 ring-brand-600' : ''}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-800">{p.planName}</h3>
                    {p.cashless && (
                      <span className="badge bg-green-100 text-green-700"><IconCheck className="h-3 w-3" /> Cashless</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">by {p.insurer}</p>
                  <p className="mt-1 text-sm text-slate-600">{p.tagline}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 text-amber-600">
                      <IconStar className="h-3.5 w-3.5 fill-current" /> {p.rating}
                    </span>
                    {p.claimSettlementRate && (
                      <span className="text-slate-500">{p.claimSettlementRate}% claim settlement</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">starting from</p>
                  <p className="text-2xl font-bold text-brand-700">{inr(p.basePremium)}</p>
                  <p className="text-xs text-slate-400">per year</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {p.features.map((f) => (
                  <div key={f} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" /> {f}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.highlights.map((h) => (
                  <span key={h} className="badge bg-brand-50 text-brand-700">{h}</span>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { setSelectedId(p.id); setShowLead(true); }}
                  className="btn-primary"
                >
                  Get Quote
                </button>
                <button
                  onClick={() => setSelectedId(p.id)}
                  className="btn-outline"
                >
                  {selectedId === p.id ? '✓ Selected to compare' : 'Select to compare'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Premium calculator sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <div className="card p-5">
              <div className="flex items-center gap-2">
                <IconShield className="h-5 w-5 text-brand-600" />
                <h3 className="font-bold text-slate-800">Premium Calculator</h3>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="label">Your age: <span className="font-bold text-brand-700">{age} yrs</span></label>
                  <input type="range" min={18} max={70} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full accent-brand-600" />
                </div>
                <div>
                  <label className="label">Coverage amount</label>
                  <select className="input" value={cover} onChange={(e) => setCover(Number(e.target.value))}>
                    {(cat === 'Term'
                      ? [2500000, 5000000, 7500000, 10000000, 20000000]
                      : [500000, 1000000, 1500000, 2000000, 5000000]
                    ).map((c) => <option key={c} value={c}>{inr(c, true)}</option>)}
                  </select>
                </div>
                <div className="rounded-xl bg-brand-50 p-4 text-center">
                  <p className="text-xs text-brand-700">Estimated premium</p>
                  <p className="text-3xl font-bold text-brand-800">{inr(estimatedPremium)}</p>
                  <p className="text-xs text-brand-700">per year · excl. GST</p>
                </div>
                <button onClick={() => setShowLead(true)} className="btn-accent w-full">
                  Get This Quote
                </button>
              </div>
            </div>

            <div className="card p-5 bg-slate-50">
              <p className="text-sm font-semibold text-slate-700">Why buy through Stock Key?</p>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                <li className="flex gap-1.5"><IconCheck className="h-3.5 w-3.5 text-green-600" /> Compare all insurers in one place</li>
                <li className="flex gap-1.5"><IconCheck className="h-3.5 w-3.5 text-green-600" /> Dedicated claims assistance</li>
                <li className="flex gap-1.5"><IconCheck className="h-3.5 w-3.5 text-green-600" /> Best price guaranteed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lead form section */}
      {showLead && (
        <section className="bg-white border-t border-slate-200 py-12">
          <div className="section max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 text-center">
              Get your {meta[cat].title} quote
            </h2>
            <p className="mt-1 text-center text-sm text-slate-500">
              {selectedPlan && <>Selected plan: <strong>{selectedPlan.planName}</strong> by {selectedPlan.insurer} · Est. {inr(estimatedPremium)}/yr</>}
            </p>
            <div className="mt-6">
              <LeadForm
                type="Insurance"
                insuranceCategory={cat}
                insurancePlanId={selectedPlan?.id}
                estimatedPremium={estimatedPremium}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
