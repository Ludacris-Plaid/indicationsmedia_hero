const https = require('https')

module.exports = async (req, res) => {
  const results = {
    hasApiKey: !!process.env.NVIDIA_API_KEY,
    keyPrefix: (process.env.NVIDIA_API_KEY || '').substring(0, 10),
    nodeVersion: process.version,
  }

  // Test outbound to known-good URL
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('TIMEOUT')), 6000)
      const r = https.get('https://httpbin.org/ip', (resp) => {
        clearTimeout(timer)
        let body = ''
        resp.on('data', (c) => { body += c })
        resp.on('end', () => {
          results.outbound = { ok: true, status: resp.statusCode, data: body.substring(0, 100) }
          resolve()
        })
      })
      r.on('error', (e) => {
        clearTimeout(timer)
        results.outbound = { ok: false, error: e.message }
        resolve()
      })
    })
  } catch (e) {
    results.outbound = { ok: false, error: e.message }
  }

  // Test outbound to NVIDIA
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('TIMEOUT')), 6000)
      const r = https.get('https://integrate.api.nvidia.com/v1/models', {
        headers: { Authorization: 'Bearer ' + process.env.NVIDIA_API_KEY },
      }, (resp) => {
        clearTimeout(timer)
        let body = ''
        resp.on('data', (c) => { body += c })
        resp.on('end', () => {
          results.nvidia = { ok: true, status: resp.statusCode, data: body.substring(0, 100) }
          resolve()
        })
      })
      r.on('error', (e) => {
        clearTimeout(timer)
        results.nvidia = { ok: false, error: e.message }
        resolve()
      })
    })
  } catch (e) {
    results.nvidia = { ok: false, error: e.message }
  }

  return res.status(200).json(results)
}
