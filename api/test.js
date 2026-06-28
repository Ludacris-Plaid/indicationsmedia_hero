export default async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    hasApiKey: !!process.env.NVIDIA_API_KEY,
    keyPrefix: process.env.NVIDIA_API_KEY?.substring(0, 10) || 'not set',
    nodeVersion: process.version,
  })
}
