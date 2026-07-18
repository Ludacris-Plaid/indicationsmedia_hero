import { get } from '@vercel/blob'

const HEALTH_CACHE_PATH = 'analytics/health-cache.json'

const PROVIDERS = [
  {
    id: 'featherless',
    name: 'Featherless AI',
    baseUrl: 'https://api.featherless.ai/v1',
    model: 'Qwen/Qwen3-8B',
    role: 'PRIMARY',
    color: '#00ccff',
    checkUrl: 'https://api.featherless.ai/v1/models',
  },
  {
    id: 'nvidia',
    name: 'NVIDIA NIM',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    model: 'meta/llama-3.1-8b-instruct',
    role: 'FALLBACK',
    color: '#76b900',
    checkUrl: 'https://integrate.api.nvidia.com/v1/models',
  },
  {
    id: 'ai-site',
    name: 'ai.indicationsmedia.com',
    baseUrl: 'https://ai.indicationsmedia.com',
    model: '—',
    role: 'APP',
    color: '#ff3366',
    checkUrl: 'https://ai.indicationsmedia.com',
  },
  {
    id: 'main-site',
    name: 'indicationsmedia.com',
    baseUrl: 'https://www.indicationsmedia.com',
    model: '—',
    role: 'APP',
    color: '#00ff66',
    checkUrl: 'https://www.indicationsmedia.com',
  },
  {
    id: 'analytics-api',
    name: 'Analytics API',
    baseUrl: 'https://www.indicationsmedia.com/api/analytics',
    model: '—',
    role: 'API',
    color: '#FF6600',
    checkUrl: 'https://www.indicationsmedia.com/api/analytics',
  },
]

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

async function readBlob(path, fallback) {
  try {
    const result = await get(path, { access: 'public' })
    const res = await fetch(result.url)
    if (!res.ok) return fallback
    return await res.json()
  } catch (err) {
    console.error(`[health] readBlob(${path}) failed:`, err.message)
    return fallback
  }
}

async function checkProvider(provider) {
  const start = Date.now()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch(provider.checkUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'User-Agent': 'indications-admin-healthcheck' },
    })
    clearTimeout(timeout)

    const latency = Date.now() - start
    // 401 is expected for auth-required endpoints — means the service is alive
    const status = res.ok || res.status === 401 ? 'up' : res.status >= 500 ? 'down' : 'degraded'
    return {
      ...provider,
      status,
      statusCode: res.status,
      latency,
      lastChecked: new Date().toISOString(),
    }
  } catch (err) {
    const latency = Date.now() - start
    const isTimeout = err.name === 'AbortError' || err.message?.includes('abort')
    return {
      ...provider,
      status: isTimeout ? 'timeout' : 'down',
      statusCode: 0,
      latency,
      error: err.message?.slice(0, 80),
      lastChecked: new Date().toISOString(),
    }
  }
}

export default async function handler(req, res) {
  setCORS(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Auth check
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Check all providers in parallel
    const results = await Promise.all(PROVIDERS.map(checkProvider))

    // Calculate overall status
    const allUp = results.every(r => r.status === 'up')
    const anyDown = results.some(r => r.status === 'down' || r.status === 'timeout')
    const overall = allUp ? 'operational' : anyDown ? 'degraded' : 'partial'

    // Load previous results from blob to show history
    const cached = await readBlob(HEALTH_CACHE_PATH, { history: {} })
    const history = cached.history || {}

    // Update history (last 20 checks per provider)
    const newHistory = { ...history }
    for (const r of results) {
      if (!newHistory[r.id]) newHistory[r.id] = []
      newHistory[r.id].push({
        status: r.status,
        latency: r.latency,
        timestamp: r.lastChecked,
      })
      newHistory[r.id] = newHistory[r.id].slice(-20)
    }

    // Cache results — fire and forget with error logging
    const { put } = await import('@vercel/blob')
    put(HEALTH_CACHE_PATH, JSON.stringify({ history: newHistory, lastRun: new Date().toISOString() }), {
      contentType: 'application/json',
      access: 'public',
      allowOverwrite: true,
    }).catch(err => console.error('[health] Cache save failed:', err.message))

    return res.status(200).json({
      overall,
      providers: results.map(r => ({
        id: r.id,
        name: r.name,
        role: r.role,
        model: r.model,
        color: r.color,
        status: r.status,
        statusCode: r.statusCode,
        latency: r.latency,
        error: r.error || null,
        lastChecked: r.lastChecked,
      })),
      history: newHistory,
    })
  } catch (err) {
    console.error('[health] Handler error:', err)
    return res.status(500).json({ error: 'Health check failed' })
  }
}
