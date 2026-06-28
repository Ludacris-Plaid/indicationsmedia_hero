const https = require('https')
const dns = require('dns')
const { promisify } = require('util')
const lookup = promisify(dns.lookup)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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

  const postData = JSON.stringify({
    model: 'deepseek-ai/deepseek-v4-flash',
    messages: [
      { role: 'system', content: 'You are the Indications Media assistant. Be concise and professional.' },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 500,
  })

  try {
    // Resolve DNS with timeout
    const address = await Promise.race([
      lookup('integrate.api.nvidia.com'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DNS_TIMEOUT')), 5000)),
    ])

    const data = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('TIMEOUT')), 10000)

      const apiReq = https.request({
        hostname: address.address,
        servername: 'integrate.api.nvidia.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Host': 'integrate.api.nvidia.com',
          Authorization: 'Bearer ' + process.env.NVIDIA_API_KEY,
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 8000,
      }, (apiRes) => {
        clearTimeout(timer)
        let body = ''
        apiRes.on('data', (c) => { body += c })
        apiRes.on('end', () => {
          try { resolve(JSON.parse(body)) }
          catch { resolve({}) }
        })
      })

      apiReq.on('timeout', () => {
        clearTimeout(timer)
        apiReq.destroy()
        reject(new Error('TIMEOUT'))
      })
      apiReq.on('error', (e) => {
        clearTimeout(timer)
        reject(e)
      })
      apiReq.write(postData)
      apiReq.end()
    })

    if (data.error) {
      return res.status(400).json({ error: data.error.message || 'API error' })
    }

    return res.status(200).json({
      message: data.choices?.[0]?.message?.content || 'No response',
    })
  } catch (err) {
    if (err.message === 'TIMEOUT' || err.message === 'DNS_TIMEOUT') {
      return res.status(504).json({ error: 'AI service timeout' })
    }
    return res.status(500).json({ error: err.message || 'Internal error' })
  }
}
