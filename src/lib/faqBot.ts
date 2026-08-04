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
    response: 'Stock Key Investments is an early-retirement investment platform. Since 2020, we\'ve helped 500+ investors earn consistent monthly income through professionally managed diversified portfolios.\n\nWe handle the complex part — stock selection, risk management, rebalancing — while you enjoy predictable monthly payouts. Our goal: make passive income accessible to every Indian investor.' },

  { keywords: ['what makes you different', 'why you', 'why stock key', 'compare', 'better', 'unique', 'usps', 'usp'],
    response: 'What sets Stock Key apart:\n\n✅ **NISM Certified** — Full regulatory compliance\n✅ **12% Monthly Returns** — Consistent, not one-time\n✅ **500+ Happy Investors** — Proven track record\n✅ **₹50Cr+ AUM** — Trusted with significant capital\n✅ **99% Payout Success** — We deliver on promises\n✅ **Transparent Reports** — See exactly where your money goes\n✅ **NISM-Certified Team** — Experts managing your portfolio\n\nWe don\'t just promise returns — we have a 4-year track record of delivering them.' },

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
    response: 'Yes, our monthly payouts are **guaranteed** for the full 12-month period. Here\'s why you can trust us:\n\n✅ NISM-certified firm\n✅ 4+ years of consistent payouts\n✅ 500+ investors receiving returns\n✅ ₹50Cr+ managed successfully\n✅ 99% payout success rate\n\nWe don\'t just promise — we deliver. Check our investor testimonials on the homepage.' },

  { keywords: ['12 percent', '12%', 'twelve', 'high return', 'too good', 'unrealistic', 'scam'],
    response: 'Great question — 12% monthly might sound high, so let me explain:\n\nOur returns come from professional portfolio management across Equities, Bonds, ETFs, IPOs, and Options. With the right expertise and risk management, these returns are achievable.\n\nWe\'re NISM-certified, which means regulatory oversight. We\'ve been delivering these returns consistently for 4+ years to 500+ investors.\n\nThe key difference: we don\'t promise overnight riches. We deliver steady, predictable income over 12 months. That\'s real investing.' },

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
    response: 'Absolutely legitimate:\n\n✅ **NISM Certified** — Our team holds National Institute of Securities Markets certifications\n✅ **Since 2020** — 4+ years in operation\n✅ **500+ Investors** — Real people, real returns\n✅ **₹50Cr+ AUM** — Significant trust from investors\n\nWe operate with full transparency and regulatory compliance.' },

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
    response: 'It\'s completely natural to be cautious with your hard-earned money. Here\'s what might ease your mind:\n\n✅ **NISM Certified** — Professional team\n✅ **4+ Year Track Record** — Not a fly-by-night operation\n✅ **500+ Investors** — Real people getting real returns\n✅ **Transparent Reports** — See your money working\n✅ **99% Payout Success** — We deliver\n\nStart with our Customised plan (₹1L) to test us. Once you see the first payout, you\'ll know we\'re real.' },

  { keywords: ['too much', 'expensive', 'cant afford', 'no money', 'budget'],
    response: 'We understand! That\'s exactly why we have the **Customised Plan** — just ₹1,00,000 investment for ₹12,000/month returns.\n\nThink of it this way:\n• ₹1L one-time → ₹12,000 every month for a year\n• That\'s ₹1,44,000 back on a ₹1L investment\n\nMany investors start small and upgrade to Premium after seeing their first few payouts. You don\'t need ₹10L to begin.' },

  { keywords: ['already investing', 'have portfolio', 'mutual fund', 'sip', 'fd', 'existing investment'],
    response: 'That\'s great! Stock Key complements your existing investments:\n\n• **Mutual Funds** — Long-term growth, but volatile\n• **FDs** — Safe, but only 6-7% annually\n• **Stock Key** — 12% monthly, predictable income\n\nWe\'re not asking you to replace your current investments. We\'re offering an additional income stream with consistent monthly payouts.\n\nMany of our investors have MFs, FDs, AND Stock Key — diversification is key!' },

  { keywords: ['what if you shut down', 'company closes', 'shutdown', 'disappear'],
    response: 'Valid concern! Here\'s our safety net:\n\n✅ **Regulated** — Your investment is tracked by regulators\n✅ **Bank Accounts** — Funds flow through regulated banking channels\n✅ **Legal Documentation** — Every investment has proper agreements\n✅ **Transparent Operations** — All transactions are auditable\n\nWe\'ve been operating for 4+ years with ₹50Cr+ AUM. Our reputation is our biggest asset. We\'re here for the long term.' },

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
  // STOCK MARKET — COMPREHENSIVE KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════
  { keywords: ['what is nifty', 'nifty 50', 'nifty50', 'explain nifty', 'about nifty'],
    response: 'NIFTY 50 is India\'s benchmark stock market index. It represents the top 50 companies listed on the National Stock Exchange (NSE).\n\nKey facts:\n📈 Tracks 50 blue-chip companies across 13 sectors\n📊 Includes RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK\n🌍 Reflects overall Indian market performance\n💰 Used by ETFs like NIFTYBEES for passive investing\n\nNIFTY is currently around 24,500 levels. When people say "the market is up," they usually mean NIFTY is rising. It\'s the most-watched indicator of India\'s economic health.' },

  { keywords: ['what is sensex', 'sensex', 'bse', 'bombay stock exchange', 'explain sensex'],
    response: 'SENSEX (Sensitive Index) is the benchmark index of the Bombay Stock Exchange (BSE). It tracks 30 of the largest and most actively traded companies.\n\nKey facts:\n📈 30 blue-chip companies on BSE\n📊 Older than NIFTY — started in 1986\n💰 Current level around 80,000+\n🌍 Along with NIFTY, it indicates market direction\n\nSENSEX and NIFTY usually move together. If both are green, the market is bullish. If both are red, it\'s a bearish day. Our portfolio includes stocks from both exchanges.' },

  { keywords: ['stock market', 'share market', 'how stock market works', 'explain stock market', 'stock market basics'],
    response: 'The stock market is where companies sell shares to raise money, and investors buy those shares to earn profits.\n\nHow it works:\n1️⃣ Company lists on NSE/BSE through IPO\n2️⃣ Investors buy shares at market price\n3️⃣ Price moves based on demand & supply\n4️⃣ Investors earn through price appreciation + dividends\n\nKey concepts:\n📈 Bull market = prices rising\n📉 Bear market = prices falling\n💰 Dividend = profit share from company\n🏢 Blue-chip = large, stable companies\n\nAt Stock Key, we invest in quality stocks and manage the complexity for you.' },

  { keywords: ['bull market', 'bear market', 'bull vs bear', 'market trend'],
    response: 'Bull Market vs Bear Market:\n\n🟢 **Bull Market** — Prices are rising, investor sentiment is positive, economy is growing. Best time to stay invested.\n\n🔴 **Bear Market** — Prices are falling, fear is high, people sell in panic. Smart investors buy quality stocks at discounts.\n\nHistorical pattern:\n• Markets recover after every crash\n• NIFTY has given ~12% CAGR over 20 years\n• Time IN the market beats timing the market\n\nOur strategy: we stay invested through both cycles, using diversification to manage risk.' },

  { keywords: ['ipo', 'initial public offering', 'what is ipo', 'how ipo works'],
    response: 'IPO (Initial Public Offering) is when a private company first sells its shares to the public.\n\nHow it works:\n1️⃣ Company files DRHP with SEBI\n2️⃣ Sets price band (e.g., ₹300-320 per share)\n3️⃣ Investors apply during the open period\n4️⃣ Shares are allotted based on demand\n5️⃣ Stock lists on NSE/BSE\n\nIPO investing tips:\n✅ Check company\'s financials and promoter background\n✅ Look at GMP (Grey Market Premium) for sentiment\n✅ Don\'t put all money in one IPO\n✅ Have a long-term view\n\nWe include strategic IPO allocations in our portfolio for extra returns.' },

  { keywords: ['etf', 'exchange traded fund', 'what is etf', 'explain etf'],
    response: 'ETFs (Exchange Traded Funds) are baskets of stocks that trade like regular shares on the stock exchange.\n\nPopular ETFs:\n📈 NIFTYBEES — Tracks NIFTY 50 (top 50 companies)\n📊 BANKBEES — Tracks Nifty Bank index\n💰 GOLDBEES — Tracks gold price\n🛢️ CRUDEBEES — Tracks crude oil\n\nBenefits:\n✅ Diversification in one buy\n✅ Lower fees than mutual funds\n✅ Can be bought/sold anytime during market hours\n✅ Transparent — you know exactly what you hold\n\nWe use NIFTYBEES and GOLDBEES in our portfolio for stable diversification.' },

  { keywords: ['blue chip', 'blue chip stocks', 'bluechip', 'large cap'],
    response: 'Blue-chip stocks are shares of large, well-established, financially stable companies with a proven track record.\n\nIndian Blue-Chips:\n🏢 RELIANCE — Conglomerate (Oil, Retail, Telecom)\n🏦 HDFCBANK — Largest private bank\n💻 TCS — IT services giant\n🏦 ICICIBANK — Major private bank\n🏠 INFY (Infosys) — IT services\n🧴 HINDUNILVR — FMCG leader\n\nWhy invest in blue-chips:\n✅ Less volatile than small-caps\n✅ Regular dividends\n✅ Strong fundamentals\n✅ Survive market downturns\n\nOur portfolio heavily weights blue-chips for stability and consistent returns.' },

  { keywords: ['dividend', 'dividend stocks', 'dividend income', 'dividend yield'],
    response: 'Dividends are a portion of a company\'s profits paid to shareholders, usually quarterly.\n\nHigh dividend-paying Indian stocks:\n💰 ITC — ~3-4% yield\n🏦 Coal India — ~5-6% yield\n⛽ ONGC — ~4-5% yield\n🏦 Power Finance Corp — ~7-8% yield\n\nWhy dividends matter:\n✅ Regular passive income\n✅ Signals company profitability\n✅ Tax-efficient in some cases\n✅ Reinvest for compounding\n\nStock Key strategy: we invest in stocks that offer both capital appreciation AND dividends, maximizing total returns.' },

  { keywords: ['technical analysis', 'charts', 'support resistance', 'moving average', 'rsi', 'indicators'],
    response: 'Technical analysis studies price charts to predict future movements.\n\nKey concepts:\n📊 **Support** — Price level where stock tends to bounce back up\n📊 **Resistance** — Price level where stock tends to fall back\n📈 **Moving Average** — Average price over a period (50-day, 200-day)\n📊 **RSI** — Relative Strength Index (above 70 = overbought, below 30 = oversold)\n📈 **Volume** — Number of shares traded (high volume = strong move)\n\nTrading strategies:\n• Buy near support, sell near resistance\n• Golden Cross (50-day crosses above 200-day) = bullish\n• Death Cross (50-day crosses below 200-day) = bearish\n\nWe use technical analysis for entry/exit timing in our active management.' },

  { keywords: ['fundamental analysis', 'pe ratio', 'price to earning', 'eps', 'book value', 'fundamental'],
    response: 'Fundamental analysis evaluates a company\'s financial health to determine if its stock is fairly priced.\n\nKey metrics:\n📊 **P/E Ratio** — Price ÷ Earnings (lower = cheaper)\n📊 **EPS** — Earnings Per Share (higher = more profitable)\n📊 **Book Value** — Net asset value per share\n📊 **Debt-to-Equity** — Lower is better\n📊 **ROE** — Return on Equity (higher = better management)\n\nExample:\n• Stock A: P/E = 15, EPS = ₹50 → Good value\n• Stock B: P/E = 50, EPS = ₹10 → Expensive\n\nWe combine fundamental and technical analysis for smart stock selection.' },

  { keywords: ['sector', 'sector analysis', 'which sector', 'best sector', 'sector rotation'],
    response: 'Indian stock market sectors and their outlook:\n\n💻 **IT** — TCS, INFY, WIPRO — Global demand driver\n🏦 **Banking** — HDFCBANK, ICICIBANK — Economic backbone\n🛢️ **Oil & Gas** — RELIANCE, ONGC — Energy plays\n🏠 **Real Estate** — DLF, Godrej — Housing boom\n📱 **Telecom** — JIO, Airtel — Data growth\n💊 **Pharma** — Sun Pharma, Dr Reddy\'s — Defensive\n🚗 **Auto** — Maruti, Tata Motors — EV transition\n🛒 **FMCG** — HUL, ITC — Consumer demand\n\nSector rotation: money moves from one sector to another. Our portfolio is diversified across all major sectors.' },

  { keywords: ['trading', 'intraday', 'day trading', 'swing trading', 'trading vs investing'],
    response: 'Trading vs Investing:\n\n⚡ **Trading** — Short-term buying/selling for quick profits\n• Intraday: Buy and sell same day\n• Swing: Hold for days/weeks\n• Higher risk, requires constant monitoring\n\n📊 **Investing** — Long-term wealth building\n• Hold for months/years\n• Benefit from compounding\n• Lower stress, better returns over time\n\nOur approach at Stock Key:\n✅ We INVEST, not trade\n✅ Focus on quality businesses\n✅ Hold through market cycles\n✅ Deliver consistent monthly returns\n\nTrading is a full-time job. Investing lets you earn while you live your life.' },

  { keywords: ['mutual fund', 'mutual funds', 'sip', 'what is sip', 'mf vs stock'],
    response: 'Mutual Funds pool money from many investors to buy a diversified portfolio.\n\nTypes:\n📊 **Equity MF** — Invests in stocks (higher returns, higher risk)\n🏦 **Debt MF** — Invests in bonds (lower returns, lower risk)\n📊 **Hybrid MF** — Mix of both\n💰 **Index MF** — Tracks NIFTY/SENSEX passively\n\nSIP (Systematic Investment Plan):\n• Invest fixed amount monthly (e.g., ₹5,000)\n• Rupee cost averaging reduces risk\n• Power of compounding over time\n\nStock Key vs MF:\n• MF: 12-15% annually, no monthly payout\n• Stock Key: 12% monthly, predictable income\n\nMany investors use both — MFs for growth, Stock Key for monthly income.' },

  { keywords: ['option', 'options', 'call option', 'put option', 'fno', 'derivatives'],
    response: 'Options are financial derivatives that give you the right (not obligation) to buy/sell at a set price.\n\nTypes:\n📈 **Call Option (CE)** — Right to BUY at strike price\n📉 **Put Option (PE)** — Right to SELL at strike price\n\nExample:\n• NIFTY at 24,500\n• Buy 24,600 Call → If NIFTY goes above 24,600, you profit\n• Buy 24,400 Put → If NIFTY falls below 24,400, you profit\n\nKey terms:\n📊 **Premium** — Cost of the option\n📊 **Strike Price** — Predetermined price\n📊 **Expiry** — Options expire weekly/monthly\n\nOptions are used for hedging and income generation. We use options strategically in our portfolio for enhanced returns.' },

  { keywords: ['reliance', 'reliance stock', 'reliance industries', 'mukesh ambani'],
    response: 'Reliance Industries (RELIANCE) is India\'s largest company by market cap.\n\nKey business segments:\n🛢️ **Oil to Chemicals (O2C)** — Traditional business\n📱 **JIO** — Telecom & Digital services\n🛒 **Retail** — Reliance Retail (largest retailer)\n☁️ **New Energy** — Solar, Hydrogen, EV\n\nStock facts:\n📈 Current price: ~₹2,900-3,000\n📊 Market Cap: ~₹20 Lakh Crore\n💰 Dividend yield: ~0.3%\n🏢 Promoter: Mukesh Ambani\n\nRELIANCE is a core holding in our portfolio — it\'s a conglomerate that touches every Indian\'s life.' },

  { keywords: ['tcs', 'tata consultancy', 'tata group', 'tcs stock'],
    response: 'TCS (Tata Consultancy Services) is India\'s largest IT services company.\n\nKey facts:\n💻 Revenue: ~₹2.5 Lakh Crore annually\n🌍 Clients: Global enterprises in 46 countries\n👥 Employees: 6+ Lakh\n📈 Stock price: ~₹3,800-4,000\n💰 Dividend: Regular dividend payer\n\nWhy TCS is important:\n✅ Market leader in IT services\n✅ Strong order book\n✅ Low debt, high cash flows\n✅ Part of trusted Tata Group\n\nTCS is a blue-chip staple in our portfolio — stable, profitable, and globally competitive.' },

  { keywords: ['hdfc bank', 'hdfcbank', 'hdfc', 'private bank'],
    response: 'HDFC Bank is India\'s largest private sector bank.\n\nKey facts:\n🏦 Total assets: ₹18+ Lakh Crore\n👥 Customers: 8+ Crore\n📈 Stock price: ~₹1,650-1,700\n💰 Dividend yield: ~1.2%\n🏆 Consistent profit growth for 25+ years\n\nWhy HDFC Bank:\n✅ Best-in-class asset quality\n✅ Strong digital banking platform\n✅ Pan-India presence\n✅ Trusted brand\n\nHDFC Bank is the backbone of our banking allocation — it\'s been a wealth creator for decades.' },

  { keywords: ['market today', 'market update', 'how is market', 'market status', 'stock market today'],
    response: 'I don\'t have real-time market data, but here\'s what to watch:\n\n📊 **NIFTY 50** — Benchmark index (check your broker app)\n📊 **SENSEX** — BSE benchmark\n📊 **India VIX** — Fear index (higher = more volatile)\n\nKey things to monitor:\n🌍 Global cues (US markets, Asian markets)\n🏛️ RBI policy decisions\n📊 FII/DII flows (foreign & domestic institutional investors)\n📰 Corporate earnings results\n🌍 Oil prices & USD/INR\n\nFor live data, visit our homepage ticker or check Moneycontrol / Economic Times.' },

  { keywords: ['how to buy stocks', 'how to invest in stocks', 'how to start investing', 'stock broker', 'demat account'],
    response: 'Steps to start investing in stocks:\n\n1️⃣ **Open Demat Account** — With Zerodha, Groww, Upstox, or Angel One\n2️⃣ **Complete KYC** — Aadhaar + PAN verification\n3️⃣ **Link Bank Account** — For fund transfers\n4️⃣ **Research Stocks** — Use fundamental + technical analysis\n5️⃣ **Start Small** — Begin with blue-chips or NIFTYBEES ETF\n\nTips for beginners:\n✅ Start with ₹5,000-10,000\n✅ Don\'t put all money at once (use SIP)\n✅ Stick to blue-chips initially\n✅ Don\'t follow tips blindly\n✅ Think long-term (3-5 years minimum)\n\nOr, let Stock Key manage it for you — we handle everything while you earn monthly returns!' },

  { keywords: ['recession', 'economic slowdown', 'gdp', 'inflation', 'interest rate'],
    response: 'Economic indicators that affect markets:\n\n📊 **GDP Growth** — Higher = bullish market\n📊 **Inflation (CPI)** — High inflation = rate hikes = bearish\n📊 **Interest Rates** — RBI repo rate affects borrowing costs\n📊 **Fiscal Deficit** — Government spending vs revenue\n\nCurrent environment:\n• India GDP growing at 6-7% annually\n• Inflation moderating around 4-5%\n• RBI holds rates steady\n• Strong domestic consumption\n\nDuring recessions:\n✅ Quality stocks recover first\n✅ Defensive sectors (Pharma, FMCG) outperform\n✅ Avoid panic selling\n✅ Stay invested for long-term growth' },

  { keywords: ['portfolio', 'asset allocation', 'how to build portfolio', 'portfolio strategy'],
    response: 'Smart portfolio building:\n\n📊 **Asset Allocation** — Divide between stocks, bonds, gold, cash\n\nRecommended split by age:\n• 20-30 years: 80% Equity, 15% Bonds, 5% Gold\n• 30-40 years: 70% Equity, 20% Bonds, 10% Gold\n• 40-50 years: 60% Equity, 30% Bonds, 10% Gold\n• 50+ years: 40% Equity, 40% Bonds, 20% Gold\n\nDiversification checklist:\n✅ Multiple sectors (IT, Banking, FMCG, Pharma)\n✅ Mix of large-cap, mid-cap\n✅ Include ETFs for index exposure\n✅ Add bonds for stability\n✅ Gold as inflation hedge\n\nStock Key gives you instant diversification across all these in one investment.' },

  { keywords: ['ipo listing', 'ipo gain', 'ipo profit', 'apply ipo', 'ipo allotment'],
    response: 'IPO investing — how to profit from new listings:\n\n📋 **Application process**:\n1️⃣ Check upcoming IPOs (Chittorgarh, Moneycontrol)\n2️⃣ Read DRHP (company\'s prospectus)\n3️⃣ Apply through your broker during open period\n4️⃣ Wait for allotment (lottery if oversubscribed)\n5️⃣ List and sell or hold\n\n💡 **Pro tips**:\n✅ Apply in multiple accounts for better allotment\n✅ Check GMP (Grey Market Premium) for listing gains\n✅ Strong IPOs: 20-50% listing gains\n✅ Long-term IPO investing can give 100%+ returns\n\nWe include IPO allocations in our portfolio strategy for enhanced returns.' },

  { keywords: ['gold', 'gold investment', 'gold price', 'gold etf', 'sovereign gold bond'],
    response: 'Gold as an investment:\n\n📊 **Ways to invest in gold**:\n💰 Physical Gold — Coins, bars, jewelry\n📊 Gold ETF — GOLDBEES on NSE\n📜 SGB (Sovereign Gold Bonds) — 2.5% annual interest + gold price gains\n📈 Gold Futures — For traders\n\nWhy gold:\n✅ Hedge against inflation\n✅ Safe haven during market crashes\n✅ Portfolio diversifier\n✅ No counterparty risk\n\nGold price in India: ~₹72,000 per 10 grams\n\nWe include GOLDBEES in our portfolio for stability during volatile markets.' },

  { keywords: ['rupee', 'usd inr', 'dollar', 'currency', 'forex'],
    response: 'USD/INR (Indian Rupee vs US Dollar):\n\n📊 Current rate: ~₹83-84 per dollar\n📈 Trend: Rupee has been depreciating long-term\n\nWhy it matters:\n🌍 IT stocks (TCS, INFY) benefit from weak rupee\n🛢️ Oil imports become expensive (oil is priced in $)\n💰 NRIs get more rupees for their dollars\n📊 RBI manages rupee stability\n\nImpact on investors:\n✅ Export-oriented companies benefit\n✅ FII outflows weaken rupee\n✅ Strong dollar = global uncertainty\n\nCurrency movements are factored into our portfolio strategy.' },

  { keywords: ['rbi', 'repo rate', 'monetary policy', 'central bank', 'interest rate hike'],
    response: 'RBI (Reserve Bank of India) manages monetary policy:\n\n📊 **Key rates**:\n💰 **Repo Rate** — Rate at which RBI lends to banks (~6.5%)\n💰 **Reverse Repo** — Rate at which RBI borrows from banks\n💰 **CRR** — Cash Reserve Ratio banks must maintain\n💰 **SLR** — Statutory Liquidity Ratio\n\nImpact on markets:\n📈 Rate cut → Cheaper loans → Bullish market\n📉 Rate hike → Expensive loans → Bearish market\n\nRBI meets every 2 months to review rates.\nCurrent stance: Withdrawal of accommodation (neutral)\n\nWe monitor RBI policy closely — it affects bond yields and equity valuations in our portfolio.' },

  { keywords: ['fii', 'dii', 'foreign institutional', 'domestic institutional', 'institutional investors'],
    response: 'FII and DII activity drives market movements:\n\n📊 **FII (Foreign Institutional Investors)** — Global funds investing in India\n📊 **DII (Domestic Institutional Investors)** — Indian mutual funds, insurance companies\n\nWhat their flows mean:\n📈 FII buying → Bullish signal → Market rises\n📉 FII selling → Bearish pressure → Market falls\n📈 DII buying → Supports market during FII selling\n\nRecent trends:\n• FIIs have been net buyers in 2024-25\n• DIIs consistently buying on dips\n• Strong domestic flows supporting market\n\nWe track FII/DII data to understand market direction and adjust our portfolio accordingly.' },

  { keywords: ['nifty beess', 'niftybees', 'bankbees', 'goldbees', 'bees etf'],
    response: 'BEES (Benchmark Exchange Traded Schemes) are popular ETFs:\n\n📊 **NIFTYBEES** — Tracks NIFTY 50\n📊 **BANKBEES** — Tracks Nifty Bank\n📊 **GOLDBEES** — Tracks gold price\n📊 **JUNIORBEES** — Tracks NIFTY Next 50\n📊 **MIDCAPBEES** — Tracks NIFTY Midcap 100\n\nWhy BEES:\n✅ Low expense ratio (~0.1%)\n✅ Diversification in one buy\n✅ Can be bought anytime during market hours\n✅ Transparent — daily disclosure of holdings\n\nNIFTYBEES is our core holding — it gives instant exposure to India\'s top 50 companies.' },

  { keywords: ['long term', 'short term', 'long term investing', 'short term trading', 'investment horizon'],
    response: 'Investment horizon matters:\n\n📅 **Short-term** (< 1 year):\n• Trading, arbitrage, debt funds\n• Higher risk, quick returns\n• Taxed at higher rates\n\n📅 **Medium-term** (1-3 years):\n• Balanced approach\n• Mix of equity and debt\n• Moderate risk\n\n📅 **Long-term** (3+ years):\n• Equity-focused\n• Power of compounding\n• Best tax efficiency\n• Historical 12%+ CAGR\n\nStock Key approach:\n✅ 12-month investment tenure\n✅ Monthly payouts for income\n✅ Capital preservation + growth\n✅ Perfect for medium-term goals\n\nLong-term investing creates wealth. Short-term trading often destroys it.' },

  { keywords: ['tax', 'capital gains', 'ltcg', 'stcg', 'stock market tax', 'tax on stocks'],
    response: 'Tax on stock market profits:\n\n📊 **STCG (Short Term Capital Gains)** — Sold within 12 months\n• Tax rate: 20%\n\n📊 **LTCG (Long Term Capital Gains)** — Sold after 12 months\n• Tax rate: 12.5% on gains above ₹1.25 Lakh\n\n📊 **Dividend Tax** — Taxed at your income slab rate\n\n📊 **STT (Securities Transaction Tax)** — 0.1% on sell side\n\nTax-saving tips:\n✅ Hold for 1 year+ for lower LTCG tax\n✅ Harvest losses to offset gains\n✅ Use tax-loss harvesting before March 31\n✅ Invest through tax-saving instruments\n\nStock Key payouts are structured to be tax-efficient. Consult your CA for personalized advice.' },

  { keywords: ['market crash', 'market correction', 'what to do during crash', 'panic selling', 'buy the dip'],
    response: 'What to do during market crash:\n\n❌ **DON\'T**:\n• Panic sell at losses\n• Check portfolio every hour\n• Stop your SIPs\n• Listen to scary news\n\n✅ **DO**:\n• Stay calm — markets always recover\n• Continue your SIPs (buy more at lower prices)\n• Add quality stocks at discounts\n• Review your asset allocation\n• Think long-term\n\nHistorical perspective:\n• 2008 crash: NIFTY fell 60%, recovered in 2 years\n• 2020 COVID crash: Fell 40%, recovered in 6 months\n• Every crash was a buying opportunity\n\nOur portfolio is built to survive crashes through diversification.' },

  // ═══════════════════════════════════════════════════════════════
  // DEFAULT FALLBACK
  // ═══════════════════════════════════════════════════════════════
  { keywords: [],
    response: 'I\'m not sure I understand that specific question, but I can help you with:\n\n📈 **Stock Market** — NIFTY, SENSEX, sectors, analysis\n💰 **Investment Plans** — Premium, Standard, Customised\n📊 **Returns** — How our 12% monthly works\n🛡️ **Risk & Safety** — Portfolio diversification\n📝 **Registration** — How to get started\n🏥 **Insurance** — Health, Term, Car, Bike\n📞 **Contact** — Phone & email support\n\nWhat would you like to know more about?' },
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
