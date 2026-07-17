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

  const vercelToken = process.env.VERCEL_TOKEN
  if (!vercelToken) {
    return res.status(200).json({
      deploys: [],
      note: 'VERCEL_TOKEN not set — deploy history unavailable',
    })
  }

  try {
    // Fetch deploys for the indicationsmedia project
    const projectId = 'prj_rck3nuVpwYqMM7ZU8VIUThtuY1UR'
    const url = `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=20&target=production`

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${vercelToken}` },
    })

    if (!response.ok) {
      return res.status(200).json({
        deploys: [],
        note: `Vercel API returned ${response.status}`,
      })
    }

    const data = await response.json()
    const deploys = (data.deployments || []).map(d => ({
      id: d.uid,
      url: d.url,
      state: d.state, // QUEUED, BUILDING, READY, ERROR, CANCELED
      createdAt: d.createdAt,
      readyState: d.readyState,
      target: d.target,
      alias: d.alias?.[0] || null,
      branch: d.meta?.githubCommitRef || d.meta?.branch || 'main',
      message: d.meta?.githubCommitMessage || d.meta?.commitMessage || null,
      author: d.meta?.githubCommitAuthorName || null,
      orgId: d.orgId,
    }))

    return res.status(200).json({ deploys })
  } catch (err) {
    return res.status(200).json({
      deploys: [],
      note: 'Failed to fetch deploy history',
    })
  }
}
