import { useState } from 'react'
import posts from '../data/posts'
import BlogModal from './BlogModal'

const CATEGORY_COLORS = {
  SECURITY: '#ff3366',
  CRYPTO: '#FF6600',
  AI: '#00ccff',
}

export default function BlogFeed({ isVisible }) {
  const [selectedPost, setSelectedPost] = useState(null)
  const latest = posts.slice(0, 5)

  return (
    <>
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
          <span style={{ color: 'rgba(0, 204, 255, 0.4)' }}>{latest.length}_latest</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {latest.map((post) => {
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
        </div>
      </div>

      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  )
}
