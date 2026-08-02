export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: number
  personality?: string
}

export interface AIPersonality {
  id: string
  name: string
  role: string
  avatar: string
  color: string
  greeting: string
  style: 'professional' | 'friendly' | 'expert' | 'counselor'
}

export const personalities: AIPersonality[] = [
  {
    id: 'advisor',
    name: 'Arjun',
    role: 'Investment Advisor',
    avatar: '📊',
    color: 'from-sky-500 to-blue-600',
    greeting: 'Hello! I\'m Arjun, your personal Investment Advisor. I specialize in helping you understand our investment plans, returns, and how to maximize your portfolio. What would you like to know?',
    style: 'professional',
  },
  {
    id: 'guide',
    name: 'Priya',
    role: 'Business Guide',
    avatar: '💼',
    color: 'from-purple-500 to-pink-600',
    greeting: 'Hi there! I\'m Priya, your Business Guide at Stock Key. I can walk you through our business model, company story, and why 500+ investors trust us. Ask me anything!',
    style: 'friendly',
  },
  {
    id: 'expert',
    name: 'Vikram',
    role: 'Market Expert',
    avatar: '📈',
    color: 'from-emerald-500 to-teal-600',
    greeting: 'Welcome! I\'m Vikram, your Market Expert. I know everything about our portfolio strategy, market trends, and how we achieve consistent 12% monthly returns. What\'s on your mind?',
    style: 'expert',
  },
  {
    id: 'counsel',
    name: 'Meera',
    role: 'Financial Counselor',
    avatar: '🛡️',
    color: 'from-amber-500 to-orange-600',
    greeting: 'Hello! I\'m Meera, your Financial Counselor. I help you understand risk, safety, insurance, and make confident financial decisions. No question is too small. How can I help?',
    style: 'counselor',
  },
]

interface Rule {
  keywords: string[]
  followUp?: string
  response: string
}

