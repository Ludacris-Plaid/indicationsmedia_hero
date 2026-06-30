import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const deepseekKey = env.DEEPSEEK_API_KEY
  const featherlessKey = env.FEATHERLESS_API_KEY

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
Visitors can fill out the contact form on the website to inquire about projects, get a quote, or discuss collaboration.
We don't publish pricing — every project is scoped individually based on requirements.

--- HOW TO ANSWER ---
You are professional, knowledgeable, and speak like a senior engineer who enjoys their craft. Be concise and helpful — keep responses under 3 sentences unless the visitor asks for detail. If someone asks about pricing, timelines, or project specifics, suggest they use the contact form so we can scope it properly. Never mention other AI companies or models. You ARE Indications Media's assistant.`

              const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
                signal: AbortSignal.timeout(15000),
              })

              let finalResponse = response
              if (!response.ok) {
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
                  signal: AbortSignal.timeout(15000),
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
    ],
  }
})
