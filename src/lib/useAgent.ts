/**
 * useAgent — React hook that powers the Stock Key voice agent.
 *
 * Replaces the old keyword-matching faqBot with a real conversational LLM
 * (via /api/agent -> Sarvam Chat) plus natural Sarvam TTS (via /api/voice),
 * with graceful fallbacks to browser speech when no API key is configured.
 */

import { useState, useRef, useCallback } from 'react'
import { generateId, type ChatMessage } from './faqBot'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export type AgentLanguage = {
  code: string
  label: string
  nativeLabel: string
  sttLang: string // for Web Speech API recognition
}

export const LANGUAGES: AgentLanguage[] = [
  { code: 'en-IN', label: 'English', nativeLabel: 'English', sttLang: 'en-IN' },
  { code: 'hi-IN', label: 'Hindi', nativeLabel: 'हिन्दी', sttLang: 'hi-IN' },
  { code: 'ta-IN', label: 'Tamil', nativeLabel: 'தமிழ்', sttLang: 'ta-IN' },
  { code: 'te-IN', label: 'Telugu', nativeLabel: 'తెలుగు', sttLang: 'te-IN' },
  { code: 'kn-IN', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', sttLang: 'kn-IN' },
  { code: 'ml-IN', label: 'Malayalam', nativeLabel: 'മലയാളം', sttLang: 'ml-IN' },
  { code: 'mr-IN', label: 'Marathi', nativeLabel: 'मराठी', sttLang: 'mr-IN' },
  { code: 'bn-IN', label: 'Bengali', nativeLabel: 'বাংলা', sttLang: 'bn-IN' },
]

const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY as string | undefined

/**
 * Call Sarvam TTS via our serverless route and play the returned audio.
 * Returns true if it played (or attempted). Falls back to browser speech.
 */
export async function speakWithSarvam(
  text: string,
  language: string,
  onEnd?: () => void,
  onError?: (e: any) => void,
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/voice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(SARVAM_API_KEY ? { 'api-subscription-key': SARVAM_API_KEY } : {}),
      },
      body: JSON.stringify({ text, language }),
    })
    if (!res.ok) throw new Error(`voice API ${res.status}`)
    const data = await res.json()
    if (!data?.dataUrl) throw new Error('no audio')

    const audio = new Audio(data.dataUrl)
    audio.onended = () => onEnd?.()
    audio.onerror = (e) => { onError?.(e); onEnd?.() }
    await audio.play()
    return true
  } catch (err) {
    // Fallback: use browser SpeechSynthesis (works offline, lower quality)
    return speakWithBrowser(text, onEnd)
  }
}

/** Browser TTS fallback (original voice.ts behaviour, trimmed). */
export function speakWithBrowser(text: string, onEnd?: () => void): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd?.()
    return false
  }
  window.speechSynthesis.cancel()
  const clean = text.replace(/\*\*/g, '').replace(/#{1,6}\s/g, '').replace(/\n+/g, '. ').replace(/\s+/g, ' ').trim()
  const u = new SpeechSynthesisUtterance(clean)
  u.rate = 0.95
  u.onend = () => onEnd?.()
  u.onerror = () => onEnd?.()
  window.speechSynthesis.speak(u)
  return true
}

export function stopAllAudio() {
  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
}

export interface UseAgentOptions {
  language?: string
  voiceEnabled?: boolean
  greeting?: string
}

export function useAgent(opts: UseAgentOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typing, setTyping] = useState(false)
  const [listening, setListening] = useState(false)
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState(opts.language || 'en-IN')
  const [voiceEnabled, setVoiceEnabled] = useState(opts.voiceEnabled ?? true)

  const messagesRef = useRef<ChatMessage[]>([])
  messagesRef.current = messages

  const recognitionRef = useRef<any>(null)
  const audioElsRef = useRef<HTMLAudioElement[]>([])

  const initGreeting = useCallback(() => {
    const g: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      text: opts.greeting || "Hey there! I'm Ria, your Stock Key voice assistant. Ask me about our investment plans, returns, insurance, or how to get started — in English or Hindi. What would you like to know?",
      timestamp: Date.now(),
    }
    setMessages([g])
    // Don't auto-speak on load — only speak when user interacts
  }, [opts.greeting])

  const stopSpeaking = useCallback(() => {
    stopAllAudio()
    audioElsRef.current.forEach((a) => { a.pause(); a.src = '' })
    audioElsRef.current = []
    setSpeakingMsgId(null)
  }, [])

  const send = useCallback(
    async (text: string) => {
      const msg = text.trim()
      if (!msg || typing) return

      stopSpeaking()
      setError(null)

      const userMsg: ChatMessage = { id: generateId(), role: 'user', text: msg, timestamp: Date.now() }
      const history = [...messagesRef.current, userMsg]
      setMessages(history)
      setTyping(true)

      try {
        // Build LLM message list (roles + content only)
        const llmMessages = history.map((m) => ({ role: m.role, content: m.text }))

        const res = await fetch(`${API_BASE}/agent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(SARVAM_API_KEY ? { 'api-subscription-key': SARVAM_API_KEY } : {}),
          },
          body: JSON.stringify({ messages: llmMessages, language }),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `Agent request failed: ${res.status}`)
        }
        const data = await res.json()
        const reply: string = data.reply || "I'm sorry, I couldn't generate a response right now."

        const replyMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          text: reply,
          timestamp: Date.now(),
        }
        setMessages((m) => [...m, replyMsg])
        setTyping(false)

        if (voiceEnabled) {
          setTimeout(() => {
            setSpeakingMsgId(replyMsg.id)
            speakWithSarvam(reply, language, () => setSpeakingMsgId(null))
          }, 150)
        }
      } catch (err: any) {
        setTyping(false)
        setError(err?.message || 'Something went wrong.')
        // Fallback reply so the conversation continues
        const fallback: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          text: "I'm having trouble connecting to my brain right now. Please try again, or call us at +91 70131 78382 and our team will help you directly.",
          timestamp: Date.now(),
        }
        setMessages((m) => [...m, fallback])
      }
    },
    [typing, language, voiceEnabled, stopSpeaking],
  )

  // ── Voice input (browser STT, multilingual) ───────────────────────────
  const startListening = useCallback(() => {
    const SR = (typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition))
    if (!SR) {
      setError('Voice input is not supported in your browser. Try Chrome.')
      return
    }
    stopSpeaking()
    const rec = new SR()
    recognitionRef.current = rec
    rec.continuous = false
    rec.interimResults = true
    rec.lang = language // use the selected agent language for STT too
    let finalTranscript = ''
    rec.onresult = (event: any) => {
      finalTranscript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('')
    }
    rec.onend = () => {
      setListening(false)
      if (finalTranscript.trim()) send(finalTranscript.trim())
    }
    rec.onerror = () => setListening(false)
    rec.start()
    setListening(true)
  }, [language, send, stopSpeaking])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((v) => {
      if (v) stopSpeaking()
      return !v
    })
  }, [stopSpeaking])

  const reset = useCallback(() => {
    stopSpeaking()
    setMessages([])
    setError(null)
    setTimeout(initGreeting, 50)
  }, [stopSpeaking, initGreeting])

  return {
    messages,
    typing,
    listening,
    speakingMsgId,
    error,
    language,
    voiceEnabled,
    setLanguage,
    setVoiceEnabled: toggleVoice,
    send,
    initGreeting,
    reset,
    startListening,
    stopListening,
    stopSpeaking,
  }
}
