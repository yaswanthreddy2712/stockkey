import { useState, useEffect } from 'react'

interface AssetDetail {
  title: string
  subtitle: string
  icon: string
  gradient: string
  summary: { label: string; value: string }[]
  holdings: { name: string; ticker: string; price: string; change: string; weight: string; sector: string }[]
  performance: { period: string; return_: string }[]
  description: string
}

const assetsData: Record<string, AssetDetail> = {
  Equities: {
    title: 'Equities Portfolio',
    subtitle: 'Blue-chip stocks managed by NISM-certified experts via Angel One',
    icon: '📈',
    gradient: 'from-sky-500 to-blue-600',
    summary: [
      { label: 'Total Holdings', value: '12 Stocks' },
      { label: 'Market Value', value: '₹42.5 Cr' },
      { label: 'YTD Return', value: '+18.4%' },
      { label: 'Dividend Yield', value: '1.8%' },
    ],
    holdings: [
      { name: 'Reliance Industries', ticker: 'RELIANCE', price: '₹2,945', change: '+1.2%', weight: '18%', sector: 'Oil & Gas' },
      { name: 'HDFC Bank', ticker: 'HDFCBANK', price: '₹1,687', change: '+0.7%', weight: '15%', sector: 'Banking' },
      { name: 'Tata Consultancy', ticker: 'TCS', price: '₹3,892', change: '+0.9%', weight: '12%', sector: 'IT' },
      { name: 'ICICI Bank', ticker: 'ICICIBANK', price: '₹1,245', change: '+1.1%', weight: '10%', sector: 'Banking' },
      { name: 'Infosys', ticker: 'INFY', price: '₹1,567', change: '+1.4%', weight: '9%', sector: 'IT' },
      { name: 'ITC Limited', ticker: 'ITC', price: '₹478', change: '+0.5%', weight: '8%', sector: 'FMCG' },
      { name: 'Hindustan Unilever', ticker: 'HINDUNILVR', price: '₹2,340', change: '-0.3%', weight: '7%', sector: 'FMCG' },
      { name: 'Bharti Airtel', ticker: 'BHARTIARTL', price: '₹1,520', change: '+1.8%', weight: '6%', sector: 'Telecom' },
      { name: 'State Bank of India', ticker: 'SBIN', price: '₹812', change: '+0.4%', weight: '5%', sector: 'Banking' },
      { name: 'Kotak Mahindra', ticker: 'KOTAKBANK', price: '₹1,890', change: '+0.6%', weight: '4%', sector: 'Banking' },
      { name: 'Larsen & Toubro', ticker: 'LT', price: '₹3,456', change: '+1.0%', weight: '3%', sector: 'Infrastructure' },
      { name: 'Asian Paints', ticker: 'ASIANPAINT', price: '₹2,890', change: '+0.8%', weight: '3%', sector: 'Consumer' },
    ],
    performance: [
      { period: '1 Month', return_: '+2.4%' },
      { period: '3 Months', return_: '+6.8%' },
      { period: '6 Months', return_: '+12.5%' },
      { period: '1 Year', return_: '+18.4%' },
      { period: '3 Years', return_: '+52.1%' },
      { period: '5 Years', return_: '+98.7%' },
    ],
    description: 'Our equity portfolio focuses on NIFTY 50 blue-chip companies with strong fundamentals. Managed through Angel One\'s institutional desk with strict risk management and position sizing rules.',
  },
  Bonds: {
    title: 'Bonds Portfolio',
    subtitle: 'Government & Corporate bonds for stable, predictable income',
    icon: '🏦',
    gradient: 'from-gold-200 to-gold-700',
    summary: [
      { label: 'Total Holdings', value: '8 Bonds' },
      { label: 'Market Value', value: '₹21.3 Cr' },
      { label: 'Avg Yield', value: '7.2%' },
      { label: 'Credit Rating', value: 'AAA/AA+' },
    ],
    holdings: [
      { name: 'GOI 7.18% 2033', ticker: 'GOI-BOND', price: '₹108.45', change: '+0.2%', weight: '20%', sector: 'Government' },
      { name: 'NHAI 7.54% 2032', ticker: 'NHAI-BOND', price: '₹112.30', change: '+0.3%', weight: '18%', sector: 'PSU' },
      { name: 'HDFC Bank Ltd 7.40% 2029', ticker: 'HDFC-BOND', price: '₹106.80', change: '+0.1%', weight: '15%', sector: 'Corporate' },
      { name: 'NABARD 7.25% 2031', ticker: 'NABARD-BD', price: '₹109.50', change: '+0.2%', weight: '14%', sector: 'PSU' },
      { name: 'Tata Steel 7.80% 2028', ticker: 'TATA-BOND', price: '₹105.20', change: '-0.1%', weight: '12%', sector: 'Corporate' },
      { name: 'IREDA 7.60% 2030', ticker: 'IREDA-BD', price: '₹107.90', change: '+0.1%', weight: '10%', sector: 'PSU' },
      { name: 'Power Finance 7.95% 2029', ticker: 'PFC-BOND', price: '₹108.10', change: '+0.2%', weight: '7%', sector: 'NBFC' },
      { name: 'SJVN Ltd 7.30% 2032', ticker: 'SJVN-BOND', price: '₹106.40', change: '+0.1%', weight: '4%', sector: 'PSU' },
    ],
    performance: [
      { period: '1 Month', return_: '+0.5%' },
      { period: '3 Months', return_: '+1.8%' },
      { period: '6 Months', return_: '+3.6%' },
      { period: '1 Year', return_: '+7.2%' },
      { period: '3 Years', return_: '+22.5%' },
      { period: '5 Years', return_: '+38.9%' },
    ],
    description: 'Our bond portfolio includes Government Securities (G-Secs), PSU Bonds, and high-rated Corporate Bonds. These provide stable coupon income and portfolio stability during market volatility.',
  },
  ETFs: {
    title: 'ETFs Portfolio',
    subtitle: 'Exchange Traded Funds for instant diversification',
    icon: '📊',
    gradient: 'from-gray-700 to-gray-900',
    summary: [
      { label: 'Total Holdings', value: '6 ETFs' },
      { label: 'Market Value', value: '₹16.8 Cr' },
      { label: 'Avg Expense', value: '0.05%' },
      { label: 'Tracking Error', value: '<0.01%' },
    ],
    holdings: [
      { name: 'Nippon India ETF NIFTY BEES', ticker: 'NIFTYBEES', price: '₹245.80', change: '+1.2%', weight: '35%', sector: 'NIFTY 50' },
      { name: 'Nippon India ETF Junior BEES', ticker: 'JUNIORBEES', price: '₹512.40', change: '+1.5%', weight: '20%', sector: 'NIFTY Next 50' },
      { name: 'Nippon India ETF Bank BEES', ticker: 'BANKBEES', price: '₹528.90', change: '+0.8%', weight: '18%', sector: 'Nifty Bank' },
      { name: 'Nippon India ETF Gold BEES', ticker: 'GOLDBEES', price: '₹52.30', change: '+0.5%', weight: '15%', sector: 'Gold' },
      { name: 'Motilal Oswal Nasdaq 100 ETF', ticker: 'MON100', price: '₹28.45', change: '+1.8%', weight: '7%', sector: 'US Tech' },
      { name: 'Nippon India ETF Nifty Next 50', ticker: 'NEXT50', price: '₹178.60', change: '+1.3%', weight: '5%', sector: 'Large Cap' },
    ],
    performance: [
      { period: '1 Month', return_: '+2.1%' },
      { period: '3 Months', return_: '+5.9%' },
      { period: '6 Months', return_: '+11.2%' },
      { period: '1 Year', return_: '+16.8%' },
      { period: '3 Years', return_: '+48.3%' },
      { period: '5 Years', return_: '+92.1%' },
    ],
    description: 'Our ETF allocation provides instant diversification at minimal cost. NIFTYBEES tracks the top 50 companies, while GOLDBEES acts as an inflation hedge. All ETFs are liquid and tradeable on NSE/BSE.',
  },
  IPOs: {
    title: 'IPO Portfolio',
    subtitle: 'Strategic IPO allocations for listing gains & long-term growth',
    icon: '🎯',
    gradient: 'from-emerald-100 to-emerald-400',
    summary: [
      { label: 'Total Allocations', value: '5 IPOs' },
      { label: 'Invested Amount', value: '₹8.5 Cr' },
      { label: 'Avg Listing Gain', value: '+32%' },
      { label: 'Success Rate', value: '80%' },
    ],
    holdings: [
      { name: 'Bajaj Housing Finance', ticker: 'BAJAJ-HFL', price: '₹128', change: '+85%', weight: '25%', sector: 'Housing Finance' },
      { name: 'FirstCry (Brainbees)', ticker: 'FIRSTCRY', price: '₹625', change: '+42%', weight: '22%', sector: 'E-Commerce' },
      { name: 'Ola Electric', ticker: 'OLAELEC', price: '₹72', change: '-15%', weight: '18%', sector: 'EV' },
      { name: 'JSW Infrastructure', ticker: 'JSWINFRA', price: '₹320', change: '+28%', weight: '20%', sector: 'Infrastructure' },
      { name: 'Nuvama Wealth', ticker: 'NUVAMA', price: '₹4,890', change: '+65%', weight: '15%', sector: 'Wealth Mgmt' },
    ],
    performance: [
      { period: 'Bajaj HFL', return_: '+85%' },
      { period: 'FirstCry', return_: '+42%' },
      { period: 'JSW Infra', return_: '+28%' },
      { period: 'Nuvama', return_: '+65%' },
      { period: 'Ola Electric', return_: '-15%' },
      { period: 'Portfolio Avg', return_: '+32%' },
    ],
    description: 'Our IPO strategy focuses on quality companies with strong fundamentals and good GMP (Grey Market Premium). We apply through Angel One\'s IPO platform and hold promising listings for long-term growth.',
  },
}

