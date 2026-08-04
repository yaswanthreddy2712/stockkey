import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAgent, LANGUAGES } from '../../lib/useAgent'
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
  const [input, setInput] = useState('')
  const [showLangPicker, setShowLangPicker] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const agent = useAgent({ voiceEnabled: true })

  useEffect(() => { agent.initGreeting() }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [agent.messages, agent.typing])
  useEffect(() => { inputRef.current?.focus() }, [showLangPicker])

  const send = (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg) return
    setInput('')
    agent.send(msg)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const statusText = agent.listening ? 'Listening…' : agent.typing ? 'Thinking…' : agent.speakingMsgId ? 'Speaking…' : 'Online'

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

        <button onClick={() => setShowLangPicker(!showLangPicker)} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-700/50 bg-gray-800/40 hover:bg-gray-700/40 transition-all">
          <svg className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m3.1 9.5L12 21m-4.5-4.5h9M17 11a5 5 0 11-10 0 5 5 0 0110 0z" /></svg>
          <span className="text-sm font-medium text-gray-200 hidden sm:inline">{LANGUAGES.find((l) => l.code === agent.language)?.label || 'English'}</span>
          <svg className={`h-3 w-3 text-gray-500 transition-transform ${showLangPicker ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>

        <div className="flex-1" />
        <span className="text-xs text-gray-500 hidden sm:inline">{statusText}</span>
        <button onClick={agent.setVoiceEnabled} className={`p-2 rounded-lg transition-all ${agent.voiceEnabled ? 'text-sky-400 bg-sky-400/10' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'}`} title={agent.voiceEnabled ? 'Voice ON' : 'Voice OFF'}>
          {agent.voiceEnabled ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
          )}
        </button>
        {agent.speakingMsgId && (
          <button onClick={agent.stopSpeaking} className="p-2 text-red-400 hover:bg-gray-700/50 rounded-lg transition-all" title="Stop speaking">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
          </button>
        )}
        <Link to="/" className="text-xs text-gray-400 hover:text-gray-200 transition-colors">&larr; Home</Link>
      </header>

      {/* Language Picker */}
      {showLangPicker && (
        <div className="border-b px-4 sm:px-6 py-4" style={{ borderColor: 'var(--border-dark)', background: 'var(--surface-dark)' }}>
          <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LANGUAGES.map((l) => (
              <button key={l.code} onClick={() => { agent.setLanguage(l.code); setShowLangPicker(false) }}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${agent.language === l.code ? 'border-sky-500/50 bg-sky-500/10' : 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/40'}`}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-100 truncate">{l.label}</p>
                  <p className="text-xs text-gray-500 truncate">{l.nativeLabel}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {agent.messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <span className="h-8 w-8 rounded-lg flex items-center justify-center bg-sky-gradient flex-shrink-0 mr-3 mt-1">
                  <IconChart className="h-4 w-4 text-white" />
                </span>
              )}
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-sky-500/20 text-gray-100 rounded-br-md' : 'rounded-bl-md text-gray-200'}`} style={m.role === 'assistant' ? { background: 'var(--card-dark)' } : undefined}>
                <p className="whitespace-pre-wrap">{m.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-gray-50 font-semibold">{part}</strong> : part)}</p>
                {m.role === 'assistant' && agent.speakingMsgId === m.id && (
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="w-1 rounded-full bg-sky-400 animate-pulse" style={{ height: `${8 + (i % 3) * 4}px`, animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                )}
              </div>
              {m.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 ml-3 mt-1 text-xs font-bold text-gray-300">U</div>
              )}
            </div>
          ))}
          {agent.typing && (
            <div className="flex justify-start">
              <span className="h-8 w-8 rounded-lg flex items-center justify-center bg-sky-gradient flex-shrink-0 mr-3">
                <IconChart className="h-4 w-4 text-white" />
              </span>
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
      {agent.messages.length <= 2 && (
        <div className="px-4 sm:px-6 pb-3">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Questions</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickActions.map((qa) => (
                <button key={qa.label} onClick={() => send(qa.label)} className="text-left p-3 rounded-xl border border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/40 transition-all group">
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
              placeholder={agent.listening ? 'Listening… speak now' : 'Type or speak your question…'}
              className="flex-1 bg-transparent text-sm text-gray-100 placeholder:text-gray-500 outline-none"
              disabled={agent.listening}
            />
            <button
              onMouseDown={agent.listening ? agent.stopListening : agent.startListening}
              className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${agent.listening ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50'}`}
              title={agent.listening ? 'Stop listening' : 'Speak now'}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
            <button onClick={() => send()} disabled={!input.trim() || agent.typing} className="h-10 w-10 rounded-xl bg-sky-gradient flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0 hover:opacity-90">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">
            {agent.listening ? <span className="text-red-400 animate-pulse">Listening… speak now</span> : agent.speakingMsgId ? <span className="text-sky-400">AI is speaking… click stop to interrupt</span> : 'Multilingual voice agent · click mic to speak'}
          </p>
        </div>
      </div>
    </div>
  )
}
