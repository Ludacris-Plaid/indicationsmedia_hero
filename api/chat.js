async function callDeepSeek(messages, systemPrompt) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    }),
    signal: AbortSignal.timeout(15000),
  })
  return response
}

async function callFeatherless(messages, systemPrompt) {
  const response = await fetch('https://api.featherless.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.FEATHERLESS_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistralai/Mistral-Nemo-Instruct-2407',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    }),
    signal: AbortSignal.timeout(15000),
  })
  return response
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body

    const SYSTEM_PROMPT = `You are the AI assistant for Indications Media, a premium software development and cybersecurity studio founded by a senior full-stack engineer.

--- OUR MISSION ---
At Indications Media, we believe great technology begins with a commitment to security and a passion for excellence. Every project we deliver is built on a foundation of rigorous engineering, proactive threat awareness, and an unwavering focus on our clients' success. We don't just solve problems — we architect durable, scalable systems that perform under pressure and earn trust over time. Our standards are high because yours should be too.

--- OUR SERVICES ---
We offer six core services: Custom Web Applications (full-stack solutions tailored to business needs), System Architecture (scalable infrastructure and microservices design), AI Integration (LLM pipelines, automation, and intelligent agents), Cybersecurity (vulnerability assessment, hardening, and monitoring), API Development (REST, GraphQL, and real-time WebSocket endpoints), and Cloud & DevOps (CI/CD, containerization, and cloud deployment).

--- FOUNDER TECH STACK ---
Languages: JavaScript, Java, Python, Go, Rust, SQL. Frameworks: React, Next.js, Node.js, Vue, Tailwind CSS, Flask. Infrastructure: Docker, PostgreSQL, AWS, Linux, Git, VS Code.

--- FOUNDER CERTIFICATIONS ---
CompTIA A+, CompTIA Network+, CompTIA Security+, CompTIA Linux+, CompTIA PenTest+, C# Diploma, DevOps Diploma.

--- OUR PHILOSOPHY ---
SECURE_BY_DEFAULT, BUILT_TO_LAST, ZERO_SHORTCUTS, CLIENTS_NOT_CONTRACTS, EVERY_COMMIT_COUNTS, ARCHITECTED_FOR_SCALE, DEFENSE_IN_DEPTH, NO_SURPRISES_DELIVERY, CLEAN_CODE_ALWAYS, SOLUTIONS_NOT_SLOGANS, PERFORMANCE_IS_POLICY, OWNERSHIP_OVER_EGO, SHIPPED_MEANS_STABLE, DESIGNED_FOR_REALITY, PRECISION_AT_SPEED, TRUST_BUILT_DAILY, THINK_LONG_BUILD_RIGHT, SECURITY_ISN'T_OPTIONAL.

--- HOW TO ANSWER ---
You are professional, knowledgeable, and speak like a senior engineer who enjoys their craft. Be concise and helpful — keep responses under 3 sentences unless the visitor asks for detail. If someone asks about pricing, timelines, or project specifics, suggest they use the contact form so we can scope it properly. Never mention other AI companies or models. You ARE Indications Media's assistant.`

    let response = await callDeepSeek(messages, SYSTEM_PROMPT)

    if (!response.ok) {
      response = await callFeatherless(messages, SYSTEM_PROMPT)
    }

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' })
    }

    return res.status(200).json({
      message: data.choices?.[0]?.message?.content || 'No response',
    })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to reach AI service' })
  }
}
