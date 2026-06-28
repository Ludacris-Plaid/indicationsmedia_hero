import { useState, useRef, useEffect, useCallback } from 'react'

export default function ChatBot({ isVisible }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ask me anything about Indications Media.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const updatedMessages = messages.concat(userMsg)
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
        }),
      })

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message || data.error || 'No response' },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div style={{
      borderRadius: '2px',
      border: '1px solid rgba(0, 255, 102, 0.1)',
      background: 'rgba(0, 0, 0, 0.3)',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
      transition: 'all 0.8s ease 0.7s',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        padding: '10px 14px',
        background: 'rgba(0, 255, 102, 0.04)',
        border: 'none',
        borderBottom: '1px solid rgba(0, 255, 102, 0.08)',
        color: '#00ff66',
        fontFamily: "'Courier New', monospace",
        fontSize: '10px',
        letterSpacing: '0.08em',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>{'// AI_ASSISTANT'}</span>
        <span style={{ color: 'rgba(0, 255, 102, 0.3)', fontSize: '9px' }}>
          {'ONLINE'}
        </span>
      </div>

      {/* Chat body */}
      <div>
        <div
          ref={listRef}
          style={{
            height: '200px',
            overflowY: 'auto',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {messages.map((msg, i) => (
            <div key={i} style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '10px',
              lineHeight: 1.55,
              color: msg.role === 'user'
                ? 'rgba(0, 204, 255, 0.7)'
                : 'rgba(255, 255, 255, 0.55)',
            }}>
              <span style={{
                color: msg.role === 'user'
                  ? '#00ccff'
                  : '#00ff66',
                fontWeight: 700,
              }}>
                {msg.role === 'user' ? '> ' : '$ '}
              </span>
              {msg.content}
            </div>
          ))}

          {loading && (
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '10px',
              color: 'rgba(0, 255, 102, 0.3)',
            }}>
              <span style={{ color: '#00ff66', fontWeight: 700 }}>{'$ '}</span>
              <span className="blink">{'▌'}</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{
          display: 'flex',
          borderTop: '1px solid rgba(0, 255, 102, 0.06)',
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontFamily: "'Courier New', monospace",
              fontSize: '10px',
              outline: 'none',
              letterSpacing: '0.03em',
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              padding: '10px 14px',
              background: 'transparent',
              border: 'none',
              borderLeft: '1px solid rgba(0, 255, 102, 0.06)',
              color: loading || !input.trim()
                ? 'rgba(0, 255, 102, 0.15)'
                : '#00ff66',
              fontFamily: "'Courier New', monospace",
              fontSize: '10px',
              cursor: loading || !input.trim() ? 'default' : 'pointer',
              transition: 'color 0.2s ease',
              outline: 'none',
              letterSpacing: '0.05em',
            }}
          >
            {'SEND'}
          </button>
        </div>
      </div>
    </div>
  )
}
