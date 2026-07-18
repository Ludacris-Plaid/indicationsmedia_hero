import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const LOCAL_EVENTS_FILE = join(process.cwd(), '.analytics-events.json')
const LOCAL_COUNTERS_FILE = join(process.cwd(), '.analytics-counters.json')
const MAX_RAW_EVENTS = 10000
const RETENTION_MS = 30 * 24 * 60 * 60 * 1000

function loadJson(file, fallback) {
  try {
    if (existsSync(file)) {
      const raw = readFileSync(file, 'utf-8')
      return JSON.parse(raw)
    }
  } catch { /* corrupted file */ }
  return fallback
}

function saveJson(file, data) {
  try {
    writeFileSync(file, JSON.stringify(data), 'utf-8')
  } catch { /* best effort */ }
}

function getLocalEvents() {
  const data = loadJson(LOCAL_EVENTS_FILE, [])
  return Array.isArray(data) ? data : []
}

function saveLocalEvents(events) {
  saveJson(LOCAL_EVENTS_FILE, events)
}

function getLocalCounters() {
  return loadJson(LOCAL_COUNTERS_FILE, {
    totalPageviews: 0,
    totalInteractions: 0,
    uniqueVisitors: {},
    daily: {},
    pages: {},
    interactions: {},
    geo: {},
    firstEventAt: null,
    lastEventAt: null,
    lastUpdated: null,
  })
}

function saveLocalCounters(counters) {
  counters.lastUpdated = new Date().toISOString()
  saveJson(LOCAL_COUNTERS_FILE, counters)
}

