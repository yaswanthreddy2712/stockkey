export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: number
}

interface Rule {
  keywords: string[]
  response: string
}

const rules: Rule[] = [
  // ── Greetings ──
  { keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'namaste'],
    response: 'Hello! Welcome to Stock Key Investments. I\'m here to help you with our investment plans, insurance products, returns, and more. What would you like to know?' },

  // ── Plans & Pricing ──
  { keywords: ['plan', 'plans', 'investment plan', 'pricing', 'price', 'cost', 'how much'],
    response: 'We offer 3 investment plans:\n\n• **Premium Plan** — ₹10,00,000 investment → ₹1,20,000/month return\n• **Standard Plan** — ₹5,00,000 investment → ₹60,000/month return\n• **Customised Plan** — ₹1,00,000 investment → ₹12,000/month return\n\nAll plans offer 12% monthly returns for 12 months. Visit /plans for full details.' },

  { keywords: ['premium', 'premium plan'],
    response: '**Premium Plan** — Our flagship plan:\n• Investment: ₹10,00,000\n• Monthly Return: ₹1,20,000\n• Duration: 12 months\n• Total Return: ₹14,40,000\n• Portfolio: RELIANCE, HDFCBANK, NIFTYBEES\n\nThis is our most popular plan for serious investors.' },

  { keywords: ['standard', 'standard plan'],
    response: '**Standard Plan** — Great value option:\n• Investment: ₹5,00,000\n• Monthly Return: ₹60,000\n• Duration: 12 months\n• Total Return: ₹7,20,000\n• Portfolio: TCS, ICICIBANK\n\nPerfect for investors starting their journey.' },

  { keywords: ['customised', 'customised plan', 'custom', 'custom plan'],
    response: '**Customised Plan** — Flexible entry point:\n• Investment: ₹1,00,000\n• Monthly Return: ₹12,000\n• Duration: 12 months\n• Total Return: ₹1,44,000\n• Portfolio: ITC, NIFTYBEES\n\nIdeal for first-time investors.' },

  // ── Returns & Payouts ──
  { keywords: ['return', 'returns', 'monthly return', 'payout', 'monthly payout', 'income'],
    response: 'All our plans deliver **12% monthly returns** for 12 consecutive months. Payouts are credited directly to your registered bank account on the 1st of every month. We have a 99% payout success rate.' },

  { keywords: ['guarantee', 'guaranteed', 'sure', 'confirmed'],
    response: 'Yes, our monthly payouts are **guaranteed** for the full 12-month period. We are SEBI-registered and follow strict regulatory guidelines. Our 500+ investors have received consistent payouts.' },

  { keywords: ['risk', 'risky', 'safe', 'safety', 'secure'],
    response: 'Your investment is managed by NISM-certified experts across a diversified portfolio of Equities, Bonds, ETFs, IPOs, and Options. We are SEBI-registered, which ensures regulatory oversight. Like all market-linked investments, returns are subject to market conditions, but our track record shows consistent 12% monthly payouts.' },

  // ── SEBI & Registration ──
  { keywords: ['sebi', 'registered', 'legitimate', 'legit', 'real', 'genuine', 'trusted'],
    response: 'Yes, we are **SEBI-registered** and led by **NISM-certified** experts. Stock Key Investments has been operating since 2020 with 500+ happy investors and ₹50Cr+ in assets under management.' },

  // ── Insurance ──
  { keywords: ['insurance', 'health insurance', 'term insurance', 'car insurance', 'bike insurance'],
    response: 'We offer 4 types of insurance:\n\n• **Health Insurance** — Starting ₹1,200/mo\n• **Term Insurance** — Starting ₹499/mo (₹1 Cr cover)\n• **Car Insurance** — Starting ₹3,500/yr\n• **Bike Insurance** — Starting ₹450/yr\n\nCompare plans from top insurers and get instant quotes at /insurance.' },

  { keywords: ['health', 'medical', 'hospital'],
    response: 'Our **Health Insurance** plans cover hospitalization, pre/post-hospitalization, daycare procedures, and more. Starting at just ₹1,200/month. Visit /insurance/health to compare plans.' },

  { keywords: ['term', 'life insurance', 'death cover'],
    response: 'Our **Term Insurance** offers ₹1 Crore life cover at affordable premiums starting ₹499/month. Secure your family\'s future with comprehensive term plans from top insurers.' },

  // ── How to Start ──
  { keywords: ['start', 'invest', 'register', 'sign up', 'open account', 'join', 'how to'],
    response: 'Getting started is easy:\n\n1. Visit /register\n2. Fill in your details (name, email, phone, Aadhaar, PAN)\n3. Choose your investment plan\n4. Make payment via UPI/Bank Transfer\n5. Verify OTP\n\nYour account will be activated and portfolio deployed within 24 hours!' },

  { keywords: ['payment', 'pay', 'upi', 'bank transfer', 'transaction'],
    response: 'We accept payments via:\n• UPI (GPay, PhonePe, Paytm)\n• Bank Transfer / NEFT / RTGS\n• Cheque\n• Cash\n\nAfter payment, you\'ll need to enter your UTR/Transaction number for verification.' },

  // ── Documents Required ──
  { keywords: ['document', 'documents', 'aadhaar', 'pan', 'kyc', 'verification'],
    response: 'Documents required for registration:\n• **Aadhaar Number** — for identity verification\n• **PAN Number** — for tax compliance\n• **Photo** — for your investment certificate\n• **UTR/Transaction Number** — for payment verification\n\nAll information is kept strictly confidential.' },

  // ── Tax ──
  { keywords: ['tax', 'tds', 'deduction', 'gst', 'income tax'],
    response: 'Investment returns are subject to applicable tax regulations. We provide regular performance reports and investment certificates for your tax filing. Consult your CA for specific tax advice related to your investments.' },

  // ── Certificate ──
  { keywords: ['certificate', 'invest certificate', 'investment certificate'],
    response: 'Yes! Every investor receives a formal **Investment Certificate** with their name, plan details, investment amount, and portfolio allocation. You can download it from your dashboard.' },

  // ── Dashboard ──
  { keywords: ['dashboard', 'account', 'login', 'portal'],
    response: 'After registering, you can access your **Investor Dashboard** at /dashboard where you can:\n• View your portfolio and holdings\n• Track monthly returns\n• Download investment certificate\n• View insurance policies\n• Update your profile' },

  // ── Contact ──
  { keywords: ['contact', 'phone', 'email', 'call', 'reach', 'support', 'help'],
    response: 'You can reach us at:\n• **Phone**: +91 70131 78382\n• **Email**: info@stockkeyinvestments.in\n• **Visit**: /contact page\n\nOur team is available Monday to Saturday, 9 AM to 6 PM.' },

  // ── About ──
  { keywords: ['about', 'who', 'company', 'team', 'stock key'],
    response: 'Stock Key Investments is a SEBI-registered early-retirement investment platform. Since 2020, we\'ve helped 500+ investors build passive income streams through professionally managed diversified portfolios. Learn more at /about.' },

  // ── Portfolio ──
  { keywords: ['portfolio', 'stocks', 'holdings', 'invested in', 'what do you invest'],
    response: 'Our portfolio is diversified across:\n• **Equities** — RELIANCE, HDFCBANK, TCS, ICICIBANK, ITC, HINDUNILVR\n• **ETFs** — NIFTYBEES, GOLDBEES\n• **Bonds** — Government & Corporate\n• **IPOs** — Strategic allocations\n\nAll managed by our NISM-certified team.' },

  // ── Monthly Tracking ──
  { keywords: ['track', 'report', 'performance', 'statement'],
    response: 'You receive regular **performance reports** showing:\n• Total capital invested\n• Returns earned each month\n• Current portfolio value\n• P&L breakdown\n\nAll reports are available in your dashboard.' },

  // ── Withdrawal ──
  { keywords: ['withdraw', 'withdrawal', 'exit', 'close', 'end'],
    response: 'Your investment tenure is 12 months. Monthly payouts are credited to your bank account automatically. At the end of the tenure, your principal is returned. Early exit terms may apply — contact our team for details.' },

  // ── Complaints / Issues ──
  { keywords: ['complaint', 'issue', 'problem', 'not received', 'late', 'delay'],
    response: 'We\'re sorry to hear that. Please reach out to us immediately:\n• **Phone**: +91 70131 78382\n• **Email**: info@stockkeyinvestments.in\n\nOur support team will resolve your issue within 24 hours.' },

  // ── Comparison ──
  { keywords: ['compare', 'better', 'best', 'which plan', 'recommend'],
    response: 'Here\'s a quick comparison:\n\n| Plan | Investment | Monthly Return |\n|------|-----------|----------------|\n| Premium | ₹10L | ₹1,20,000 |\n| Standard | ₹5L | ₹60,000 |\n| Customised | ₹1L | ₹12,000 |\n\n**Recommendation**: If you can invest ₹10L, go Premium for maximum returns. For beginners, start with Customised.' },

  // ── Nifty / Market ──
  { keywords: ['nifty', 'sensex', 'market', 'stock market', 'share market'],
    response: 'Our portfolio includes market-linked instruments like NIFTYBEES and blue-chip stocks. While markets fluctuate, our diversified approach and experienced management help maintain consistent returns. Current market data is visible on our homepage ticker.' },

  // ── Default ──
  { keywords: [],
    response: 'I\'m not sure I understand that question. Here are some things I can help with:\n\n• Investment Plans & Pricing\n• Monthly Returns & Payouts\n• Insurance Products\n• How to Register\n• Documents Required\n• Payment Methods\n• Contact Information\n\nPlease ask about any of these topics!' },
]

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, '').trim()
}

function findResponse(input: string): string {
  const normalized = normalize(input)
  const words = normalized.split(/\s+/)

  // Score each rule
  let bestScore = 0
  let bestResponse = rules[rules.length - 1].response // default

  for (const rule of rules) {
    if (rule.keywords.length === 0) continue
    let score = 0
    for (const keyword of rule.keywords) {
      const kw = normalize(keyword)
      if (normalized.includes(kw)) {
        score += kw.split(' ').length // multi-word matches score higher
      } else {
        // Check individual word overlap
        for (const w of words) {
          if (kw.includes(w) && w.length > 2) score += 0.5
        }
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestResponse = rule.response
    }
  }

  return bestResponse
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function getBotResponse(userMessage: string): string {
  return findResponse(userMessage)
}

export function getWelcomeMessage(): ChatMessage {
  return {
    id: generateId(),
    role: 'assistant',
    text: 'Hello! I\'m the Stock Key assistant. Ask me anything about our investment plans, returns, insurance, registration, or anything else. How can I help you today?',
    timestamp: Date.now(),
  }
}
