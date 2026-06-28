module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Read request body
  let messages = []
  try {
    const raw = await new Promise((resolve) => {
      let data = ''
      const fail = setTimeout(() => resolve('{}'), 2000)
      req.on('data', (c) => { data += c })
      req.on('end', () => { clearTimeout(fail); resolve(data || '{}') })
    })
    messages = JSON.parse(raw).messages || []
  } catch {
    return res.status(400).json({ error: 'Invalid body' })
  }

  if (!messages.length) {
    return res.status(400).json({ error: 'No messages' })
  }

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.NVIDIA_API_KEY,
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v4-flash',
        messages: [
          { role: 'system', content: 'You are Indications Media AI assistant. Be concise.' },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' })
    }

    return res.status(200).json({
      message: data.choices?.[0]?.message?.content || '',
    })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal error' })
  }
}
