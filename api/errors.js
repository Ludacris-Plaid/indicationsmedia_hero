import { get, put } from '@vercel/blob'

const ERRORS_PATH = 'analytics/errors.json'

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

async function readBlob(path, fallback) {
  try {
    const result = await get(path, { access: 'public' })
    const res = await fetch(result.url)
    if (!res.ok) return fallback
    return await res.json()
  } catch (err) {
    console.error(`[errors] readBlob(${path}) failed:`, err.message)
    return fallback
  }
}

async function writeBlob(path, data) {
  await put(path, JSON.stringify(data), {
    contentType: 'application/json',
    access: 'public',
    allowOverwrite: true,
  })
}

async function getErrorData() {
  return readBlob(ERRORS_PATH, { errors: [] })
}

async function saveErrorData(data) {
  await writeBlob(ERRORS_PATH, data)
}

export default async function handler(req, res) {
  setCORS(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')

  // POST — log an error (from any source)
  if (req.method === 'POST') {
    if (token !== process.env.ADMIN_PASSWORD && token !== process.env.AI_BOT_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const { status, path, message, source, method } = req.body
      const data = await getErrorData()
      const now = Date.now()
      const today = new Date().toISOString().slice(0, 10)

      // Guard: if read returned empty structure but we expect data, log warning
      if (!Array.isArray(data.errors)) data.errors = []

      data.errors.push({
        ts: now,
        date: today,
        status: status || 500,
        path: path || '/',
        message: message || 'Unknown error',
        source: source || 'unknown',
        method: method || 'GET',
      })

      // Keep last 7 days
      const cutoff = now - 7 * 24 * 60 * 60 * 1000
      data.errors = data.errors.filter(e => e.ts > cutoff)

      await saveErrorData(data)
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('[errors] POST error:', err)
      return res.status(500).json({ error: 'Failed to log error' })
    }
  }

  // GET — return error summary
  const authOk = token === process.env.ADMIN_PASSWORD
  if (!authOk) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const data = await getErrorData()
    const errors = data.errors || []
    const now = Date.now()

    // Filter to last 24h
    const last24h = errors.filter(e => e.ts > now - 24 * 60 * 60 * 1000)
    const last7d = errors

    // Group by status code
    const byStatus = {}
    for (const e of last24h) {
      const key = String(e.status)
      byStatus[key] = (byStatus[key] || 0) + 1
    }

    // Group by path
    const byPath = {}
    for (const e of last24h) {
      byPath[e.path] = (byPath[e.path] || 0) + 1
    }

    // Group by source
    const bySource = {}
    for (const e of last24h) {
      bySource[e.source] = (bySource[e.source] || 0) + 1
    }

    // Group by day
    const daily = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      daily[d] = { total: 0, byStatus: {} }
    }
    for (const e of last7d) {
      if (daily[e.date]) {
        daily[e.date].total++
        const key = String(e.status)
        daily[e.date].byStatus[key] = (daily[e.date].byStatus[key] || 0) + 1
      }
    }

    return res.status(200).json({
      summary: {
        last24h: last24h.length,
        last7d: last7d.length,
        byStatus,
        byPath: Object.entries(byPath).sort((a, b) => b[1] - a[1]).slice(0, 10),
        bySource,
      },
      daily,
      recent: last24h.slice(-50).reverse(),
    })
  } catch (err) {
    console.error('[errors] GET error:', err)
    return res.status(500).json({ error: 'Failed to load errors' })
  }
}
