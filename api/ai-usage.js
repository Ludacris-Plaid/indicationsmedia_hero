import { get, put } from '@vercel/blob'

const USAGE_PATH = 'analytics/ai-usage.json'

// Pricing per 1M tokens (approximate)
const PRICING = {
  'Qwen/Qwen3-8B': { input: 0.10, output: 0.10, provider: 'featherless' },
  'meta/llama-3.1-8b-instruct': { input: 0.00, output: 0.00, provider: 'nvidia' },
}

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
    console.error(`[ai-usage] readBlob(${path}) failed:`, err.message)
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

async function getUsageData() {
  return readBlob(USAGE_PATH, { calls: [], totals: {} })
}

async function saveUsageData(data) {
  await writeBlob(USAGE_PATH, data)
}

export default async function handler(req, res) {
  setCORS(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')
  if (token !== process.env.ADMIN_PASSWORD && token !== process.env.AI_BOT_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // POST — log a new AI call (from chatbot)
  if (req.method === 'POST') {
    try {
      const { model, inputTokens, outputTokens, latency, provider, success } = req.body
      if (!model) return res.status(400).json({ error: 'model required' })

      const data = await getUsageData()
      if (!Array.isArray(data.calls)) data.calls = []

      const now = Date.now()
      const today = new Date().toISOString().slice(0, 10)

      data.calls.push({
        ts: now,
        date: today,
        model,
        provider: provider || PRICING[model]?.provider || 'unknown',
        inputTokens: inputTokens || 0,
        outputTokens: outputTokens || 0,
        latency: latency || 0,
        success: success !== false,
      })

      // Keep last 30 days
      const cutoff = now - 30 * 24 * 60 * 60 * 1000
      data.calls = data.calls.filter(c => c.ts > cutoff)

      // Calculate totals
      const todayCalls = data.calls.filter(c => c.date === today)
      data.totals = {
        todayCalls: todayCalls.length,
        todayInputTokens: todayCalls.reduce((s, c) => s + c.inputTokens, 0),
        todayOutputTokens: todayCalls.reduce((s, c) => s + c.outputTokens, 0),
        todayCost: todayCalls.reduce((s, c) => {
          const pricing = PRICING[c.model]
          if (!pricing) return s
          return s + (c.inputTokens / 1_000_000) * pricing.input + (c.outputTokens / 1_000_000) * pricing.output
        }, 0),
        totalCalls: data.calls.length,
        totalInputTokens: data.calls.reduce((s, c) => s + c.inputTokens, 0),
        totalOutputTokens: data.calls.reduce((s, c) => s + c.outputTokens, 0),
        successRate: data.calls.length > 0
          ? Math.round((data.calls.filter(c => c.success).length / data.calls.length) * 100)
          : 100,
      }

      await saveUsageData(data)
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('[ai-usage] POST error:', err)
      return res.status(500).json({ error: 'Failed to log usage' })
    }
  }

  // GET — return usage stats
  try {
    const data = await getUsageData()
    const calls = data.calls || []
    const now = Date.now()

    // Group by day for last 7 days
    const daily = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      daily[d] = { calls: 0, inputTokens: 0, outputTokens: 0, cost: 0, errors: 0 }
    }

    for (const call of calls) {
      if (daily[call.date]) {
        daily[call.date].calls++
        daily[call.date].inputTokens += call.inputTokens
        daily[call.date].outputTokens += call.outputTokens
        if (!call.success) daily[call.date].errors++
        const pricing = PRICING[call.model]
        if (pricing) {
          daily[call.date].cost += (call.inputTokens / 1_000_000) * pricing.input + (call.outputTokens / 1_000_000) * pricing.output
        }
      }
    }

    // Group by model
    const byModel = {}
    for (const call of calls) {
      if (!byModel[call.model]) byModel[call.model] = { calls: 0, inputTokens: 0, outputTokens: 0 }
      byModel[call.model].calls++
      byModel[call.model].inputTokens += call.inputTokens
      byModel[call.model].outputTokens += call.outputTokens
    }

    return res.status(200).json({
      totals: data.totals || {},
      daily,
      byModel,
      recentCalls: calls.slice(-20).reverse(),
    })
  } catch (err) {
    console.error('[ai-usage] GET error:', err)
    return res.status(500).json({ error: 'Failed to load usage' })
  }
}
