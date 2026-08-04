let cachedVoice: SpeechSynthesisVoice | null = null
let voicesLoaded = false

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) { resolve(voices); return }

    const onLoaded = () => {
      resolve(window.speechSynthesis.getVoices())
    }
    window.speechSynthesis.addEventListener('voiceschanged', onLoaded)

    // Timeout fallback: if voices never load, resolve with empty array
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onLoaded)
      resolve(window.speechSynthesis.getVoices())
    }, 3000)
  })
}

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  // Priority order for natural-sounding human-like voices
  const preferred = [
    // Google natural voices (best quality, most human-like)
    'Google UK English Female',
    'Google UK English Male',
    'Google US English',
    'Google English (India)',
    'Google हिन्दी',
    // Microsoft natural voices (Neural - very human-like)
    'Microsoft Zira',
    'Microsoft David',
    'Microsoft Mark',
    'Microsoft Ravi',
    'Microsoft Heera',
    // Apple natural voices (high quality)
    'Samantha',
    'Daniel',
    'Karen',
    'Moira',
    'Tessa',
    // Fallback natural voices
    'Alex',
    'Victoria',
    'Alice',
  ]

  // Try to find a preferred voice
  for (const name of preferred) {
    const found = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'))
    if (found) return found
  }

  // Fallback: find any high-quality English voice
  const englishVoices = voices.filter(v => v.lang.startsWith('en'))
  if (englishVoices.length > 0) {
    // Prefer voices marked as local service (usually higher quality)
    const local = englishVoices.find(v => v.localService)
    if (local) return local
    return englishVoices[0]
  }

  return null
}

export async function initVoice(): Promise<SpeechSynthesisVoice | null> {
  if (cachedVoice) return cachedVoice
  const voices = await loadVoices()
  cachedVoice = pickBestVoice(voices)
  voicesLoaded = true
  return cachedVoice
}

export function speak(text: string, voice?: SpeechSynthesisVoice | null): Promise<void> {
  return new Promise((resolve) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Clean markdown formatting for speech
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\|[^|]+\|/g, '')
      .replace(/[-=*]{3,}/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (!cleanText) { resolve(); return }

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 0.92 // Slightly slower for natural, human-like feel
    utterance.pitch = 1.0
    utterance.volume = 1.0

    if (voice) {
      utterance.voice = voice
    } else if (cachedVoice) {
      utterance.voice = cachedVoice
    }

    utterance.onend = () => resolve()
    utterance.onerror = () => resolve() // Resolve even on error

    window.speechSynthesis.speak(utterance)
  })
}

export function stopSpeaking() {
  window.speechSynthesis.cancel()
}

export function isSpeaking(): boolean {
  return window.speechSynthesis.speaking
}
