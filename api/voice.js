/**
 * Vercel Serverless Function — POST /api/voice
 *
 * Text-to-Speech for the Stock Key voice agent.
 * Calls Sarvam AI Bulbul v3 TTS and returns the base64 audio + a data URL
 * the browser can play directly via an <audio> element.
 *
 * Auth: server env SARVAM_API_KEY preferred, else client api-subscription-key header.
 *
 * Request body: { text, language?: 'en-IN'|'hi-IN'|..., speaker?: 'shubh' }
 * Response:     { audio: '<base64 wav>', mimeType, dataUrl, requestId }
 */

const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech'

const SUPPORTED_LANGS = new Set([
  'en-IN', 'hi-IN', 'ta-IN', 'te-IN', 'kn-IN', 'ml-IN',
  'mr-IN', 'bn-IN', 'gu-IN', 'pa-IN', 'od-IN', 'as-IN',
])

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, api-subscription-key')
    return res.status(204).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  try {
    const { text, language = 'en-IN', speaker = 'shubh' } = req.body || {}
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text is required.' })
    }

    const apiKey = process.env.SARVAM_API_KEY || req.headers['api-subscription-key']
    if (!apiKey) {
      return res.status(401).json({
        error: 'Missing Sarvam API key. Set SARVAM_API_KEY in Vercel env vars, or send api-subscription-key header.',
      })
    }

    const lang = SUPPORTED_LANGS.has(language) ? language : 'en-IN'

    // Sarvam v3 REST limit is 2500 chars; chunk defensively if longer.
    const cleanText = text.replace(/\*\*/g, '').replace(/#{1,6}\s/g, '').replace(/\n+/g, '. ').replace(/\s+/g, ' ').trim()
    const chunk = cleanText.slice(0, 2500)

    const payload = {
      text: chunk,
      target_language_code: lang,
      speaker,
      model: 'bulbul:v3',
      pace: 1.0,
      speech_sample_rate: 22050,
      output_audio_codec: 'mp3',
    }

    const sarvamRes = await fetch(SARVAM_TTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify(payload),
    })

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text().catch(() => '')
      console.error('Sarvam TTS error', sarvamRes.status, errText)
      return res.status(502).json({ error: 'Sarvam TTS request failed.', detail: errText.slice(0, 500) })
    }

    const data = await sarvamRes.json()
    const audioB64 = data?.audios?.[0]
    if (!audioB64) {
      return res.status(502).json({ error: 'No audio returned from Sarvam.' })
    }

    const mimeType = 'audio/mpeg'
    const dataUrl = `data:${mimeType};base64,${audioB64}`

    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(200).json({
      audio: audioB64,
      mimeType,
      dataUrl,
      requestId: data?.request_id || null,
    })
  } catch (err) {
    console.error('voice handler error:', err)
    return res.status(500).json({ error: 'Internal server error.', detail: String(err?.message || err).slice(0, 300) })
  }
}
