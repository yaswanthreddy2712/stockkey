import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBotResponse, getWelcomeMessage, generateId, type ChatMessage } from '../lib/faqBot'
import { IconChart } from './icons'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([getWelcomeMessage()])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  const send = () => {
    const text = input.trim()
    if (!text) return

    const userMsg: ChatMessage = { id: generateId(), role: 'user', text, timestamp: Date.now() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const reply = getBotResponse(text)
      setMessages((m) => [...m, { id: generateId(), role: 'assistant', text: reply, timestamp: Date.now() }])
      setTyping(false)
    }, 600 + Math.random() * 800)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const quickActions = ['Investment Plans', 'Monthly Returns', 'How to Register', 'Insurance']

  return (
    <>
      {/* ── Floating Bubble ── */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${open ? 'bg-gray-700 rotate-90' : 'bg-sky-gradient animate-glow-pulse'}`}
        aria-label="Chat with AI"
      >
        {open ? (
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        )}
      </button>

      {/* ── Chat Panel ── */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-fade-up" style={{ height: 'min(520px, calc(100vh - 8rem))', background: 'var(--bg-dark)', border: '1px solid var(--border-dark)' }}>
          {/* Header */}
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: 'var(--surface-dark)' }}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-gradient text-white shadow-lg flex-shrink-0">
              <IconChart className="h-5 w-5" />
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-50 font-display">Stock Key Assistant</h3>
              <p className="text-xs text-gray-400">Ask about plans, returns, insurance...</p>
            </div>
            <Link to="/ai" onClick={() => setOpen(false)} className="text-xs text-sky-400 hover:text-sky-300 font-medium whitespace-nowrap">Full Page &rarr;</Link>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-sky-500/20 text-gray-100 rounded-br-md'
                    : 'rounded-bl-md text-gray-200'
                }`} style={m.role === 'assistant' ? { background: 'var(--card-dark)' } : undefined}>
                  <p className="whitespace-pre-wrap">{m.text.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i} className="text-gray-50 font-semibold">{part}</strong> : part
                  )}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md px-4 py-3" style={{ background: 'var(--card-dark)' }}>
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickActions.map((qa) => (
                <button key={qa} onClick={() => { setInput(qa); setTimeout(send, 50) }}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-700/50 bg-gray-800/40 text-gray-300 hover:bg-gray-700/40 hover:text-gray-100 transition-colors">
                  {qa}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2">
            <div className="flex gap-2 items-center rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-dark)', background: 'var(--card-dark)' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your question..."
                className="flex-1 bg-transparent text-sm text-gray-100 placeholder:text-gray-500 outline-none"
              />
              <button onClick={send} disabled={!input.trim()} className="h-8 w-8 rounded-lg bg-sky-gradient flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