export default function AssetDetailModal({ asset, onClose }: { asset: string; onClose: () => void }) {
  const data = assetsData[asset]
  if (!data) return null

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl animate-fade-up"
        style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-dark)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-5 bg-gradient-to-r ${data.gradient} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{data.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white font-display">{data.title}</h2>
              <p className="text-sm text-white/80">{data.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.summary.map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
                <p className="mt-1 text-lg font-bold text-gray-100 tabular">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Holdings Table */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Holdings via Angel One</h3>
            <div className="rounded-xl border border-gray-700/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wide">
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Sector</th>
                    <th className="text-right px-4 py-3">Price</th>
                    <th className="text-right px-4 py-3">Change</th>
                    <th className="text-right px-4 py-3">Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {data.holdings.map((h) => (
                    <tr key={h.ticker} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-100">{h.name}</p>
                          <p className="text-xs text-gray-500">{h.ticker}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{h.sector}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-100 tabular">{h.price}</td>
                      <td className={`px-4 py-3 text-right font-medium tabular ${h.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{h.change}</td>
                      <td className="px-4 py-3 text-right text-gray-400 tabular">{h.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Performance History</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {data.performance.map((p) => (
                <div key={p.period} className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-3 text-center">
                  <p className="text-xs text-gray-500">{p.period}</p>
                  <p className={`mt-1 text-lg font-bold tabular ${p.return_.startsWith('+') ? 'text-emerald-400' : p.return_.startsWith('-') ? 'text-red-400' : 'text-gray-100'}`}>{p.return_}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">About This Portfolio</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{data.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
