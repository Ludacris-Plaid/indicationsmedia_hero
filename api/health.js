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

async function checkProvider(provider) {
  const start = Date.now()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch(provider.checkUrl, {
      method: provider.id === 'analytics-api' ? 'GET' : 'GET',
      signal: controller.signal,
      headers: { 'User-Agent': 'indications-admin-healthcheck' },
    })
    clearTimeout(timeout)

    const latency = Date.now() - start
    const status = res.ok ? 'up' : res.status >= 500 ? 'down' : 'degraded'
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

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
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
    let history = {}
    try {
      const result = await get(HEALTH_CACHE_PATH, { access: 'public' })
      const res = await fetch(result.blob.url)
      if (res.ok) {
        const cached = await res.json()
        history = cached.history || {}
      }
    } catch {}

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

    // Cache results (fire and forget)
    const { put } = await import('@vercel/blob')
    put(HEALTH_CACHE_PATH, JSON.stringify({ history: newHistory, lastRun: new Date().toISOString() }), {
      contentType: 'application/json',
      access: 'public',
      allowOverwrite: true,
    }).catch(() => {})

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
    return res.status(500).json({ error: 'Health check failed' })
  }
}
