export const config = { runtime: 'edge' }

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let messages = []
  try {
    const body = await request.json()
    messages = body.messages || []
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!messages.length) {
    return new Response(JSON.stringify({ error: 'No messages' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (process.env.NVIDIA_API_KEY || ''),
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v4-flash',
        messages: [
          { role: 'system', content: 'You are the Indications Media assistant. Be concise and professional.' },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'API error' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({
      message: data.choices?.[0]?.message?.content || 'No response',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
