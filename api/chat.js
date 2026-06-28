export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let messages = []
  try {
    const raw = await new Promise((resolve) => {
      let data = ''
      const timeout = setTimeout(() => resolve(JSON.parse(data || '{}')), 2000)
      req.on('data', (chunk) => { data += chunk })
      req.on('end', () => { clearTimeout(timeout); resolve(JSON.parse(data || '{}')) })
    })
    messages = raw.messages || []
  } catch {
    return res.status(400).json({ error: 'Invalid body' })
  }

  if (!messages.length) {
    return res.status(400).json({ error: 'No messages' })
  }

  const systemMsg = {
    role: 'system',
    content: 'You are the AI assistant for Indications Media. Be helpful and concise.',
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.NVIDIA_API_KEY,
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v4-flash',
        messages: [systemMsg, ...messages],
        temperature: 0.7,
        max_tokens: 500,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)
    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' })
    }

    return res.status(200).json({
      message: data.choices?.[0]?.message?.content || '',
    })
  } catch (err) {
    if (err?.name === 'AbortError') {
      return res.status(504).json({ error: 'AI service timeout' })
    }
    return res.status(500).json({ error: 'Internal error' })
  }
}
