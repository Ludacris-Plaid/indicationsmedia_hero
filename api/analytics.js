import { get, put } from '@vercel/blob'

const ANALYTICS_PATH = 'analytics/events.json'

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

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

async function getEvents() {
  try {
    const blob = await get(ANALYTICS_PATH)
    const text = await blob.text()
    return JSON.parse(text)
  } catch {
    return []
  }
}

async function saveEvents(events) {
  await put(ANALYTICS_PATH, JSON.stringify(events), {
    contentType: 'application/json',
    access: 'public',
    allowOverwrite: true,
  })
}

export default async function handler(req, res) {
  setCORS(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // POST — record an event
  if (req.method === 'POST') {
    try {
      const { type, page, meta } = req.body
      if (!type || !page) {
        return res.status(400).json({ error: 'type and page are required' })
      }

      const forwarded = req.headers['x-forwarded-for']
      const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'
      const country = req.headers['x-vercel-ip-country'] || 'Unknown'
      const ua = req.headers['user-agent'] || ''

      const events = await getEvents()
      const event = {
        id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
        type,
        page,
        country,
        ip: ip.replace(/::ffff:/, ''),
        userAgent: ua,
        timestamp: new Date().toISOString(),
        meta: meta || {},
      }

      events.push(event)
      // keep last 50k events max
      if (events.length > 50000) events.splice(0, events.length - 50000)
      await saveEvents(events)

      return res.status(201).json({ ok: true })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to record event' })
    }
  }

  // GET — aggregated stats (admin only)
  if (req.method === 'GET') {
    const auth = req.headers.authorization?.replace('Bearer ', '')
    const pwd = req.query?.password
    if (auth !== process.env.ADMIN_PASSWORD && pwd !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const events = await getEvents()
      const pageviews = events.filter(e => e.type === 'pageview')
      const interactions = events.filter(e => e.type === 'interaction')

      const totalVisits = pageviews.length

      const uniqueIPs = new Set(pageviews.map(e => e.ip))
      const uniqueVisitors = uniqueIPs.size

      const ipCounts = {}
      pageviews.forEach(e => { ipCounts[e.ip] = (ipCounts[e.ip] || 0) + 1 })
      const bouncers = Object.values(ipCounts).filter(c => c === 1).length
      const bounceRate = uniqueVisitors > 0 ? Math.round((bouncers / uniqueVisitors) * 100) : 0

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

      const geoCounts = {}
      pageviews.forEach(e => {
        const code = e.country || 'Unknown'
        geoCounts[code] = (geoCounts[code] || 0) + 1
      })
      const geo = Object.entries(geoCounts)
        .map(([code, count]) => ({
          code,
          country: GEO_MAP[code] || code,
          visits: count,
          pct: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0,
        }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 20)

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

      const pageCounts = {}
      pageviews.forEach(e => { pageCounts[e.page] = (pageCounts[e.page] || 0) + 1 })
      const pageAnalytics = Object.entries(pageCounts)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)

      const interCounts = {}
      interactions.forEach(e => {
        const name = e.meta?.name || e.page
        interCounts[name] = (interCounts[name] || 0) + 1
      })
      const interactionBreakdown = Object.entries(interCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

      const recent = events.slice(-30).reverse().map(e => ({
        type: e.type,
        page: e.page,
        country: e.country,
        name: e.meta?.name || null,
        ts: e.timestamp,
      }))

      return res.status(200).json({
        totalVisits,
        uniqueVisitors,
        bounceRate,
        avgDuration,
        geo,
        hourlyTraffic,
        pageAnalytics,
        interactionBreakdown,
        recent,
        totalEvents: events.length,
      })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to load analytics' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
