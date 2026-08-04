import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAgent, LANGUAGES } from '../lib/useAgent'
import { IconChart } from './icons'

/**
 * Voice-enabled floating chat widget (replaces the old rule-based ChatWidget).
 * - Conversational LLM brain via /api/agent (Sarvam Chat)
 * - Natural TTS via /api/voice (Sarvam Bulbul v3) with browser fallback
 * - Multilingual: pick language for both STT and TTS
 * - Floating bubble + popup panel + full-screen overlay + link to /ai page
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)
  const [showLangPicker, setShowLangPicker] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const agent = useAgent({ voiceEnabled: true })

  // Init greeting on mount + expose global opener
  useEffect(() => {
    agent.initGreeting()
    ;(window as any).__openChat = () => { setOpen(true); setFullScreen(true) }
    return () => { delete (window as any).__openChat; agent.stopSpeaking() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [agent.messages, agent.typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open, fullScreen])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  function handleSend(text?: string) {
    const msg = (text ?? inputVal).trim()
    if (!msg) return
    setInputVal('')
    agent.send(msg)
  }

  const [inputVal, setInputVal] = useState('')
  const quickActions = ['Investment Plans', 'Monthly Returns', 'How to Register', 'Insurance']

  const statusText = agent.listening
    ? 'Listening…'
    : agent.typing
    ? 'Thinking…'
    : agent.speakingMsgId
    ? 'Speaking…'
    : 'Online'

  const chatContent = (
    <div className="flex flex-col h-full" style={{ background: fullScreen ? 'var(--bg-dark)' : undefined }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 flex-shrink-0" style={{ background: 'var(--surface-dark)', borderBottom: '1px solid var(--border-dark)' }}>
        {showLangPicker ? (
          <button onClick={() => setShowLangPicker(false)} className="text-gray-400 hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
        ) : (
          <span className="h-9 w-9 rounded-xl flex items-center justify-center bg-sky-gradient flex-shrink-0 shadow-lg">
            <IconChart className="h-5 w-5 text-white" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          {showLangPicker ? (
            <h3 className="text-sm font-bold text-gray-50 font-display">Choose Language</h3>
          ) : (
            <>
              <h3 className="text-sm font-bold text-gray-50 font-display">Stock Key Voice Assistant</h3>
              <p className="text-xs text-gray-400">{statusText}</p>
            </>
          )}
        </div>
        {!showLangPicker && (
          <div className="flex items-center gap-1">
            {/* Language picker */}
            <button onClick={() => setShowLangPicker(true)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all" title="Change language">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m3.1 9.5L12 21m-4.5-4.5h9M17 11a5 5 0 11-10 0 5 5 0 0110 0z" /></svg>
            </button>
            {/* Voice toggle */}
            <button onClick={agent.setVoiceEnabled} className={`p-2 rounded-lg transition-all ${agent.voiceEnabled ? 'text-sky-400 bg-sky-400/10' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'}`} title={agent.voiceEnabled ? 'Voice ON' : 'Voice OFF'}>
              {agent.voiceEnabled ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
              )}
            </button>
            {/* Stop speaking */}
            {agent.speakingMsgId && (
              <button onClick={agent.stopSpeaking} className="p-2 text-red-400 hover:bg-gray-700/50 rounded-lg transition-all" title="Stop speaking">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
              </button>
            )}
            {/* Full screen */}
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
            <button onClick={() => { agent.stopSpeaking(); setOpen(false); setFullScreen(false) }} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700/50 rounded-lg transition-all" title="Close">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Language Picker */}
      {showLangPicker ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {LANGUAGES.map((l) => (
            <button key={l.code} onClick={() => { agent.setLanguage(l.code); setShowLangPicker(false) }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${agent.language === l.code ? 'border-sky-500/50 bg-sky-500/10' : 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/40'}`}>
              <div>
                <p className="font-semibold text-gray-100">{l.label}</p>
                <p className="text-xs text-gray-400">{l.nativeLabel}</p>
              </div>
              <span className="text-xs text-gray-500">{l.code}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {agent.messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <span className="h-7 w-7 rounded-lg flex items-center justify-center bg-sky-gradient flex-shrink-0 mr-2 mt-0.5">
                    <IconChart className="h-4 w-4 text-white" />
                  </span>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-sky-500/20 text-gray-100 rounded-br-md' : 'rounded-bl-md text-gray-200'}`} style={m.role === 'assistant' ? { background: 'var(--card-dark)' } : undefined}>
                  <p className="whitespace-pre-wrap">{m.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-gray-50 font-semibold">{part}</strong> : part)}</p>
                  {m.role === 'assistant' && agent.speakingMsgId === m.id && (
                    <div className="flex items-center gap-1 mt-1.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className="w-1 rounded-full bg-sky-400 animate-pulse" style={{ height: `${8 + (i % 3) * 4}px`, animationDelay: `${i * 0.12}s` }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {agent.typing && (
              <div className="flex justify-start">
                <span className="h-7 w-7 rounded-lg flex items-center justify-center bg-sky-gradient flex-shrink-0 mr-2">
                  <IconChart className="h-4 w-4 text-white" />
                </span>
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

          {agent.error && (
            <div className="px-4 pb-2 text-xs text-red-400">{agent.error}</div>
          )}

          {/* Quick Actions */}
          {agent.messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickActions.map((qa) => (
                <button key={qa} onClick={() => agent.send(qa)} className="text-xs px-3 py-1.5 rounded-full border border-gray-700/50 bg-gray-800/40 text-gray-300 hover:bg-gray-700/40 hover:text-gray-100 transition-colors">
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
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKey}
                placeholder={agent.listening ? 'Listening…' : 'Type or speak…'}
                className="flex-1 bg-transparent text-sm text-gray-100 placeholder:text-gray-500 outline-none"
                disabled={agent.listening}
              />
              <button
                onMouseDown={agent.listening ? agent.stopListening : agent.startListening}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${agent.listening ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50'}`}
                title={agent.listening ? 'Stop listening' : 'Speak now'}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </button>
              <button onClick={() => handleSend()} disabled={!inputVal.trim() || agent.typing} className="h-8 w-8 rounded-lg bg-sky-gradient flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-600 mt-1.5">
              {agent.listening ? <span className="text-red-400">Listening… speak now</span> : agent.speakingMsgId ? <span className="text-sky-400">AI is speaking… tap stop to interrupt</span> : `Voice agent · ${LANGUAGES.find((l) => l.code === agent.language)?.label || 'English'}`}
            </p>
          </div>
        </>
      )}
    </div>
  )

  return (
    <>
      {/* Floating Bubble */}
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

      {/* Floating Panel */}
      {open && !fullScreen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-fade-up" style={{ height: 'min(560px, calc(100vh - 8rem))', background: 'var(--bg-dark)', border: '1px solid var(--border-dark)' }}>
          {chatContent}
        </div>
      )}

      {/* Full Screen Overlay */}
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
