import { get, put } from '@vercel/blob'

const UPTIME_PATH = 'analytics/uptime.json'

const TARGETS = [
  { id: 'main', name: 'indicationsmedia.com', url: 'https://www.indicationsmedia.com', color: '#00ff66' },
  { id: 'ai', name: 'ai.indicationsmedia.com', url: 'https://ai.indicationsmedia.com', color: '#00ccff' },
  { id: 'analytics', name: 'Analytics API', url: 'https://www.indicationsmedia.com/api/analytics', color: '#FF6600' },
  { id: 'featherless', name: 'Featherless AI', url: 'https://api.featherless.ai/v1/models', color: '#7C3AED' },
  { id: 'nvidia', name: 'NVIDIA NIM', url: 'https://integrate.api.nvidia.com/v1/models', color: '#76b900' },
]

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

async function readBlob(path, fallback) {
  try {
    const result = await get(path, { access: 'public' })
    if (!result || !result.blob?.url) return fallback
    const res = await fetch(result.blob.url)
    if (!res.ok) return fallback
    return await res.json()
  } catch (err) {
    console.error(`[uptime] readBlob(${path}) failed:`, err.message)
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

async function getUptimeData() {
  return readBlob(UPTIME_PATH, { checks: {} })
}

async function saveUptimeData(data) {
  await writeBlob(UPTIME_PATH, data)
}

async function pingTarget(target) {
  const start = Date.now()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(target.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'indications-admin-uptime' },
    })
    clearTimeout(timeout)
    return {
      up: res.ok || res.status === 401,
      latency: Date.now() - start,
      status: res.status,
    }
  } catch (err) {
    return {
      up: false,
      latency: Date.now() - start,
      status: 0,
      error: err.message?.slice(0, 60),
    }
  }
}

function calcUptimePercent(checks, hours) {
  const cutoff = Date.now() - hours * 60 * 60 * 1000
  const recent = checks.filter(c => c.ts > cutoff)
  if (recent.length === 0) return null
  const upCount = recent.filter(c => c.up).length
  return Math.round((upCount / recent.length) * 10000) / 100
}

export default async function handler(req, res) {
  setCORS(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const data = await getUptimeData()
    if (!data.checks || typeof data.checks !== 'object') data.checks = {}

    const now = Date.now()

    // Ping all targets in parallel
    const results = await Promise.all(TARGETS.map(async (target) => {
      const ping = await pingTarget(target)
      if (!data.checks[target.id]) data.checks[target.id] = []
      data.checks[target.id].push({ ts: now, up: ping.up, latency: ping.latency })
      // Keep last 7 days of checks (every 60s = ~10080 entries max)
      data.checks[target.id] = data.checks[target.id].slice(-10080)
      return { ...target, ...ping }
    }))

    // Save — fire and forget but with error logging
    saveUptimeData(data).catch(err => console.error('[uptime] Save failed:', err.message))

    // Build response with uptime percentages
    const response = results.map(r => ({
      id: r.id,
      name: r.name,
      color: r.color,
      up: r.up,
      latency: r.latency,
      status: r.status,
      error: r.error || null,
      uptime24h: calcUptimePercent(data.checks[r.id] || [], 24),
      uptime7d: calcUptimePercent(data.checks[r.id] || [], 168),
      uptime30d: calcUptimePercent(data.checks[r.id] || [], 720),
      totalChecks: (data.checks[r.id] || []).length,
    }))

    return res.status(200).json({ targets: response })
  } catch (err) {
    console.error('[uptime] Handler error:', err)
    return res.status(500).json({ error: 'Uptime check failed' })
  }
}
