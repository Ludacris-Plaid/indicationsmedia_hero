import { useState, useEffect } from 'react'
import BlogModal from './BlogModal'
import fallbackPosts from '../data/posts'

const CATEGORY_COLORS = {
  SECURITY: '#ff3366',
  CRYPTO: '#FF6600',
  AI: '#00ccff',
}

export default function BlogFeed({ isVisible }) {
  const [selectedPost, setSelectedPost] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data)
        } else {
          setPosts(fallbackPosts)
        }
        setLoading(false)
      })
      .catch(() => {
        setPosts(fallbackPosts)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <style>{`
        .blog-feed-scroll::-webkit-scrollbar { width: 4px }
        .blog-feed-scroll::-webkit-scrollbar-track { background: transparent }
        .blog-feed-scroll::-webkit-scrollbar-thumb { background: rgba(0, 204, 255, 0.2); border-radius: 2px }
        .blog-feed-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 204, 255, 0.4) }
      `}</style>
      <div style={{
        padding: '20px',
        borderRadius: '2px',
        border: '1px solid rgba(0, 204, 255, 0.2)',
        background: 'rgba(0, 204, 255, 0.02)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
        transition: 'all 0.8s ease 0.6s',
      }}>
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '10px',
          color: '#00ccff',
          letterSpacing: '0.1em',
          marginBottom: '16px',
          textTransform: 'uppercase',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          {'// INTEL_FEED'}
          <span style={{ color: 'rgba(0, 204, 255, 0.4)' }}>
            {loading ? 'LOADING...' : `${posts.length}_entries`}
          </span>
        </div>

        <div className="blog-feed-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '360px', overflowY: 'auto' }}>
          {loading && (
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '11px',
              color: 'rgba(0, 204, 255, 0.4)',
              textAlign: 'center',
              padding: '20px',
            }}>
              {'> FETCHING_ENTRIES...'}
            </div>
          )}
          {posts.map((post) => {
            const catColor = CATEGORY_COLORS[post.category] || '#00ff66'
            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedPost(post) }}
                style={{
                  padding: '14px',
                  border: '1px solid rgba(0, 255, 102, 0.08)',
                  borderRadius: '4px',
                  background: 'rgba(0, 255, 102, 0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = catColor
                  e.currentTarget.style.background = 'rgba(0, 255, 102, 0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.08)'
                  e.currentTarget.style.background = 'rgba(0, 255, 102, 0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '8px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: catColor,
                    padding: '2px 6px',
                    border: `1px solid ${catColor}40`,
                    borderRadius: '2px',
                    background: `${catColor}10`,
                  }}>
                    {post.category}
                  </span>
                  <span style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '9px',
                    color: 'rgba(255, 255, 255, 0.3)',
                  }}>
                    {post.date}
                  </span>
                </div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: '4px',
                }}>
                  {post.title}
                </div>
                <div style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '10px',
                  color: '#00ff66',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  {'> READ'} <span>{'->'}</span>
                </div>
              </div>
            )
          })}
          {!loading && posts.length === 0 && (
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '11px',
              color: 'rgba(0, 204, 255, 0.3)',
              textAlign: 'center',
              padding: '20px',
            }}>
              {'> NO_ENTRIES_FOUND'}
            </div>
          )}
        </div>
      </div>

      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  )
}
