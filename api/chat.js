const https = require('https')

module.exports = async (req, res) => {
  // Simple hardcoded test — does the function infrastructure even work?
  const postData = JSON.stringify({
    model: 'deepseek-ai/deepseek-v4-flash',
    messages: [
      { role: 'system', content: 'Say exactly "ok".' },
      { role: 'user', content: 'test' },
    ],
    temperature: 0,
    max_tokens: 10,
  })

  try {
    const data = await new Promise((resolve, reject) => {
      const apiReq = https.request({
        hostname: 'integrate.api.nvidia.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.NVIDIA_API_KEY,
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 5000,
        family: 4,
      }, (apiRes) => {
        let body = ''
        apiRes.on('data', (c) => { body += c })
        apiRes.on('end', () => {
          try { resolve(JSON.parse(body)) }
          catch { resolve({}) }
        })
      })

      apiReq.on('timeout', () => { apiReq.destroy(); reject(new Error('TIMEOUT')) })
      apiReq.on('error', (e) => reject(e))
      apiReq.write(postData)
      apiReq.end()
    })

    return res.status(200).json({ ok: true, message: data.choices?.[0]?.message?.content })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}
