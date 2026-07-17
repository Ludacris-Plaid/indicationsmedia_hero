import { useState, useRef, useEffect } from 'react'
import AdminStats from '../components/AdminStats'
import AdminOps from '../components/AdminOps'

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
  const [form, setForm] = useState({ title: '', category: 'SECURITY', excerpt: '', content: '', image: '' })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const [adminTab, setAdminTab] = useState('analytics')
  const [editingPost, setEditingPost] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', category: 'SECURITY', excerpt: '', content: '', image: '' })
  const [editSending, setEditSending] = useState(false)
  const [editResult, setEditResult] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
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
    if (authed) loadPosts()
  }, [authed])

  const loadPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      setRecentPosts(data)
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
    if (!form.title || !form.content || !form.image) return
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
        setForm({ title: '', category: 'SECURITY', excerpt: '', content: '', image: '' })
        loadPosts()
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

  const openEdit = (post) => {
    setEditingPost(post)
    setEditForm({
      title: post.title,
      category: post.category,
      excerpt: post.excerpt || '',
      content: post.content,
      image: post.image,
      color: post.color || '',
    })
    setEditResult(null)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editForm.title || !editForm.content || !editForm.image) return
    setEditSending(true)
    setEditResult(null)
    try {
      const res = await fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ id: editingPost.id, ...editForm }),
      })
      if (res.ok) {
        setEditResult({ ok: true })
        loadPosts()
        setTimeout(() => {
          setEditingPost(null)
          setEditResult(null)
        }, 1200)
      } else {
        const err = await res.json()
        setEditResult({ ok: false, error: err.error })
      }
    } catch {
      setEditResult({ ok: false, error: 'Connection failed' })
    } finally {
      setEditSending(false)
    }
  }

  const handleDelete = async (post) => {
    try {
      const res = await fetch(`/api/posts?id=${post.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${password}`,
        },
      })
      if (res.ok) {
        setDeleteConfirm(null)
        loadPosts()
      }
    } catch {}
  }

  const filteredPosts = searchQuery
    ? recentPosts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentPosts

  return (
    <div style={{
      height: '100dvh',
      background: '#030806',
      padding: '20px',
      overflowY: 'auto',
      cursor: 'default',
    }}>
      <style>{`
        html, html *, html *::before, html *::after { cursor: default !important; }
        html a, html button, html input, html textarea, html select, html label,
        html [role="link"], html [role="button"] { cursor: pointer !important; }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes glitchFlicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 8px rgba(0,255,102,0.3); } 50% { box-shadow: 0 0 20px rgba(0,255,102,0.6); } }
        @keyframes slideIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
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
              marginBottom: '16px', padding: '10px 14px',
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

            {/* Tab Navigation */}
            <div style={{
              display: 'flex', gap: '4px', marginBottom: '24px',
              borderBottom: '1px solid rgba(0, 255, 102, 0.1)',
              paddingBottom: '0',
            }}>
              {[
                { key: 'posts', label: 'POSTS', icon: '>' },
                { key: 'create', label: 'CREATE', icon: '+' },
                { key: 'analytics', label: 'ANALYTICS', icon: '◆' },
                { key: 'ops', label: 'OPS', icon: '◉' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setAdminTab(tab.key)}
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    padding: '8px 16px',
                    background: adminTab === tab.key ? 'rgba(0, 255, 102, 0.08)' : 'transparent',
                    border: '1px solid transparent',
                    borderBottom: adminTab === tab.key ? '1px solid #030806' : '1px solid transparent',
                    borderTop: adminTab === tab.key ? '1px solid rgba(0, 255, 102, 0.2)' : '1px solid transparent',
                    borderLeft: adminTab === tab.key ? '1px solid rgba(0, 255, 102, 0.2)' : '1px solid transparent',
                    borderRight: adminTab === tab.key ? '1px solid rgba(0, 255, 102, 0.2)' : '1px solid transparent',
                    borderRadius: '4px 4px 0 0',
                    color: adminTab === tab.key ? '#00ff66' : 'rgba(0, 255, 102, 0.35)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: '-1px',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                  onMouseEnter={(e) => {
                    if (adminTab !== tab.key) e.currentTarget.style.color = 'rgba(0, 255, 102, 0.6)'
                  }}
                  onMouseLeave={(e) => {
                    if (adminTab !== tab.key) e.currentTarget.style.color = 'rgba(0, 255, 102, 0.35)'
                  }}
                >
                  <span style={{ fontSize: '8px' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── POSTS TAB ── */}
            {adminTab === 'posts' && <>
            {/* Search */}
            <div style={{
              marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px',
              background: 'rgba(0, 204, 255, 0.03)',
              border: '1px solid rgba(0, 204, 255, 0.15)',
              borderRadius: '2px',
            }}>
              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                color: '#00ccff',
              }}>{'>'} SEARCH:</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="filter by title or category..."
                className="admin-input"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: "'Courier New', monospace",
                  fontSize: '11px',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '9px',
                    color: '#ff3366',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  [CLEAR]
                </button>
              )}
            </div>

            {/* All Posts */}
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
                {'> ALL_POSTS'} <span style={{ color: 'rgba(0, 204, 255, 0.4)', fontSize: '9px' }}>[{filteredPosts.length}]</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filteredPosts.map((post) => {
                  const catColor = CATEGORY_OPTIONS.find(c => c.value === post.category)?.color || '#00ff66'
                  return (
                    <div key={post.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '2px',
                      transition: 'border-color 0.2s',
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
                    >
                      {/* Category badge */}
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
                        flexShrink: 0,
                      }}>
                        {post.category}
                      </span>
                      {/* Title + date */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {post.title}
                        </div>
                        <div style={{
                          fontFamily: "'Courier New', monospace",
                          fontSize: '9px',
                          color: 'rgba(255, 255, 255, 0.2)',
                          marginTop: '2px',
                        }}>
                          id:{post.id} · {post.date}
                        </div>
                      </div>
                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        <button
                          onClick={() => openEdit(post)}
                          style={{
                            fontFamily: "'Courier New', monospace",
                            fontSize: '9px',
                            fontWeight: 700,
                            color: '#00ccff',
                            background: 'rgba(0, 204, 255, 0.08)',
                            border: '1px solid rgba(0, 204, 255, 0.2)',
                            borderRadius: '2px',
                            padding: '4px 10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            letterSpacing: '0.05em',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#00ccff'
                            e.currentTarget.style.background = 'rgba(0, 204, 255, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(0, 204, 255, 0.2)'
                            e.currentTarget.style.background = 'rgba(0, 204, 255, 0.08)'
                          }}
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(post)}
                          style={{
                            fontFamily: "'Courier New', monospace",
                            fontSize: '9px',
                            fontWeight: 700,
                            color: '#ff3366',
                            background: 'rgba(255, 51, 102, 0.08)',
                            border: '1px solid rgba(255, 51, 102, 0.2)',
                            borderRadius: '2px',
                            padding: '4px 10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            letterSpacing: '0.05em',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#ff3366'
                            e.currentTarget.style.background = 'rgba(255, 51, 102, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 51, 102, 0.2)'
                            e.currentTarget.style.background = 'rgba(255, 51, 102, 0.08)'
                          }}
                        >
                          DEL
                        </button>
                      </div>
                    </div>
                  )
                })}
                {filteredPosts.length === 0 && (
                  <div style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.3)',
                    textAlign: 'center',
                    padding: '20px',
                  }}>
                    {searchQuery ? 'No posts match your search.' : 'No posts yet. Create your first one in the CREATE tab.'}
                  </div>
                )}
              </div>
            </div>
            </>}
            {/* ── END POSTS TAB ── */}

            {/* ── CREATE TAB ── */}
            {adminTab === 'create' && <>
            <div style={{
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

                {/* Image URL */}
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
                    IMAGE_URL <span style={{ color: '#ff3366' }}>*</span>
                  </label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="admin-input"
                    required
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
                  {form.image && (
                    <div style={{
                      marginTop: '8px',
                      width: '100%',
                      height: '80px',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      border: '1px solid rgba(0, 255, 102, 0.1)',
                    }}>
                      <img
                        src={form.image}
                        alt="Preview"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          filter: 'brightness(0.7)',
                        }}
                      />
                    </div>
                  )}
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
                    disabled={sending || !form.title || !form.content || !form.image}
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: '#030806',
                      background: sending || !form.title || !form.content || !form.image
                        ? 'rgba(0, 255, 102, 0.15)'
                        : '#00ff66',
                      padding: '12px 28px',
                      borderRadius: '2px',
                      border: 'none',
                      cursor: sending || !form.title || !form.content || !form.image ? 'default' : 'pointer',
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
            </>}
            {/* ── END CREATE TAB ── */}

            {/* ── ANALYTICS TAB ── */}
            {adminTab === 'analytics' && (
              <AdminStats password={password} />
            )}
            {/* ── END ANALYTICS TAB ── */}

            {/* ── OPS TAB ── */}
            {adminTab === 'ops' && (
              <AdminOps password={password} />
            )}
            {/* ── END OPS TAB ── */}
          </div>
        )}
      </div>

      {/* ── EDIT MODAL ── */}
      {editingPost && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '640px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#0a0e0c',
            border: '1px solid rgba(0, 204, 255, 0.25)',
            borderRadius: '4px',
            padding: '24px',
            animation: 'slideIn 0.3s ease',
          }}>
            {/* Modal header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(0, 204, 255, 0.15)',
            }}>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '11px',
                fontWeight: 700,
                color: '#00ccff',
                letterSpacing: '0.12em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ width: '6px', height: '6px', background: '#00ccff', borderRadius: '50%' }} />
                {'> EDITING'} <span style={{ color: 'rgba(0, 204, 255, 0.4)' }}>id:{editingPost.id}</span>
              </div>
              <button
                onClick={() => { setEditingPost(null); setEditResult(null) }}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ff3366'
                  e.currentTarget.style.color = '#ff3366'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'
                }}
              >
                [X] CLOSE
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Title */}
              <div>
                <label style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '9px',
                  color: 'rgba(0, 204, 255, 0.5)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}>TITLE</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(0, 204, 255, 0.03)',
                    border: '1px solid rgba(0, 204, 255, 0.15)',
                    borderRadius: '2px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '15px',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#00ccff'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0, 204, 255, 0.15)'}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '9px',
                  color: 'rgba(0, 204, 255, 0.5)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}>CATEGORY</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, category: opt.value })}
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        padding: '8px 16px',
                        borderRadius: '2px',
                        border: `1px solid ${editForm.category === opt.value ? opt.color : 'rgba(255,255,255,0.1)'}`,
                        background: editForm.category === opt.value ? `${opt.color}15` : 'transparent',
                        color: editForm.category === opt.value ? opt.color : 'rgba(255,255,255,0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {opt.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '9px',
                  color: 'rgba(0, 204, 255, 0.5)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}>IMAGE_URL <span style={{ color: '#ff3366' }}>*</span></label>
                <input
                  type="url"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  required
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(0, 204, 255, 0.03)',
                    border: '1px solid rgba(0, 204, 255, 0.15)',
                    borderRadius: '2px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: "'Courier New', monospace",
                    fontSize: '12px',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#00ccff'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0, 204, 255, 0.15)'}
                />
                {editForm.image && (
                  <div style={{
                    marginTop: '8px',
                    width: '100%',
                    height: '80px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 204, 255, 0.1)',
                  }}>
                    <img
                      src={editForm.image}
                      alt="Preview"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.7)' }}
                    />
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '9px',
                  color: 'rgba(0, 204, 255, 0.5)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}>EXCERPT</label>
                <input
                  type="text"
                  value={editForm.excerpt}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(0, 204, 255, 0.03)',
                    border: '1px solid rgba(0, 204, 255, 0.15)',
                    borderRadius: '2px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: "'Courier New', monospace",
                    fontSize: '12px',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#00ccff'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0, 204, 255, 0.15)'}
                />
              </div>

              {/* Content */}
              <div>
                <label style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '9px',
                  color: 'rgba(0, 204, 255, 0.5)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}>CONTENT</label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  required
                  rows={12}
                  className="admin-textarea"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(0, 204, 255, 0.03)',
                    border: '1px solid rgba(0, 204, 255, 0.15)',
                    borderRadius: '2px',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontFamily: "'Courier New', monospace",
                    fontSize: '12px',
                    lineHeight: 1.7,
                    resize: 'vertical',
                    minHeight: '180px',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#00ccff'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0, 204, 255, 0.15)'}
                />
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
                <button
                  type="submit"
                  disabled={editSending || !editForm.title || !editForm.content || !editForm.image}
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#030806',
                    background: editSending || !editForm.title || !editForm.content || !editForm.image
                      ? 'rgba(0, 204, 255, 0.15)'
                      : '#00ccff',
                    padding: '12px 28px',
                    borderRadius: '2px',
                    border: 'none',
                    cursor: editSending ? 'default' : 'pointer',
                    boxShadow: editSending ? 'none' : '0 0 20px rgba(0, 204, 255, 0.3)',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {editSending ? 'SAVING...' : 'SAVE_CHANGES'}
                  {!editSending && <span style={{ fontSize: '14px' }}>↗</span>}
                </button>

                {editResult && (
                  <div style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '11px',
                    color: editResult.ok ? '#00ff66' : '#ff3366',
                    animation: 'fadeInUp 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: editResult.ok ? '#00ff66' : '#ff3366',
                    }} />
                    {editResult.ok ? 'UPDATED' : editResult.error}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '440px',
            background: '#0a0e0c',
            border: '1px solid rgba(255, 51, 102, 0.25)',
            borderRadius: '4px',
            padding: '24px',
            animation: 'slideIn 0.3s ease',
          }}>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '11px',
              fontWeight: 700,
              color: '#ff3366',
              letterSpacing: '0.12em',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ width: '6px', height: '6px', background: '#ff3366', borderRadius: '50%' }} />
              {'> CONFIRM_DELETE'}
            </div>

            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.6,
              marginBottom: '8px',
            }}>
              Are you sure you want to delete this post?
            </div>

            <div style={{
              padding: '10px 12px',
              background: 'rgba(255, 51, 102, 0.05)',
              border: '1px solid rgba(255, 51, 102, 0.15)',
              borderRadius: '2px',
              marginBottom: '20px',
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '4px',
              }}>
                {deleteConfirm.title}
              </div>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '9px',
                color: 'rgba(255, 255, 255, 0.3)',
              }}>
                id:{deleteConfirm.id} · {deleteConfirm.category} · {deleteConfirm.date}
              </div>
            </div>

            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '10px',
              color: '#ff3366',
              marginBottom: '16px',
              padding: '8px 10px',
              background: 'rgba(255, 51, 102, 0.05)',
              border: '1px solid rgba(255, 51, 102, 0.1)',
              borderRadius: '2px',
            }}>
              ⚠ This action cannot be undone.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#fff',
                  background: '#ff3366',
                  padding: '10px 24px',
                  borderRadius: '2px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(255, 51, 102, 0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 24px rgba(255, 51, 102, 0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 16px rgba(255, 51, 102, 0.3)'}
              >
                DELETE_FOREVER
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: 'rgba(255, 255, 255, 0.4)',
                  background: 'transparent',
                  padding: '10px 24px',
                  borderRadius: '2px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
