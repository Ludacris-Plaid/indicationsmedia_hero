export default async function handler(req, res) {
  const results = {}

  // Quick self-test
  results.self = 'ok'

  // DNS resolve
  try {
    const { lookup } = await import('dns').catch(() => ({ lookup: null }))
    if (lookup) {
      const addr = await new Promise((resolve) =>
        lookup('integrate.api.nvidia.com', (err, addr) => resolve(err ? err.message : addr))
      )
      results.dns = addr
    }
  } catch (e) {
    results.dns = e.message
  }

  // Test fetch with a fast timeout
  try {
    const fast = fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.NVIDIA_API_KEY,
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v4-flash',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      }),
    })

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('FETCH_TIMEOUT')), 5000)
    )

    const response = await Promise.race([fast, timeout])
    results.fetchStatus = response.status
    results.fetchOk = response.ok
  } catch (e) {
    results.fetchError = e.message
  }

  return res.status(200).json(results)
}
