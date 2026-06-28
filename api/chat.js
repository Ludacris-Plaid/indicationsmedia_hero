import https from 'node:https'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let messages = []
  try {
    const raw = await new Promise((resolve) => {
      let data = ''
      const timeout = setTimeout(() => {
        try { resolve(JSON.parse(data || '{}')) }
        catch { resolve({}) }
      }, 2000)
      req.on('data', (chunk) => { data += chunk })
      req.on('end', () => {
        clearTimeout(timeout)
        try { resolve(JSON.parse(data || '{}')) }
        catch { resolve({}) }
      })
    })
    messages = raw.messages || []
  } catch {
    return res.status(400).json({ error: 'Invalid body' })
  }

  if (!messages.length) {
    return res.status(400).json({ error: 'No messages' })
  }

  const postData = JSON.stringify({
    model: 'deepseek-ai/deepseek-v4-flash',
    messages: [
      { role: 'system', content: 'You are the AI assistant for Indications Media, a premium software development and cybersecurity studio. Be professional, helpful, and concise.' },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 500,
  })

  const apiKey = process.env.NVIDIA_API_KEY

  try {
    const aiResponse = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'integrate.api.nvidia.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 10000,
      }

      const apiReq = https.request(options, (apiRes) => {
        let body = ''
        apiRes.on('data', (chunk) => { body += chunk })
        apiRes.on('end', () => {
          try { resolve(JSON.parse(body)) }
          catch { resolve({}) }
        })
      })

      apiReq.on('timeout', () => {
        apiReq.destroy()
        reject(new Error('TIMEOUT'))
      })

      apiReq.on('error', (e) => reject(e))
      apiReq.write(postData)
      apiReq.end()
    })

    if (aiResponse.error) {
      return res.status(400).json({ error: aiResponse.error.message || 'API error' })
    }

    return res.status(200).json({
      message: aiResponse.choices?.[0]?.message?.content || 'No response',
    })
  } catch (err) {
    if (err.message === 'TIMEOUT') {
      return res.status(504).json({ error: 'AI service timeout' })
    }
    return res.status(500).json({ error: 'Internal error' })
  }
}