function updateCounters(counters, event) {
  const now = Date.now()
  const today = new Date().toISOString().slice(0, 10)
  const key = event.type === 'pageview' ? 'totalPageviews' : 'totalInteractions'
  counters[key]++

  if (!counters.firstEventAt) counters.firstEventAt = event.timestamp
  counters.lastEventAt = event.timestamp

  if (!counters.daily[today]) {
    counters.daily[today] = { pageviews: 0, interactions: 0, uniqueIps: {}, geo: {}, pages: {} }
  }
  const day = counters.daily[today]
  if (event.type === 'pageview') {
    day.pageviews++
    day.uniqueIps[event.ip] = (day.uniqueIps[event.ip] || 0) + 1
  } else {
    day.interactions++
  }

  const gCode = event.country || 'Unknown'
  day.geo[gCode] = (day.geo[gCode] || 0) + 1
  counters.geo[gCode] = (counters.geo[gCode] || 0) + 1

  if (event.type === 'pageview') {
    day.pages[event.page] = (day.pages[event.page] || 0) + 1
    counters.pages[event.page] = (counters.pages[event.page] || 0) + 1
  }
  if (event.type === 'interaction') {
    const name = event.meta?.name || event.page
    counters.interactions[name] = (counters.interactions[name] || 0) + 1
  }

  counters.uniqueVisitors[event.ip] = now

  // Prune old daily stats and unique visitors
  const cutoff = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  for (const k of Object.keys(counters.daily)) {
    if (k < cutoff) delete counters.daily[k]
  }
  const ipCutoff = now - 90 * 24 * 60 * 60 * 1000
  for (const [ip, ts] of Object.entries(counters.uniqueVisitors)) {
    if (ts < ipCutoff) delete counters.uniqueVisitors[ip]
  }

  return counters
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const deepseekKey = env.DEEPSEEK_API_KEY
  const featherlessKey = env.FEATHERLESS_API_KEY
  const nvidiaKey = env.NVIDIA_API_KEY

  return {
    plugins: [
      react(),
      {
        name: 'chat-api',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            const body = await new Promise((resolve) => {
              let data = ''
              req.on('data', (chunk) => { data += chunk })
              req.on('end', () => resolve(data))
            })

            try {
              const { messages } = JSON.parse(body)

              const SYSTEM_PROMPT = `You are the AI assistant for Indications Media, a premium software development and cybersecurity studio founded by a senior full-stack engineer.

--- OUR SERVICES ---
We offer six core services: Custom Web Applications (full-stack solutions tailored to business needs), System Architecture (scalable infrastructure and microservices design), AI Integration (LLM pipelines, automation, and intelligent agents), Cybersecurity (vulnerability assessment, hardening, and monitoring), API Development (REST, GraphQL, and real-time WebSocket endpoints), and Cloud & DevOps (CI/CD, containerization, and cloud deployment).

--- OUR NUMBERS ---
50+ projects deployed, 8+ years running, 99.9% uptime, and 100% client satisfaction.

--- OUR PHILOSOPHY ---
SECURE_BY_DEFAULT, BUILT_TO_LAST, ZERO_SHORTCUTS, CLIENTS_NOT_CONTRACTS, EVERY_COMMIT_COUNTS, ARCHITECTED_FOR_SCALE, DEFENSE_IN_DEPTH, NO_SURPRISES_DELIVERY, CLEAN_CODE_ALWAYS, SOLUTIONS_NOT_SLOGANS, PERFORMANCE_IS_POLICY, OWNERSHIP_OVER_EGO, SHIPPED_MEANS_STABLE, DESIGNED_FOR_REALITY, PRECISION_AT_SPEED, TRUST_BUILT_DAILY, THINK_LONG_BUILD_RIGHT, SECURITY_ISN'T_OPTIONAL.

--- OUR TECH STACK ---
Languages: JavaScript, Java, Python, Go, Rust, SQL.
Frameworks: React, Next.js, Node.js, Vue, Tailwind CSS, Flask.
Infrastructure: Docker, PostgreSQL, AWS, Linux, Git, VS Code.

--- OUR PORTFOLIO ---
Here are some of the 22 projects we've built across diverse industries:

1. Loving Charmz — E-commerce for symbolic keepsake jewelry with custom storefront and seamless shopping.
2. Bettyz — Boutique website for a funky emporium in Smithers, BC featuring unique clothing, retro decor, and local artisan treasures.
3. Nexus Coffee Co. — Online ordering for specialty coffee with real-time inventory, loyalty rewards, and barista queue management.
4. Arc AI — Enterprise AI workflow automation for deploying LLM pipelines and orchestrating intelligent agents at scale.
5. Sentinel Cyber — Cybersecurity consulting with vulnerability assessments, compliance audits, and 24/7 threat monitoring.
6. Ridgepoint Realty — Modern property listings with virtual tours, mortgage calculators, and AI-powered buyer-agent matching.
7. Ironclad Fitness — Gym management with class scheduling, personal trainer booking, progress tracking, and nutrition planning.
8. Cognito Systems — IT consulting and managed services for cloud migration, DevOps automation, and enterprise integration.
9. Vertex Finance — Personal finance dashboard with budget tracking, investment analytics, and AI-powered savings.
10. Soundline Audio — Music production studio platform with collaborative DAW, sample library, and beat marketplace.
11. Medvex Health — Telehealth platform with video consultations, prescription management, and patient records.
12. Codevault Academy — Developer education with interactive coding challenges, project-based courses, and peer code reviews.
13. Wavelength — Podcast platform for recording, editing, and distributing shows with AI mastering and live streaming.
14. Terraform Studios — Indie game studio with custom engine tech, procedural generation, and real-time multiplayer.
15. Nomad — Co-living spaces for remote workers with monthly memberships and curated communities worldwide.
16. Flux Logistics — Supply chain visibility with real-time tracking, route optimization, and predictive ETAs.
17. Cortex Legal — AI-powered legal research, contract analysis, and case prediction for smarter legal strategies.
18. Ember Dining — Wood-fired restaurant with seasonal ingredients, craft cocktails, and atmospheric dining.
19. Prism Gallery — Curated marketplace for digital artists and collectors with verified authenticity and secure transactions.
20. Vanguard Ventures — Early-stage VC for founders building at the intersection of AI, infrastructure, and developer tools.
21. Synthwave Records — Independent record label for synthwave, retrowave, and dark electronic music.
22. Forge & Foundry — CNC machining, metal fabrication, and rapid prototyping from one-offs to 10,000+ production runs.

--- HOW TO REACH US ---
Visitors can reach us at indicationsmedia@protonmail.com or on Telegram at @therealdysthemix to inquire about projects, get a quote, or discuss collaboration.
We don't publish pricing — every project is scoped individually based on requirements.

--- HOW TO ANSWER ---
You are professional, knowledgeable, and speak like a senior engineer who enjoys their craft. Be concise and helpful — keep responses under 3 sentences unless the visitor asks for detail. If someone asks about pricing, timelines, or project specifics, suggest they email us at indicationsmedia@protonmail.com so we can scope it properly. Never mention other AI companies or models. You ARE Indications Media's assistant.`

              const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${nvidiaKey}`,
                },
                body: JSON.stringify({
                  model: 'mistralai/mixtral-8x22b-instruct-v0.1',
                  messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
                  temperature: 0.7,
                  max_tokens: 500,
                }),
                signal: AbortSignal.timeout(12000),
              })

              let finalResponse = response
              if (!response.ok) {
                finalResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${deepseekKey}`,
                  },
                  body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
                    temperature: 0.7,
                    max_tokens: 500,
                  }),
                  signal: AbortSignal.timeout(12000),
                })
              }

              if (!finalResponse.ok) {
                finalResponse = await fetch('https://api.featherless.ai/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${featherlessKey}`,
                  },
                  body: JSON.stringify({
                    model: 'mistralai/Mistral-Nemo-Instruct-2407',
                    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
                    temperature: 0.7,
                    max_tokens: 500,
                  }),
                  signal: AbortSignal.timeout(12000),
                })
              }

              const data = await finalResponse.json()

              if (!finalResponse.ok) {
                res.statusCode = finalResponse.status
                res.end(JSON.stringify({ error: data.error?.message || 'API error' }))
                return
              }

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                message: data.choices?.[0]?.message?.content || 'No response',
              }))
            } catch (err) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Failed to reach AI service' }))
            }
          })
        },
      },
      {
        name: 'analytics-api',
        configureServer(server) {
          server.middlewares.use('/api/analytics', async (req, res) => {
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

            if (req.method === 'OPTIONS') {
              res.statusCode = 200
              res.end()
              return
            }

            if (req.method === 'POST') {
              let body = ''
              for await (const chunk of req) body += chunk
              try {
                const { type, page, meta } = JSON.parse(body)
                if (!type || !page) {
                  res.statusCode = 400
                  res.end(JSON.stringify({ error: 'type and page required' }))
                  return
                }
                const ip = (req.headers['x-forwarded-for']?.split(',')[0]?.trim() || '127.0.0.1').replace(/::ffff:/, '')
                const country = req.headers['x-vercel-ip-country'] || 'US'
                const event = {
                  id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
                  type, page, country, ip,
                  userAgent: req.headers['user-agent'] || '',
                  timestamp: new Date().toISOString(),
                  meta: meta || {},
                }

                // Update both stores
                const events = getLocalEvents()
                const counters = getLocalCounters()

                events.push(event)
                const cutoff = Date.now() - RETENTION_MS
                const filtered = events.filter(e => new Date(e.timestamp).getTime() > cutoff)
                const trimmed = filtered.length > MAX_RAW_EVENTS ? filtered.slice(filtered.length - MAX_RAW_EVENTS) : filtered

                updateCounters(counters, event)

                saveLocalCounters(counters)
                saveLocalEvents(trimmed)

                res.statusCode = 201
                res.end(JSON.stringify({ ok: true }))
              } catch {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'Invalid JSON' }))
              }
              return
            }

            if (req.method === 'GET') {
              const auth = req.headers.authorization?.replace('Bearer ', '')
              const pwd = new URL(req.url, 'http://localhost').searchParams.get('password')
              if (auth !== env.ADMIN_PASSWORD && pwd !== env.ADMIN_PASSWORD) {
                res.statusCode = 401
                res.end(JSON.stringify({ error: 'Unauthorized' }))
                return
              }

              const events = getLocalEvents()
              const counters = getLocalCounters()
              const pageviews = events.filter(e => e.type === 'pageview')
              const interactions = events.filter(e => e.type === 'interaction')

              const totalVisits = counters.totalPageviews || pageviews.length
              const uniqueVisitors = Object.keys(counters.uniqueVisitors || {}).length || new Set(pageviews.map(e => e.ip)).size

              const ipCounts = {}
              pageviews.forEach(e => { ipCounts[e.ip] = (ipCounts[e.ip] || 0) + 1 })
              const bouncers = Object.values(ipCounts).filter(c => c === 1).length
              const bounceRate = uniqueVisitors > 0 ? Math.round((bouncers / uniqueVisitors) * 100) : 0

              const now = Date.now()
              const hourlyTraffic = []
              for (let i = 23; i >= 0; i--) {
                const h = new Date(now - i * 3600000).getHours()
                const hourStart = new Date(now - i * 3600000)
                const count = pageviews.filter(e => {
                  const t = new Date(e.timestamp).getTime()
                  return t >= hourStart.getTime() && t < hourStart.getTime() + 3600000
                }).length
                hourlyTraffic.push({ hour: `${String(h).padStart(2, '0')}:00`, visits: count })
              }

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

              const geo = Object.entries(counters.geo || {})
                .map(([code, count]) => ({
                  code, country: code, visits: count,
                  pct: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0,
                }))
                .sort((a, b) => b.visits - a.visits).slice(0, 20)

              const pageAnalytics = Object.entries(counters.pages || {})
                .map(([page, views]) => ({ page, views }))
                .sort((a, b) => b.views - a.views)

              const interactionBreakdown = Object.entries(counters.interactions || {})
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)

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

              const recent = events.slice(-30).reverse().map(e => ({
                type: e.type, page: e.page, country: e.country, name: e.meta?.name || null, ts: e.timestamp,
              }))

              res.statusCode = 200
              res.end(JSON.stringify({
                totalVisits, uniqueVisitors, bounceRate, avgDuration,
                geo, hourlyTraffic, dailyTraffic, pageAnalytics, interactionBreakdown,
                recent, totalEvents: events.length,
                countersFirstEvent: counters.firstEventAt,
                countersLastEvent: counters.lastEventAt,
              }))
              return
            }

            res.statusCode = 405
            res.end(JSON.stringify({ error: 'Method not allowed' }))
          })
        },
      },
    ],
  }
})
