import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBotResponse, getWelcomeMessage, generateId, type ChatMessage } from '../../lib/faqBot'
import { IconChart } from '../../components/icons'

const quickActions = [
  { label: 'Investment Plans', icon: '📈', desc: 'Compare Premium, Standard & Customised' },
  { label: 'Monthly Returns', icon: '💰', desc: 'How our 12% returns work' },
  { label: 'How to Register', icon: '📝', desc: 'Step-by-step guide' },
  { label: 'Insurance Products', icon: '🛡️', desc: 'Health, Term, Car & Bike' },
  { label: 'Payment Methods', icon: '💳', desc: 'UPI, Bank Transfer & more' },
  { label: 'Contact Support', icon: '📞', desc: 'Phone & email details' },
]

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([getWelcomeMessage()])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const send = (text?: string) => {
    const msg = (text || input).trim()
    if (!msg) return

    const userMsg: ChatMessage = { id: generateId(), role: 'user', text: msg, timestamp: Date.now() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const reply = getBotResponse(msg)
      setMessages((m) => [...m, { id: generateId(), role: 'assistant', text: reply, timestamp: Date.now() }])
      setTyping(false)
    }, 600 + Math.random() * 800)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-dark)' }}>
      {/* Header */}
      <header className="border-b px-4 sm:px-6 py-4 flex items-center gap-4" style={{ borderColor: 'var(--border-dark)', background: 'var(--surface-dark)' }}>
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-gradient text-white shadow-lg">
            <IconChart className="h-5 w-5" />
          </span>
          <span className="font-bold text-gray-50 font-display">Stock Key</span>
        </Link>
        <div className="h-6 w-px bg-gray-700" />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-300">AI Assistant</span>
        </div>
        <div className="flex-1" />
        <Link to="/" className="text-xs text-gray-400 hover:text-gray-200 transition-colors">&larr; Back to Home</Link>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-sky-gradient flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                  <IconChart className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-sky-500/20 text-gray-100 rounded-br-md'
                  : 'rounded-bl-md text-gray-200'
              }`} style={m.role === 'assistant' ? { background: 'var(--card-dark)' } : undefined}>
                <p className="whitespace-pre-wrap">{m.text.split('**').map((part, i) =>
                  i % 2 === 1 ? <strong key={i} className="text-gray-50 font-semibold">{part}</strong> : part
                )}</p>
              </div>
              {m.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 ml-3 mt-1 text-xs font-bold text-gray-300">
                  U
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="h-8 w-8 rounded-full bg-sky-gradient flex items-center justify-center flex-shrink-0 mr-3">
                <IconChart className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl rounded-bl-md px-5 py-3" style={{ background: 'var(--card-dark)' }}>
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick Actions (show only at start) */}
      {messages.length <= 2 && (
        <div className="px-4 sm:px-6 pb-3">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Questions</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickActions.map((qa) => (
                <button key={qa.label} onClick={() => send(qa.label)}
                  className="text-left p-3 rounded-xl border border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/40 transition-all group">
                  <span className="text-lg">{qa.icon}</span>
                  <p className="text-sm font-medium text-gray-200 mt-1 group-hover:text-white transition-colors">{qa.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{qa.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 sm:px-6 pb-6 pt-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 items-center rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border-dark)', background: 'var(--surface-dark)' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything about Stock Key..."
              className="flex-1 bg-transparent text-sm text-gray-100 placeholder:text-gray-500 outline-none"
            />
            <button onClick={() => send()} disabled={!input.trim() || typing}
              className="h-10 w-10 rounded-xl bg-sky-gradient flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0 hover:opacity-90">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">AI-powered answers about Stock Key services. Not financial advice.</p>
        </div>
      </div>
    </div>
  )
}
