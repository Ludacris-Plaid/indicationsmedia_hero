import { useState, useRef, useEffect } from 'react'

const CATEGORY_OPTIONS = [
  { value: 'SECURITY', color: '#ff3366' },
  { value: 'CRYPTO', color: '#FF6600' },
  { value: 'AI', color: '#00ccff' },
]

function TerminalLine({ children, delay = 0, color = '#00ff66' }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      fontSize: '12px',
      color,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      lineHeight: 1.6,
    }}>
      {children}
    </div>
  )
}

function TypingCursor() {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const i = setInterval(() => setShow(s => !s), 530)
    return () => clearInterval(i)
  }, [])
  return <span style={{ opacity: show ? 1 : 0 }}>█</span>
}

export default function AdminPage({ onBack }) {
  const [phase, setPhase] = useState('booting')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'SECURITY', excerpt: '', content: '' })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const inputRef = useRef(null)
  const passwordRef = useRef(null)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('login'), 1200)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (phase === 'login' && passwordRef.current) passwordRef.current.focus()
  }, [phase])

  useEffect(() => {
    if (authed) loadRecent()
  }, [authed])

  const loadRecent = async () => {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      setRecentPosts(data.slice(0, 5))
    } catch {}
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password.trim()) {
      setAuthed(true)
      setPhase('dashboard')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.content) return
    setSending(true)
    setResult(null)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const post = await res.json()
        setResult({ ok: true, post })
        setForm({ title: '', category: 'SECURITY', excerpt: '', content: '' })
        loadRecent()
      } else {
        const err = await res.json()
        setResult({ ok: false, error: err.error })
      }
    } catch {
      setResult({ ok: false, error: 'Connection failed' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#030806',
      padding: '20px',
      overflowY: 'auto',
    }}>
      <style>{`
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes glitchFlicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 8px rgba(0,255,102,0.3); } 50% { box-shadow: 0 0 20px rgba(0,255,102,0.6); } }
        .admin-input:focus { outline: none; }
        .admin-input::placeholder { color: rgba(0, 255, 102, 0.2); }
        .admin-textarea:focus { outline: none; }
        .admin-textarea::placeholder { color: rgba(0, 255, 102, 0.2); }
        .admin-select option { background: #0a0e0c; color: #00ff66; }
      `}</style>

      {/* Scanline overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
        background: 'rgba(0, 255, 102, 0.15)',
        animation: 'scanline 4s linear infinite',
        pointerEvents: 'none', zIndex: 100,
      }} />

      <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px',
          borderBottom: '1px solid rgba(0, 255, 102, 0.15)',
          paddingBottom: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '9px',
              color: 'rgba(0, 255, 102, 0.4)',
              letterSpacing: '0.2em',
              marginBottom: '6px',
            }}>
              {'// INDICATIONS_MEDIA v3.2.1'}
            </div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 700,
              color: '#00ff66',
              margin: 0,
              letterSpacing: '-0.02em',
              textShadow: '0 0 30px rgba(0, 255, 102, 0.3)',
            }}>
              ADMIN_TERMINAL
            </h1>
          </div>
          <button
            onClick={onBack}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '10px',
              color: 'rgba(0, 255, 102, 0.5)',
              background: 'rgba(0, 255, 102, 0.05)',
              border: '1px solid rgba(0, 255, 102, 0.2)',
              borderRadius: '2px',
              padding: '6px 12px',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00ff66'
              e.currentTarget.style.color = '#00ff66'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.2)'
              e.currentTarget.style.color = 'rgba(0, 255, 102, 0.5)'
            }}
          >
            {'< EXIT'}
          </button>
        </div>

        {/* Boot sequence */}
        {phase === 'booting' && (
          <div style={{ padding: '40px 0' }}>
            <TerminalLine delay={0}>$ booting admin_terminal...</TerminalLine>
            <TerminalLine delay={200}>$ loading secure_module</TerminalLine>
            <TerminalLine delay={400}>$ initializing auth_gate</TerminalLine>
            <TerminalLine delay={600}>$ <span style={{ color: '#00ccff' }}>OK</span> — system ready</TerminalLine>
          </div>
        )}

        {/* Login */}
        {phase === 'login' && !authed && (
          <div style={{ animation: 'fadeInUp 0.5s ease' }}>
            <TerminalLine color="rgba(0, 255, 102, 0.6)">
              {'> ENTER ADMIN CREDENTIALS'}
            </TerminalLine>
            <form onSubmit={handleLogin} style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '14px',
                color: '#00ff66',
                fontWeight: 700,
              }}>{'$'}</span>
              <input
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="admin-input"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  background: 'rgba(0, 255, 102, 0.03)',
                  border: '1px solid rgba(0, 255, 102, 0.2)',
                  borderRadius: '2px',
                  color: '#00ff66',
                  fontFamily: "'Courier New', monospace",
                  fontSize: '14px',
                  letterSpacing: '0.1em',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#00ff66'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.2)'}
              />
              <button
                type="submit"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#030806',
                  background: '#00ff66',
                  padding: '10px 18px',
                  borderRadius: '2px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(0, 255, 102, 0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 255, 102, 0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 255, 102, 0.3)'}
              >
                AUTH
              </button>
            </form>
          </div>
        )}

        {/* Dashboard */}
        {phase === 'dashboard' && authed && (
          <div style={{ animation: 'fadeInUp 0.5s ease' }}>
            {/* Status bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '24px', padding: '10px 14px',
              background: 'rgba(0, 255, 102, 0.03)',
              border: '1px solid rgba(0, 255, 102, 0.1)',
              borderRadius: '2px',
            }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#00ff66', boxShadow: '0 0 8px #00ff66',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                color: 'rgba(0, 255, 102, 0.6)',
                letterSpacing: '0.1em',
              }}>
                SESSION_ACTIVE · {recentPosts.length}_POSTS_LOADED
              </span>
            </div>

            {/* New Post Form */}
            <div style={{
              marginBottom: '32px',
              padding: '24px',
              background: 'rgba(0, 255, 102, 0.02)',
              border: '1px solid rgba(0, 255, 102, 0.15)',
              borderRadius: '4px',
            }}>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                color: '#00ff66',
                letterSpacing: '0.15em',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ width: '6px', height: '6px', background: '#00ff66', borderRadius: '50%' }} />
                {'> NEW_ENTRY'}
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Title */}
                <div>
                  <label style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '9px',
                    color: 'rgba(0, 255, 102, 0.5)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    TITLE
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Your blog post title..."
                    className="admin-input"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(0, 255, 102, 0.03)',
                      border: '1px solid rgba(0, 255, 102, 0.15)',
                      borderRadius: '2px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '15px',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#00ff66'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.15)'}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '9px',
                    color: 'rgba(0, 255, 102, 0.5)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    CATEGORY
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, category: opt.value })}
                        style={{
                          fontFamily: "'Courier New', monospace",
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          padding: '8px 16px',
                          borderRadius: '2px',
                          border: `1px solid ${form.category === opt.value ? opt.color : 'rgba(255,255,255,0.1)'}`,
                          background: form.category === opt.value ? `${opt.color}15` : 'transparent',
                          color: form.category === opt.value ? opt.color : 'rgba(255,255,255,0.3)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: form.category === opt.value ? `0 0 12px ${opt.color}30` : 'none',
                        }}
                      >
                        {opt.value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '9px',
                    color: 'rgba(0, 255, 102, 0.5)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    EXCERPT <span style={{ color: 'rgba(0, 255, 102, 0.3)' }}>(optional — auto-generated if empty)</span>
                  </label>
                  <input
                    type="text"
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Short summary for the feed..."
                    className="admin-input"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(0, 255, 102, 0.03)',
                      border: '1px solid rgba(0, 255, 102, 0.15)',
                      borderRadius: '2px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontFamily: "'Courier New', monospace",
                      fontSize: '12px',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#00ff66'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.15)'}
                  />
                </div>

                {/* Content */}
                <div>
                  <label style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '9px',
                    color: 'rgba(0, 255, 102, 0.5)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    CONTENT
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Write your blog post here..."
                    className="admin-textarea"
                    required
                    rows={10}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(0, 255, 102, 0.03)',
                      border: '1px solid rgba(0, 255, 102, 0.15)',
                      borderRadius: '2px',
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontFamily: "'Courier New', monospace",
                      fontSize: '12px',
                      lineHeight: 1.7,
                      resize: 'vertical',
                      minHeight: '200px',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#00ff66'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.15)'}
                  />
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    type="submit"
                    disabled={sending || !form.title || !form.content}
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: '#030806',
                      background: sending || !form.title || !form.content
                        ? 'rgba(0, 255, 102, 0.15)'
                        : '#00ff66',
                      padding: '12px 28px',
                      borderRadius: '2px',
                      border: 'none',
                      cursor: sending || !form.title || !form.content ? 'default' : 'pointer',
                      boxShadow: sending ? 'none' : '0 0 20px rgba(0, 255, 102, 0.3)',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {sending ? 'PROCESSING...' : 'PUBLISH'}
                    {!sending && <span style={{ fontSize: '14px' }}>↗</span>}
                  </button>

                  {result && (
                    <div style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '11px',
                      color: result.ok ? '#00ff66' : '#ff3366',
                      animation: 'fadeInUp 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: result.ok ? '#00ff66' : '#ff3366',
                      }} />
                      {result.ok ? `POSTED: ${result.post.title}` : result.error}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Recent Posts */}
            <div style={{
              padding: '20px',
              background: 'rgba(0, 204, 255, 0.02)',
              border: '1px solid rgba(0, 204, 255, 0.15)',
              borderRadius: '4px',
            }}>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                color: '#00ccff',
                letterSpacing: '0.15em',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ width: '6px', height: '6px', background: '#00ccff', borderRadius: '50%' }} />
                {'> RECENT_ENTRIES'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentPosts.map((post) => {
                  const catColor = CATEGORY_OPTIONS.find(c => c.value === post.category)?.color || '#00ff66'
                  return (
                    <div key={post.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '2px',
                    }}>
                      <span style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: '8px',
                        fontWeight: 700,
                        color: catColor,
                        padding: '2px 6px',
                        border: `1px solid ${catColor}40`,
                        borderRadius: '2px',
                        minWidth: '60px',
                        textAlign: 'center',
                      }}>
                        {post.category}
                      </span>
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        flex: 1,
                      }}>
                        {post.title}
                      </span>
                      <span style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: '9px',
                        color: 'rgba(255, 255, 255, 0.25)',
                      }}>
                        {post.date}
                      </span>
                    </div>
                  )
                })}
                {recentPosts.length === 0 && (
                  <div style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.3)',
                    textAlign: 'center',
                    padding: '20px',
                  }}>
                    No posts yet. Create your first one above.
                  </div>
                )}
              </div>
            </div>

            {/* Bot API instructions */}
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: 'rgba(124, 58, 237, 0.03)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '4px',
            }}>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                color: '#7C3AED',
                letterSpacing: '0.15em',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ width: '6px', height: '6px', background: '#7C3AED', borderRadius: '50%' }} />
                {'> BOT_API_REFERENCE'}
              </div>
              <pre style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.5)',
                lineHeight: 1.7,
                margin: 0,
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
              }}>
{`POST /api/posts
Authorization: Bearer <ADMIN_PASSWORD>
Content-Type: application/json

{
  "title": "Post Title",
  "category": "SECURITY | CRYPTO | AI",
  "excerpt": "Short summary (optional)",
  "content": "Full blog post body..."
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