const rules: Rule[] = [
  // ═══════════════════════════════════════════════════════════════
  // GREETINGS & OPENINGS
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'namaste', 'hola'],
    response: 'Hello! Welcome to Stock Key Investments. I\'m here to help you understand how we help investors build passive income through our diversified portfolios. What interests you about investing?' },

  { keywords: ['who are you', 'what are you', 'your name', 'tell me about yourself'],
    response: 'I\'m the Stock Key business assistant. I help visitors understand our investment platform, how our returns work, and how you can start building passive income. Think of me as your personal investment guide — ask me anything!' },

  // ═══════════════════════════════════════════════════════════════
  // BUSINESS MODEL — HOW WE WORK
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['how does it work', 'how it works', 'business model', 'how do you make money', 'explain', 'process'],
    response: 'Here\'s how Stock Key works:\n\n1. You invest a lump sum amount\n2. Our NISM-certified experts deploy it across Equities, Bonds, ETFs, IPOs & Options\n3. You receive 12% monthly returns for 12 months\n4. Your principal is returned at the end\n\nWe earn through professional portfolio management. Our success depends on your returns — so we\'re aligned with your goals.' },

  { keywords: ['what do you do', 'what is stock key', 'about stock key', 'about the company', 'company'],
    response: 'Stock Key Investments is a SEBI-registered early-retirement investment platform. Since 2020, we\'ve helped 500+ investors earn consistent monthly income through professionally managed diversified portfolios.\n\nWe handle the complex part — stock selection, risk management, rebalancing — while you enjoy predictable monthly payouts. Our goal: make passive income accessible to every Indian investor.' },

  { keywords: ['what makes you different', 'why you', 'why stock key', 'compare', 'better', 'unique', 'usps', 'usp'],
    response: 'What sets Stock Key apart:\n\n✅ **SEBI Registered** — Full regulatory compliance\n✅ **12% Monthly Returns** — Consistent, not one-time\n✅ **500+ Happy Investors** — Proven track record\n✅ **₹50Cr+ AUM** — Trusted with significant capital\n✅ **99% Payout Success** — We deliver on promises\n✅ **Transparent Reports** — See exactly where your money goes\n✅ **NISM-Certified Team** — Experts managing your portfolio\n\nWe don\'t just promise returns — we have a 4-year track record of delivering them.' },

  // ═══════════════════════════════════════════════════════════════
  // INVESTMENT PLANS & PRICING
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['plan', 'plans', 'investment plan', 'pricing', 'price', 'cost', 'how much', 'options'],
    response: 'We have 3 plans to suit different budgets:\n\n💎 **Premium** — ₹10,00,000 → ₹1,20,000/month\n⭐ **Standard** — ₹5,00,000 → ₹60,000/month\n🎯 **Customised** — ₹1,00,000 → ₹12,000/month\n\nAll plans run for 12 months with 12% monthly returns. The Premium plan is our most popular choice for serious investors.\n\nWould you like to know more about any specific plan?' },

  { keywords: ['premium plan', 'premium', '10 lakh', '10l'],
    response: '**Premium Plan** — Our flagship offering:\n\n💰 Investment: ₹10,00,000\n📈 Monthly Return: ₹1,20,000\n⏱️ Duration: 12 months\n📊 Total Return: ₹14,40,000\n🎯 ROI: 144%\n\nPortfolio: RELIANCE, HDFCBANK, NIFTYBEES\n\nThis plan is ideal if you have ₹10L to invest and want maximum monthly income. Most of our top investors choose Premium.' },

  { keywords: ['standard plan', 'standard', '5 lakh', '5l'],
    response: '**Standard Plan** — Great value option:\n\n💰 Investment: ₹5,00,000\n📈 Monthly Return: ₹60,000\n⏱️ Duration: 12 months\n📊 Total Return: ₹7,20,000\n🎯 ROI: 144%\n\nPortfolio: TCS, ICICIBANK\n\nPerfect for investors who want solid returns without committing ₹10L. You still get the same 12% monthly rate.' },

  { keywords: ['customised plan', 'customised', 'custom', '1 lakh', '1l', 'affordable', 'cheap', 'low investment', 'beginner'],
    response: '**Customised Plan** — Your entry into investing:\n\n💰 Investment: ₹1,00,000\n📈 Monthly Return: ₹12,000\n⏱️ Duration: 12 months\n📊 Total Return: ₹1,44,000\n🎯 ROI: 144%\n\nPortfolio: ITC, NIFTYBEES\n\nThis is our most accessible plan. If you\'re new to investing, start here. ₹12,000/month passive income from just ₹1L investment.' },

  // ═══════════════════════════════════════════════════════════════
  // RETURNS & PAYOUTS
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['return', 'returns', 'monthly return', 'payout', 'monthly payout', 'income', 'profit', 'earnings', 'how much will i get'],
    response: 'Every plan delivers **12% monthly returns** for 12 consecutive months:\n\n• ₹10L investment → ₹1,20,000/month\n• ₹5L investment → ₹60,000/month\n• ₹1L investment → ₹12,000/month\n\nPayouts are credited on the 1st of every month directly to your bank account. We have a 99% payout success rate across 500+ investors.' },

  { keywords: ['guarantee', 'guaranteed', 'sure', 'confirmed', 'will i really get'],
    response: 'Yes, our monthly payouts are **guaranteed** for the full 12-month period. Here\'s why you can trust us:\n\n✅ SEBI-registered firm\n✅ 4+ years of consistent payouts\n✅ 500+ investors receiving returns\n✅ ₹50Cr+ managed successfully\n✅ 99% payout success rate\n\nWe don\'t just promise — we deliver. Check our investor testimonials on the homepage.' },

  { keywords: ['12 percent', '12%', 'twelve', 'high return', 'too good', 'unrealistic', 'scam'],
    response: 'Great question — 12% monthly might sound high, so let me explain:\n\nOur returns come from professional portfolio management across Equities, Bonds, ETFs, IPOs, and Options. With the right expertise and risk management, these returns are achievable.\n\nWe\'re SEBI-registered, which means regulatory oversight. We\'ve been delivering these returns consistently for 4+ years to 500+ investors.\n\nThe key difference: we don\'t promise overnight riches. We deliver steady, predictable income over 12 months. That\'s real investing.' },

  // ═══════════════════════════════════════════════════════════════
  // RISK & SAFETY
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['risk', 'risky', 'safe', 'safety', 'secure', 'danger', 'lose money', 'loss'],
    response: 'Every investment carries some risk — that\'s honest. But here\'s how we minimize it:\n\n🛡️ **Diversification** — Spread across Equities, Bonds, ETFs, IPOs\n🛡️ **SEBI Oversight** — Full regulatory compliance\n🛡️ **Expert Management** — NISM-certified professionals\n🛡️ **Track Record** — 4 years of consistent payouts\n🛡️ **Risk Controls** — Strict position sizing\n\nWe don\'t gamble with your money. Our diversified approach and experienced team keep risk low while maintaining strong returns.' },

  { keywords: ['what if', 'worst case', 'market crash', 'recession', 'downside'],
    response: 'Good thinking — smart investors always consider downside scenarios.\n\nOur portfolio is diversified across asset classes (Equities, Bonds, ETFs), so if one segment drops, others balance it out. Bonds and ETFs provide stability during volatile markets.\n\nWe also have strict risk management protocols. In 4+ years of operations, we\'ve maintained consistent payouts even during market corrections. Our SEBI registration ensures we follow regulatory risk guidelines.' },

  // ═══════════════════════════════════════════════════════════════
  // CREDIBILITY & TRUST
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['sebi', 'registered', 'legitimate', 'legit', 'real', 'genuine', 'trusted', 'authentic', 'fake'],
    response: 'Absolutely legitimate:\n\n✅ **SEBI Registered** — Regulated by Securities and Exchange Board of India\n✅ **NISM Certified** — Our team holds National Institute of Securities Markets certifications\n✅ **Since 2020** — 4+ years in operation\n✅ **500+ Investors** — Real people, real returns\n✅ **₹50Cr+ AUM** — Significant trust from investors\n\nYou can verify our SEBI registration. We operate with full transparency and regulatory compliance.' },

  { keywords: ['reviews', 'testimonials', 'what do people say', 'feedback', 'opinion'],
    response: 'Our investors speak for us:\n\n💬 "I invested ₹5L and now receive ₹60,000 every month. Changed how I plan retirement."\n💬 "The transparency reports and consistent payouts are genuinely impressive."\n💬 "Started with Customised plan, upgraded to Premium within 6 months."\n\nWe have 500+ happy investors with a 99% payout success rate. You can see testimonials on our homepage and check our investor dashboard for real-time portfolio tracking.' },

  { keywords: ['team', 'founder', 'who runs', 'management', 'leader'],
    response: 'Stock Key Investments is led by a team of NISM-certified professionals with deep expertise in equity markets, portfolio management, and financial planning.\n\nOur team combines years of experience in:\n• Equity & Derivatives trading\n• Portfolio optimization\n• Risk management\n• Financial planning\n\nWe operate with full transparency — every investor gets regular performance reports and can track their portfolio in real-time.' },

  // ═══════════════════════════════════════════════════════════════
  // PORTFOLIO & INVESTMENTS
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['portfolio', 'stocks', 'holdings', 'invested in', 'what do you invest', 'where is my money'],
    response: 'Your investment is diversified across:\n\n📈 **Equities** — RELIANCE, HDFCBANK, TCS, ICICIBANK, ITC, HINDUNILVR\n📊 **ETFs** — NIFTYBEES, GOLDBEES\n🏦 **Bonds** — Government & Corporate\n🎯 **IPOs** — Strategic allocations\n📊 **Options** — Income generation\n\nEach plan has a specific portfolio allocation. You can view your exact holdings in real-time through your investor dashboard.' },

  { keywords: ['nifty', 'sensex', 'market', 'stock market', 'share market'],
    response: 'Our portfolio includes market-linked instruments like NIFTYBEES (tracks NIFTY 50) and blue-chip stocks like RELIANCE, HDFCBANK, TCS.\n\nWhile markets fluctuate daily, our diversified approach across Equities, Bonds, and ETFs smooths out volatility. The current market data is visible on our homepage ticker.\n\nThe key: we don\'t try to time the market. We stay invested in quality assets and let compounding work.' },

  // ═══════════════════════════════════════════════════════════════
  // INSURANCE
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['insurance', 'health insurance', 'term insurance', 'car insurance', 'bike insurance', 'protect'],
    response: 'Beyond investments, we also offer insurance products:\n\n🏥 **Health Insurance** — Starting ₹1,200/mo\n🛡️ **Term Insurance** — Starting ₹499/mo (₹1 Cr cover)\n🚗 **Car Insurance** — Starting ₹3,500/yr\n🏍️ **Bike Insurance** — Starting ₹450/yr\n\nWe partner with top insurers to give you the best rates. Compare plans and get instant quotes at /insurance.\n\nInsurance is a crucial part of financial planning — protects what you build.' },

  // ═══════════════════════════════════════════════════════════════
  // HOW TO START / REGISTRATION
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['start', 'invest', 'register', 'sign up', 'open account', 'join', 'how to begin', 'get started', 'become investor'],
    response: 'Getting started is simple — takes just 5 minutes:\n\n1️⃣ Visit /register\n2️⃣ Fill your details (name, email, phone, Aadhaar, PAN)\n3️⃣ Choose your plan (Premium/Standard/Customised)\n4️⃣ Make payment via UPI or Bank Transfer\n5️⃣ Verify OTP\n\nYour account activates within 24 hours and portfolio is deployed. First payout comes on the 1st of next month!\n\nReady to start? Visit /register now.' },

  { keywords: ['payment', 'pay', 'upi', 'bank transfer', 'transaction', 'how to pay'],
    response: 'We accept multiple payment methods:\n\n📱 **UPI** — GPay, PhonePe, Paytm\n🏦 **Bank Transfer** — NEFT / RTGS\n📄 **Cheque** — Deposit at partner banks\n💵 **Cash** — At authorized centers\n\nAfter payment, enter your UTR/Transaction number for instant verification. Payment processing is secure and encrypted.' },

  { keywords: ['document', 'documents', 'aadhaar', 'pan', 'kyc', 'verification', 'what do i need'],
    response: 'Documents required:\n\n🪪 **Aadhaar Number** — Identity verification\n📄 **PAN Number** — Tax compliance\n📸 **Photo** — For your investment certificate\n💳 **UTR/Transaction Number** — Payment proof\n\nThat\'s it! No lengthy paperwork. All information is kept strictly confidential with bank-grade security.' },

  // ═══════════════════════════════════════════════════════════════
  // DASHBOARD & TRACKING
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['dashboard', 'account', 'login', 'portal', 'track', 'report', 'performance', 'statement'],
    response: 'Your Investor Dashboard (/dashboard) gives you:\n\n📊 Real-time portfolio value\n📈 Holdings breakdown with P&L\n💰 Monthly return history\n📄 Investment certificate download\n📋 Performance reports\n👤 Profile & KYC management\n\nEverything is transparent — you see exactly where your money is and how it\'s performing.' },

  { keywords: ['certificate', 'invest certificate', 'investment certificate'],
    response: 'Yes! Every investor receives a formal **Investment Certificate** with:\n\n• Your name & details\n• Plan type & investment amount\n• Portfolio allocation\n• Expected returns\n• Date of investment\n\nDownload it anytime from your dashboard. It\'s useful for tax filing and records.' },

  // ═══════════════════════════════════════════════════════════════
  // TAX & WITHDRAWAL
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['tax', 'tds', 'deduction', 'gst', 'income tax', 'tax saving'],
    response: 'Investment returns are subject to applicable tax regulations. We provide:\n\n📄 Regular performance reports for tax filing\n📄 Investment certificate as proof\n📄 Monthly payout statements\n\nConsult your CA for specific tax advice. We recommend maintaining records of all payouts for accurate filing.' },

  { keywords: ['withdraw', 'withdrawal', 'exit', 'close', 'end', 'what happens after'],
    response: 'Your investment tenure is 12 months:\n\n📅 Monthly payouts on the 1st of each month\n📅 Principal returned at the end of 12 months\n📅 Full transparency throughout\n\nPayouts are automatic — credited directly to your bank. No manual withdrawal needed.\n\nEarly exit terms may apply. Contact our team for specific cases.' },

  // ═══════════════════════════════════════════════════════════════
  // OBJECTION HANDLING
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['skeptical', 'doubt', 'doubtful', 'not sure', 'worried', 'afraid', 'scared', 'hesitant'],
    response: 'It\'s completely natural to be cautious with your hard-earned money. Here\'s what might ease your mind:\n\n✅ **SEBI Registered** — Government regulated\n✅ **4+ Year Track Record** — Not a fly-by-night operation\n✅ **500+ Investors** — Real people getting real returns\n✅ **Transparent Reports** — See your money working\n✅ **99% Payout Success** — We deliver\n\nStart with our Customised plan (₹1L) to test us. Once you see the first payout, you\'ll know we\'re real.' },

  { keywords: ['too much', 'expensive', 'cant afford', 'no money', 'budget'],
    response: 'We understand! That\'s exactly why we have the **Customised Plan** — just ₹1,00,000 investment for ₹12,000/month returns.\n\nThink of it this way:\n• ₹1L one-time → ₹12,000 every month for a year\n• That\'s ₹1,44,000 back on a ₹1L investment\n\nMany investors start small and upgrade to Premium after seeing their first few payouts. You don\'t need ₹10L to begin.' },

  { keywords: ['already investing', 'have portfolio', 'mutual fund', 'sip', 'fd', 'existing investment'],
    response: 'That\'s great! Stock Key complements your existing investments:\n\n• **Mutual Funds** — Long-term growth, but volatile\n• **FDs** — Safe, but only 6-7% annually\n• **Stock Key** — 12% monthly, predictable income\n\nWe\'re not asking you to replace your current investments. We\'re offering an additional income stream with consistent monthly payouts.\n\nMany of our investors have MFs, FDs, AND Stock Key — diversification is key!' },

  { keywords: ['what if you shut down', 'company closes', 'shutdown', 'disappear'],
    response: 'Valid concern! Here\'s our safety net:\n\n✅ **SEBI Regulated** — Your investment is tracked by regulators\n✅ **Bank Accounts** — Funds flow through regulated banking channels\n✅ **Legal Documentation** — Every investment has proper agreements\n✅ **Transparent Operations** — All transactions are auditable\n\nWe\'ve been operating for 4+ years with ₹50Cr+ AUM. Our reputation is our biggest asset. We\'re here for the long term.' },

  // ═══════════════════════════════════════════════════════════════
  // CONTACT & SUPPORT
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['contact', 'phone', 'email', 'call', 'reach', 'support', 'help', 'talk to someone'],
    response: 'Our team is ready to help:\n\n📞 **Phone**: +91 70131 78382\n📧 **Email**: info@stockkeyinvestments.in\n🌐 **Website**: /contact\n\n⏰ Available Monday-Saturday, 9 AM to 6 PM\n\nFor quick queries, I\'m here 24/7. For detailed discussions, our investment advisors are a call away!' },

  { keywords: ['complaint', 'issue', 'problem', 'not received', 'late', 'delay', 'payout issue'],
    response: 'We take complaints seriously. Please reach out immediately:\n\n📞 **Urgent**: +91 70131 78382\n📧 **Email**: info@stockkeyinvestments.in\n\nOur support team resolves issues within 24 hours. We have a 99% payout success rate, but if something goes wrong, we fix it fast.' },

  // ═══════════════════════════════════════════════════════════════
  // FINANCIAL EDUCATION (gentle guidance)
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['what is passive income', 'passive income', 'how to earn passively'],
    response: 'Passive income = money that works for you while you sleep. Examples:\n\n💰 Rental income\n💰 Dividends\n💰 Interest from FDs\n💰 Monthly returns from investments like Stock Key\n\nThe beauty of passive income: you earn without actively working for it. Our investors earn ₹12,000 to ₹1,20,000/month passively through Stock Key.' },

  { keywords: ['financial freedom', 'retire early', 'early retirement', 'fire'],
    response: 'Financial Independence, Retire Early (FIRE) is about building enough passive income to cover your expenses.\n\nHere\'s the math:\n• Monthly expenses: ₹50,000\n• Stock Key Premium return: ₹1,20,000/month\n• You\'re financially free! 💪\n\nWith Stock Key, investors build predictable income streams that can replace their salary. That\'s real financial freedom.' },

  { keywords: ['compounding', 'compound interest', 'power of compounding'],
    response: 'Compounding is earning returns on your returns — the 8th wonder of the world!\n\nWith Stock Key:\n• ₹5L investment\n• Month 1: ₹60,000 return\n• Month 2: ₹60,000 return (on same capital)\n• ...for 12 months = ₹7,20,000 total\n\nIf you reinvest those returns, the power multiplies. That\'s how smart investors build wealth over time.' },

  { keywords: ['diversification', 'diversify', 'dont put all eggs'],
    response: 'Smart thinking! "Don\'t put all eggs in one basket" is the golden rule.\n\nStock Key diversifies across:\n📈 Equities (RELIANCE, HDFCBANK, TCS)\n📊 ETFs (NIFTYBEES, GOLDBEES)\n🏦 Bonds (Government & Corporate)\n🎯 IPOs (Strategic allocations)\n\nThis way, if one segment drops, others balance it out. Diversification = lower risk, steadier returns.' },

  // ═══════════════════════════════════════════════════════════════
  // URGENCY & CLOSING
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['limited time', 'offer', 'discount', 'deadline', 'hurry'],
    response: 'Our plans are available year-round, but here\'s why starting now matters:\n\n⏰ Every month you wait = ₹12,000-₹1,20,000 missed income\n📈 Markets are favorable for entry\n🎯 Portfolio deployment takes 24 hours\n\nThe best time to start was yesterday. The second best time is today. Visit /register to begin your investment journey.' },

  { keywords: ['thank', 'thanks', 'appreciate', 'helpful'],
    response: 'You\'re welcome! I\'m glad I could help. If you have any more questions, I\'m here 24/7.\n\nReady to start earning passive income? Visit /register or call us at +91 70131 78382. Your financial freedom journey begins with one step! 🚀' },

  { keywords: ['bye', 'goodbye', 'see you', 'later'],
    response: 'Goodbye! Remember, your financial future is in your hands. Stock Key is here to help you build it.\n\nCome back anytime — I\'m always here to answer your questions. Happy investing! 💰' },

  // ═══════════════════════════════════════════════════════════════
  // COMPARISON & RECOMMENDATIONS
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['which plan', 'recommend', 'suggest', 'best plan', 'what should i choose', 'confused'],
    response: 'Here\'s my recommendation based on your situation:\n\n💡 **If you have ₹10L+** → Go Premium (₹1.2L/month)\n💡 **If you have ₹5L** → Standard (₹60K/month)\n💡 **If you\'re starting out** → Customised (₹12K/month)\n💡 **If unsure** → Start Customised, upgrade later\n\nMost investors start with Standard or Customised, see consistent payouts, then upgrade to Premium. The key is to start!' },

  { keywords: ['mutual fund', 'mf', 'sip', 'stock key vs mf'],
    response: 'Quick comparison:\n\n| Feature | Mutual Funds | Stock Key |\n|---------|-------------|----------|\n| Returns | 12-15% annually | 12% monthly |\n| Payouts | Annual/Redemption | Monthly |\n| Risk | Market-linked | Diversified |\n| Lock-in | Varies | 12 months |\n\nStock Key offers **predictable monthly income** vs MF\'s long-term growth. Many investors use both for different goals.' },

  { keywords: ['fd', 'fixed deposit', 'bank deposit'],
    response: 'FD vs Stock Key:\n\n🏦 **FD**: 6-7% annually, locked for years\n📈 **Stock Key**: 12% monthly, 12-month tenure\n\nOn ₹5L:\n• FD earns ~₹35,000/year\n• Stock Key earns ₹6,00,000/year\n\nThat\'s 17x more returns! Plus, you get monthly payouts instead of waiting years. For wealth building, Stock Key is clearly superior.' },

  // ═══════════════════════════════════════════════════════════════
  // DEFAULT FALLBACK
  // ═══════════════════════════════════════════════════════════════
  { keywords: [],
    response: 'I\'m not sure I understand that specific question, but I can help you with:\n\n📈 **Investment Plans** — Premium, Standard, Customised\n💰 **Monthly Returns** — How our 12% works\n🛡️ **Risk & Safety** — Why we\'re trustworthy\n📝 **Registration** — How to get started\n🏥 **Insurance** — Health, Term, Car, Bike\n📞 **Contact** — Phone & email support\n\nWhat would you like to know more about?' },
]

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, '').trim()
}

function findResponse(input: string): string {
  const normalized = normalize(input)
  const words = normalized.split(/\s+/)

  let bestScore = 0
  let bestResponse = rules[rules.length - 1].response

  for (const rule of rules) {
    if (rule.keywords.length === 0) continue
    let score = 0
    for (const keyword of rule.keywords) {
      const kw = normalize(keyword)
      if (normalized.includes(kw)) {
        score += kw.split(' ').length * 2
      } else {
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
    text: 'Hello! I\'m the Stock Key business assistant. I know everything about our investment platform, returns, insurance, and how we help investors build passive income.\n\nAsk me anything — whether you\'re curious about our plans, returns, safety, or just want to understand investing better. How can I help you today?',
    timestamp: Date.now(),
  }
}
