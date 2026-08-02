import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getBotResponse, getWelcomeMessage, generateId, personalities, type ChatMessage, type AIPersonality } from '../lib/faqBot'
import { IconChart } from './icons'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)
  const [activePersonality, setActivePersonality] = useState<AIPersonality>(personalities[0])
  const [showPersonalityPicker, setShowPersonalityPicker] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [listening, setListening] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  // Expose open function globally for hero button
  useEffect(() => {
    window.__openChat = () => { setOpen(true); setFullScreen(true) }
    return () => { delete window.__openChat }
  }, [])

  // Initialize with personality greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: generateId(),
        role: 'assistant',
        text: activePersonality.greeting,
        timestamp: Date.now(),
        personality: activePersonality.id,
      }])
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open, fullScreen])

  const switchPersonality = (p: AIPersonality) => {
    setActivePersonality(p)
    setShowPersonalityPicker(false)
    setMessages([{
      id: generateId(),
      role: 'assistant',
      text: p.greeting,
      timestamp: Date.now(),
      personality: p.id,
    }])
  }

  const send = useCallback((text?: string) => {
    const msg = (text || input).trim()
    if (!msg) return

    const userMsg: ChatMessage = { id: generateId(), role: 'user', text: msg, timestamp: Date.now() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const reply = getBotResponse(msg)
      setMessages((m) => [...m, { id: generateId(), role: 'assistant', text: reply, timestamp: Date.now(), personality: activePersonality.id }])
      setTyping(false)
    }, 600 + Math.random() * 800)
  }, [input, activePersonality])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  // Voice input
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Try Chrome.')
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('')
      setInput(transcript)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.start()
    setListening(true)
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const quickActions = ['Investment Plans', 'Monthly Returns', 'How to Register', 'Insurance']

  const chatContent = (
    <div className="flex flex-col h-full" style={{ background: fullScreen ? 'var(--bg-dark)' : undefined }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 flex-shrink-0" style={{ background: 'var(--surface-dark)', borderBottom: '1px solid var(--border-dark)' }}>
        {showPersonalityPicker ? (
          <button onClick={() => setShowPersonalityPicker(false)} className="text-gray-400 hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
        ) : (
          <button onClick={() => setActivePersonality(activePersonality)} className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}>
            <span className={`h-9 w-9 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${activePersonality.color}`}>{activePersonality.avatar}</span>
          </button>
        )}
        <div className="flex-1 min-w-0">
          {showPersonalityPicker ? (
            <h3 className="text-sm font-bold text-gray-50 font-display">Choose AI Assistant</h3>
          ) : (
            <>
              <h3 className="text-sm font-bold text-gray-50 font-display">{activePersonality.name} — {activePersonality.role}</h3>
              <p className="text-xs text-gray-400">Ask about Stock Key services</p>
            </>
          )}
        </div>
        {!showPersonalityPicker && (
          <div className="flex items-center gap-1.5">
            <button onClick={() => setShowPersonalityPicker(true)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all" title="Change assistant">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            {!fullScreen && (
              <button onClick={() => { setFullScreen(true); setOpen(false) }} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all" title="Full screen">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              </button>
            )}
            <Link to="/ai" onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all" title="Full page">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </Link>
            {fullScreen && (
              <button onClick={() => setFullScreen(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all" title="Minimize">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
              </button>
            )}
            <button onClick={() => { setOpen(false); setFullScreen(false) }} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700/50 rounded-lg transition-all" title="Close">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Personality Picker */}
      {showPersonalityPicker ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {personalities.map((p) => (
            <button key={p.id} onClick={() => switchPersonality(p)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${activePersonality.id === p.id ? 'border-sky-500/50 bg-sky-500/10' : 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/40'}`}>
              <span className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${p.color} flex-shrink-0`}>{p.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-100">{p.name}</p>
                <p className="text-xs text-gray-400">{p.role}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{p.style === 'professional' ? 'Formal & data-driven' : p.style === 'friendly' ? 'Warm & conversational' : p.style === 'expert' ? 'Deep market knowledge' : 'Caring & supportive'}</p>
              </div>
              {activePersonality.id === p.id && (
                <svg className="h-5 w-5 text-sky-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              )}
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <span className={`h-7 w-7 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br ${activePersonality.color} flex-shrink-0 mr-2 mt-0.5`}>{activePersonality.avatar}</span>
                )}
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
                <span className={`h-7 w-7 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br ${activePersonality.color} flex-shrink-0 mr-2`}>{activePersonality.avatar}</span>
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
          <div className="px-4 pb-4 pt-2 flex-shrink-0">
            <div className="flex gap-2 items-center rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-dark)', background: 'var(--card-dark)' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type or speak..."
                className="flex-1 bg-transparent text-sm text-gray-100 placeholder:text-gray-500 outline-none"
              />
              <button
                onMouseDown={listening ? stopListening : startListening}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${listening ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50'}`}
                title={listening ? 'Stop listening' : 'Voice input'}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </button>
              <button onClick={() => send()} disabled={!input.trim()} className="h-8 w-8 rounded-lg bg-sky-gradient flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <>
      {/* ── Floating Bubble ── */}
      {!fullScreen && (
        <button
          onClick={() => setOpen(!open)}
          className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${open ? 'bg-gray-700 rotate-90' : 'bg-sky-gradient animate-glow-pulse'}`}
          aria-label="Talk to AI"
        >
          {open ? (
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          )}
        </button>
      )}

      {/* ── Floating Panel ── */}
      {open && !fullScreen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-fade-up" style={{ height: 'min(560px, calc(100vh - 8rem))', background: 'var(--bg-dark)', border: '1px solid var(--border-dark)' }}>
          {chatContent}
        </div>
      )}

      {/* ── Full Screen Overlay ── */}
      {fullScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-2xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-fade-up" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-dark)' }}>
            {chatContent}
          </div>
        </div>
      )}
    </>
  )
}
