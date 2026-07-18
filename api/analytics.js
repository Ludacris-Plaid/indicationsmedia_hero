import { get, put } from '@vercel/blob'

const EVENTS_PATH = 'analytics/events.json'
const COUNTERS_PATH = 'analytics/counters.json'

const MAX_RAW_EVENTS = 10000 // last ~30 days of raw events for real-time dashboard
const RETENTION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

const GEO_MAP = {
  US: 'United States', CA: 'Canada', GB: 'United Kingdom', DE: 'Germany',
  FR: 'France', JP: 'Japan', AU: 'Australia', BR: 'Brazil', IN: 'India',
  NL: 'Netherlands', SE: 'Sweden', SG: 'Singapore', KR: 'South Korea',
  CH: 'Switzerland', NO: 'Norway', FI: 'Finland', DK: 'Denmark',
  IE: 'Ireland', ES: 'Spain', IT: 'Italy', PL: 'Poland', RU: 'Russia',
  CN: 'China', MX: 'Mexico', AR: 'Argentina', ZA: 'South Africa',
  NG: 'Nigeria', KE: 'Kenya', EG: 'Egypt', TR: 'Turkey', UA: 'Ukraine',
  AT: 'Austria', BE: 'Belgium', PT: 'Portugal', CZ: 'Czech Republic',
  RO: 'Romania', HU: 'Hungary', NZ: 'New Zealand', TH: 'Thailand',
  VN: 'Vietnam', PH: 'Philippines', ID: 'Indonesia', MY: 'Malaysia',
  PK: 'Pakistan', BD: 'Bangladesh', LK: 'Sri Lanka', IL: 'Israel',
  AE: 'UAE', SA: 'Saudi Arabia', CL: 'Chile', CO: 'Colombia', PE: 'Peru',
}

// ── Blob helpers ──────────────────────────────────────────────────────────────

