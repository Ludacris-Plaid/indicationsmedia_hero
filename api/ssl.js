import tls from 'tls'
import https from 'https'

const SITES = [
  { id: 'main', name: 'indicationsmedia.com', host: 'www.indicationsmedia.com', color: '#00ff66' },
  { id: 'ai', name: 'ai.indicationsmedia.com', host: 'ai.indicationsmedia.com', color: '#00ccff' },
]

function checkSSL(host) {
  return new Promise((resolve) => {
    const start = Date.now()
    try {
      const socket = tls.connect(443, host, {
        servername: host,
        rejectUnauthorized: false,
        timeout: 10000,
      }, () => {
        const cert = socket.getPeerCertificate()
        const latency = Date.now() - start
        socket.destroy()

        if (!cert || !cert.valid_to) {
          return resolve({ valid: false, error: 'No certificate', latency })
        }

        const validFrom = new Date(cert.valid_from)
        const validTo = new Date(cert.valid_to)
        const now = new Date()
        const daysLeft = Math.ceil((validTo - now) / (1000 * 60 * 60 * 24))
        const isExpired = now > validTo
        const isExpiringSoon = daysLeft <= 30 && daysLeft > 0

        resolve({
          valid: !isExpired,
          issuer: cert.issuer?.CN || cert.issuer?.O || 'Unknown',
          subject: cert.subject?.CN || host,
          validFrom: validFrom.toISOString(),
          validTo: validTo.toISOString(),
          daysLeft,
          isExpired,
          isExpiringSoon,
          serialNumber: cert.serialNumber?.slice(0, 16),
          latency,
        })
      })

      socket.on('error', (err) => {
        resolve({ valid: false, error: err.message?.slice(0, 80), latency: Date.now() - start })
      })

      socket.on('timeout', () => {
        socket.destroy()
        resolve({ valid: false, error: 'Connection timeout', latency: Date.now() - start })
      })
    } catch (err) {
      resolve({ valid: false, error: err.message?.slice(0, 80), latency: Date.now() - start })
    }
  })
}

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default async function handler(req, res) {
  setCORS(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const results = await Promise.all(SITES.map(async (site) => {
      const ssl = await checkSSL(site.host)
      return { ...site, ...ssl }
    }))

    return res.status(200).json({ certificates: results })
  } catch (err) {
    return res.status(500).json({ error: 'SSL check failed' })
  }
}
