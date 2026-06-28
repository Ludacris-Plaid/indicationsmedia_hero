module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Step 1: quick test — does the function return at all?
  return res.status(200).json({ step: 1, ok: true })
}
