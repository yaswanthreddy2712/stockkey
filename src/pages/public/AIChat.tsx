import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getBotResponse, getWelcomeMessage, generateId, personalities, type ChatMessage, type AIPersonality } from '../../lib/faqBot'
import { initVoice, speak, stopSpeaking } from '../../lib/voice'
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
  const [activePersonality, setActivePersonality] = useState<AIPersonality>(personalities[0])
  const [showPersonalityPicker, setShowPersonalityPicker] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    initVoice().then(v => { voiceRef.current = v })
    return () => stopSpeaking()
  }, [])

  useEffect(() => {
    const greeting = { id: generateId(), role: 'assistant' as const, text: activePersonality.greeting, timestamp: Date.now(), personality: activePersonality.id }
    setMessages([greeting])
    if (voiceEnabled) {
      setTimeout(() => {
        speak(activePersonality.greeting, voiceRef.current).then(() => setSpeakingMsgId(null))
        setSpeakingMsgId(greeting.id)
      }, 500)
    }
  }, [activePersonality])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    inputRef.current?.focus()
  }, [showPersonalityPicker])

  const send = useCallback((text?: string) => {
    const msg = (text || input).trim()
    if (!msg) return

    stopSpeaking()
    setSpeakingMsgId(null)

    const userMsg: ChatMessage = { id: generateId(), role: 'user', text: msg, timestamp: Date.now() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const reply = getBotResponse(msg)
      const replyMsg = { id: generateId(), role: 'assistant' as const, text: reply, timestamp: Date.now(), personality: activePersonality.id }
      setMessages((m) => [...m, replyMsg])
      setTyping(false)

      if (voiceEnabled) {
        setTimeout(() => {
          speak(reply, voiceRef.current).then(() => setSpeakingMsgId(null))
          setSpeakingMsgId(replyMsg.id)
        }, 200)
      }
    }, 600 + Math.random() * 800)
  }, [input, activePersonality, voiceEnabled])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Try Chrome.')
      return
    }
    stopSpeaking()
    setSpeakingMsgId(null)
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

  const toggleVoice = () => {
    if (voiceEnabled) stopSpeaking()
    setVoiceEnabled(!voiceEnabled)
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

        <button onClick={() => setShowPersonalityPicker(!showPersonalityPicker)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-700/50 bg-gray-800/40 hover:bg-gray-700/40 transition-all">
          <span className={`h-6 w-6 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br ${activePersonality.color}`}>{activePersonality.avatar}</span>
          <span className="text-sm font-medium text-gray-200 hidden sm:inline">{activePersonality.name}</span>
          <svg className={`h-3 w-3 text-gray-500 transition-transform ${showPersonalityPicker ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>

        <div className="flex-1" />
        <span className="text-xs text-gray-500 hidden sm:inline">{typing ? 'Thinking...' : speakingMsgId ? 'Speaking...' : 'Online'}</span>
        <button onClick={toggleVoice} className={`p-2 rounded-lg transition-all ${voiceEnabled ? 'text-sky-400 bg-sky-400/10' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'}`} title={voiceEnabled ? 'Voice ON' : 'Voice OFF'}>
          {voiceEnabled ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
          )}
        </button>
        {speakingMsgId && (
          <button onClick={() => { stopSpeaking(); setSpeakingMsgId(null) }} className="p-2 text-red-400 hover:bg-gray-700/50 rounded-lg transition-all" title="Stop speaking">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
          </button>
        )}
        <Link to="/" className="text-xs text-gray-400 hover:text-gray-200 transition-colors">&larr; Home</Link>
      </header>

      {/* Personality Picker */}
      {showPersonalityPicker && (
        <div className="border-b px-4 sm:px-6 py-4" style={{ borderColor: 'var(--border-dark)', background: 'var(--surface-dark)' }}>
          <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2">
            {personalities.map((p) => (
              <button key={p.id} onClick={() => { setActivePersonality(p); setShowPersonalityPicker(false); stopSpeaking() }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${activePersonality.id === p.id ? 'border-sky-500/50 bg-sky-500/10' : 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/40'}`}>
                <span className={`h-10 w-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br ${p.color} flex-shrink-0`}>{p.avatar}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-100 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 truncate">{p.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <span className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br ${activePersonality.color} flex-shrink-0 mr-3 mt-1`}>{activePersonality.avatar}</span>
              )}
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-sky-500/20 text-gray-100 rounded-br-md'
                  : 'rounded-bl-md text-gray-200'
              }`} style={m.role === 'assistant' ? { background: 'var(--card-dark)' } : undefined}>
                <p className="whitespace-pre-wrap">{m.text.split('**').map((part, i) =>
                  i % 2 === 1 ? <strong key={i} className="text-gray-50 font-semibold">{part}</strong> : part
                )}</p>
                {m.role === 'assistant' && speakingMsgId === m.id && (
                  <div className="flex items-center gap-1 mt-2">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="w-1 rounded-full bg-sky-400 animate-pulse" style={{ height: `${8 + Math.random() * 12}px`, animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                )}
              </div>
              {m.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 ml-3 mt-1 text-xs font-bold text-gray-300">U</div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <span className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br ${activePersonality.color} flex-shrink-0 mr-3`}>{activePersonality.avatar}</span>
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

      {/* Quick Actions */}
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
              placeholder={listening ? 'Listening... speak now' : 'Type or speak your question...'}
              className="flex-1 bg-transparent text-sm text-gray-100 placeholder:text-gray-500 outline-none"
              disabled={listening}
            />
            <button
              onMouseDown={listening ? stopListening : startListening}
              className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${listening ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50'}`}
              title={listening ? 'Stop listening' : 'Speak now'}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
            <button onClick={() => send()} disabled={!input.trim() || typing}
              className="h-10 w-10 rounded-xl bg-sky-gradient flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0 hover:opacity-90">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">
            {listening ? (
              <span className="text-red-400 animate-pulse">Listening... speak now</span>
            ) : speakingMsgId ? (
              <span className="text-sky-400">AI is speaking... click stop to interrupt</span>
            ) : (
              'Voice input + voice output enabled • Click mic to speak'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