async function readBlob(path, fallback) {
  try {
    const result = await get(path, { access: 'public' })
    const res = await fetch(result.url)
    if (!res.ok) return fallback
    return await res.json()
  } catch (err) {
    console.error(`[analytics] readBlob(${path}) failed:`, err.message)
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

// ── Events (raw, capped for real-time dashboard) ──────────────────────────────

async function getEvents() {
  return readBlob(EVENTS_PATH, [])
}

async function saveEvents(events) {
  await writeBlob(EVENTS_PATH, events)
}

// ── Counters (cumulative, NEVER loses data) ───────────────────────────────────
// This is the source of truth for all-time stats. Even if events.json gets
// corrupted or truncated, counters.json preserves historical totals.

async function getCounters() {
  return readBlob(COUNTERS_PATH, {
    // All-time cumulative counters
    totalPageviews: 0,
    totalInteractions: 0,
    uniqueVisitors: {},     // ip -> first-seen timestamp (for approximate all-time unique count)
    // Daily breakdowns (YYYY-MM-DD -> stats)
    daily: {},
    // Page breakdowns (path -> cumulative count)
    pages: {},
    // Interaction breakdowns (name -> cumulative count)
    interactions: {},
    // Geo breakdowns (country code -> cumulative count)
    geo: {},
    // Metadata
    firstEventAt: null,
    lastEventAt: null,
    lastUpdated: null,
  })
}

async function saveCounters(counters) {
  counters.lastUpdated = new Date().toISOString()
  await writeBlob(COUNTERS_PATH, counters)
}

// ── POST — record an event ───────────────────────────────────────────────────

function createEvent(body, headers) {
  const { type, page, meta } = body
  const forwarded = headers['x-forwarded-for']
  const ip = (forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1').replace(/::ffff:/, '')
  const country = headers['x-vercel-ip-country'] || 'Unknown'

  return {
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    type,
    page,
    country,
    ip,
    userAgent: headers['user-agent'] || '',
    timestamp: new Date().toISOString(),
    meta: meta || {},
  }
}

function updateCounters(counters, event) {
  const now = Date.now()
  const today = new Date().toISOString().slice(0, 10)
  const pageKey = event.type === 'pageview' ? 'totalPageviews' : 'totalInteractions'
  counters[pageKey]++

  if (!counters.firstEventAt) counters.firstEventAt = event.timestamp
  counters.lastEventAt = event.timestamp

  // Daily stats
  if (!counters.daily[today]) {
    counters.daily[today] = {
      pageviews: 0,
      interactions: 0,
      uniqueIps: {},
      geo: {},
      pages: {},
    }
  }
  const day = counters.daily[today]
  if (event.type === 'pageview') {
    day.pageviews++
    day.uniqueIps[event.ip] = (day.uniqueIps[event.ip] || 0) + 1
  } else {
    day.interactions++
  }

  // Daily geo
  const gCode = event.country || 'Unknown'
  day.geo[gCode] = (day.geo[gCode] || 0) + 1
  counters.geo[gCode] = (counters.geo[gCode] || 0) + 1

  // Daily pages
  if (event.type === 'pageview') {
    day.pages[event.page] = (day.pages[event.page] || 0) + 1
    counters.pages[event.page] = (counters.pages[event.page] || 0) + 1
  }

  // Interactions
  if (event.type === 'interaction') {
    const name = event.meta?.name || event.page
    day.interactions++
    counters.interactions[name] = (counters.interactions[name] || 0) + 1
  }

  // All-time unique visitors (approximate — by IP)
  counters.uniqueVisitors[event.ip] = now

  // Prune daily stats older than 90 days
  const cutoff = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  for (const key of Object.keys(counters.daily)) {
    if (key < cutoff) delete counters.daily[key]
  }

  // Prune uniqueVisitors older than 90 days (keeps approximate unique count stable)
  const ipCutoff = now - 90 * 24 * 60 * 60 * 1000
  for (const [ip, ts] of Object.entries(counters.uniqueVisitors)) {
    if (ts < ipCutoff) delete counters.uniqueVisitors[ip]
  }

  return counters
}

// ── Handler ───────────────────────────────────────────────────────────────────

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default async function handler(req, res) {
  setCORS(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  // ── POST ──
  if (req.method === 'POST') {
    try {
      const { type, page } = req.body
      if (!type || !page) {
        return res.status(400).json({ error: 'type and page are required' })
      }

      const event = createEvent(req.body, req.headers)

      // Write both stores in parallel — counters are the safety net
      const [events, counters] = await Promise.all([getEvents(), getCounters()])

      // Update raw events (capped)
      events.push(event)
      const cutoff = Date.now() - RETENTION_MS
      const filtered = events.filter(e => new Date(e.timestamp).getTime() > cutoff)
      // Always keep at least the most recent MAX_RAW_EVENTS
      const trimmed = filtered.length > MAX_RAW_EVENTS
        ? filtered.slice(filtered.length - MAX_RAW_EVENTS)
        : filtered

      // Update cumulative counters
      updateCounters(counters, event)

      // Save both — counters first (most important), events second
      // If events save fails, counters still have the data
      try {
        await saveCounters(counters)
      } catch (err) {
        console.error('[analytics] Failed to save counters:', err.message)
      }
      try {
        await saveEvents(trimmed)
      } catch (err) {
        console.error('[analytics] Failed to save events:', err.message)
      }

      return res.status(201).json({ ok: true })
    } catch (err) {
      console.error('[analytics] POST error:', err)
      return res.status(500).json({ error: err.message || 'Failed to record event' })
    }
  }

  // ── GET (admin only) ──
  if (req.method === 'GET') {
    const auth = req.headers.authorization?.replace('Bearer ', '')
    const pwd = new URL(req.url, 'http://localhost').searchParams.get('password')
    if (auth !== process.env.ADMIN_PASSWORD && pwd !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      // Load both stores in parallel
      const [events, counters] = await Promise.all([getEvents(), getCounters()])

      const pageviews = events.filter(e => e.type === 'pageview')
      const interactions = events.filter(e => e.type === 'interaction')

      // ── Use cumulative counters as the source of truth for totals ──
      const totalVisits = counters.totalPageviews || pageviews.length
      const uniqueVisitors = Object.keys(counters.uniqueVisitors || {}).length || new Set(pageviews.map(e => e.ip)).size

      // Bounce rate from raw events (last 30 days window)
      const ipCounts = {}
      pageviews.forEach(e => { ipCounts[e.ip] = (ipCounts[e.ip] || 0) + 1 })
      const bouncers = Object.values(ipCounts).filter(c => c === 1).length
      const bounceRate = uniqueVisitors > 0 ? Math.round((bouncers / uniqueVisitors) * 100) : 0

      // Avg session duration
      let totalDuration = 0
      let sessionCount = 0
      const sortedByIP = {}
      pageviews.forEach(e => {
        if (!sortedByIP[e.ip]) sortedByIP[e.ip] = []
        sortedByIP[e.ip].push(new Date(e.timestamp).getTime())
      })
      Object.values(sortedByIP).forEach(timestamps => {
        timestamps.sort((a, b) => a - b)
        if (timestamps.length < 2) { sessionCount++; return }
        let sessionStart = timestamps[0]
        let lastTime = timestamps[0]
        for (let i = 1; i < timestamps.length; i++) {
          if (timestamps[i] - lastTime > 30 * 60 * 1000) {
            totalDuration += (lastTime - sessionStart)
            sessionCount++
            sessionStart = timestamps[i]
          }
          lastTime = timestamps[i]
        }
        totalDuration += (lastTime - sessionStart)
        sessionCount++
      })
      const avgDuration = sessionCount > 0 ? Math.round(totalDuration / sessionCount / 1000) : 0

      // ── Geo from cumulative counters ──
      const geo = Object.entries(counters.geo || {})
        .map(([code, count]) => ({
          code,
          country: GEO_MAP[code] || code,
          visits: count,
          pct: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0,
        }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 20)

      // ── Hourly traffic (last 24h from raw events) ──
      const now = Date.now()
      const hourlyTraffic = []
      for (let i = 23; i >= 0; i--) {
        const hourStart = new Date(now - i * 3600000)
        const hourEnd = new Date(hourStart.getTime() + 3600000)
        const h = hourStart.getHours()
        const label = `${String(h).padStart(2, '0')}:00`
        const count = pageviews.filter(e => {
          const t = new Date(e.timestamp).getTime()
          return t >= hourStart.getTime() && t < hourEnd.getTime()
        }).length
        hourlyTraffic.push({ hour: label, visits: count })
      }

      // ── Page analytics from cumulative counters ──
      const pageAnalytics = Object.entries(counters.pages || {})
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)

      // ── Interaction breakdown from cumulative counters ──
      const interactionBreakdown = Object.entries(counters.interactions || {})
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

      // ── Daily traffic (last 30 days from cumulative counters) ──
      const dailyTraffic = []
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
        const dayData = counters.daily?.[d]
        dailyTraffic.push({
          date: d,
          pageviews: dayData?.pageviews || 0,
          interactions: dayData?.interactions || 0,
          uniqueVisitors: dayData?.uniqueIps ? Object.keys(dayData.uniqueIps).length : 0,
        })
      }

      // ── Recent events (from raw events) ──
      const recent = events.slice(-30).reverse().map(e => ({
        type: e.type,
        page: e.page,
        country: e.country,
        name: e.meta?.name || null,
        ts: e.timestamp,
      }))

      return res.status(200).json({
        // Core stats (from cumulative counters — never lose these)
        totalVisits,
        uniqueVisitors,
        bounceRate,
        avgDuration,
        // Breakdowns (from cumulative counters)
        geo,
        pageAnalytics,
        interactionBreakdown,
        // Time series (from raw events — last 30 days)
        hourlyTraffic,
        dailyTraffic,
        recent,
        // Meta
        totalEvents: events.length,
        countersFirstEvent: counters.firstEventAt,
        countersLastEvent: counters.lastEventAt,
      })
    } catch (err) {
      console.error('[analytics] GET error:', err)
      return res.status(500).json({ error: err.message || 'Failed to load analytics' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
