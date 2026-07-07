import { useState, useRef, useEffect, useCallback } from 'react'
import BlogModal from './BlogModal'
import posts from '../data/posts'
import useIsMobile from '../hooks/useIsMobile'

const CATEGORY_COLORS = {
  SECURITY: '#ff3366',
  CRYPTO: '#FF6600',
  AI: '#00ccff',
}

export default function BlogCarousel() {
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef(null)
  const sectionRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    let root = null
    let parent = el.parentElement
    while (parent) {
      if (parent.style && parent.style.overflowY === 'auto') {
        root = parent
        break
      }
      parent = parent.parentElement
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { root, threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scrollToIndex = useCallback((index) => {
    const container = scrollRef.current
    if (!container) return
    const cards = container.children
    if (!cards[index]) return
    const cardWidth = cards[index].offsetWidth
    const gap = isMobile ? 12 : 24
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth',
    })
    setActiveIndex(index)
  }, [isMobile])

  const next = useCallback(() => {
    const nextIdx = (activeIndex + 1) % posts.length
    scrollToIndex(nextIdx)
  }, [activeIndex, scrollToIndex])

  const prev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + posts.length) % posts.length
    scrollToIndex(prevIdx)
  }, [activeIndex, scrollToIndex])

  useEffect(() => {
    if (isPaused || selectedPost) return
    intervalRef.current = setInterval(next, 4000)
    return () => clearInterval(intervalRef.current)
  }, [isPaused, next, selectedPost])

  useEffect(() => {
    const handleKey = (e) => {
      if (!selectedPost) return
      if (e.key === 'Escape') setSelectedPost(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedPost])

  return (
    <section
      id="blog"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: isMobile ? '80px 0 40px' : '120px 0 80px',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div style={{
          marginBottom: '48px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#00ccff',
            marginBottom: '16px',
            display: 'block',
          }}>
            Intel Feed
          </span>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: 0,
          }}>
            Latest Briefings
          </h2>
        </div>

        {/* Carousel controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1s ease 0.3s',
        }}>
          <button
            onClick={prev}
            aria-label="Previous post"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid rgba(0, 255, 102, 0.3)',
              background: 'rgba(0, 255, 102, 0.05)',
              color: '#00ff66',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s ease',
              fontFamily: "'Courier New', monospace",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 102, 0.15)'
              e.currentTarget.style.borderColor = '#00ff66'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 102, 0.05)'
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.3)'
            }}
          >
            {'<'}
          </button>
          <button
            onClick={next}
            aria-label="Next post"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid rgba(0, 255, 102, 0.3)',
              background: 'rgba(0, 255, 102, 0.05)',
              color: '#00ff66',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s ease',
              fontFamily: "'Courier New', monospace",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 102, 0.15)'
              e.currentTarget.style.borderColor = '#00ff66'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 102, 0.05)'
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.3)'
            }}
          >
            {'>'}
          </button>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to post ${i + 1}`}
                style={{
                  width: i === activeIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: i === activeIndex ? '#00ff66' : 'rgba(0, 255, 102, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '10px',
            color: 'rgba(0, 255, 102, 0.5)',
            letterSpacing: '0.1em',
            marginLeft: 'auto',
          }}>
            {String(activeIndex + 1).padStart(2, '0')} / {String(posts.length).padStart(2, '0')}
          </span>
        </div>

        {/* Carousel track */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            display: 'flex',
            gap: isMobile ? '12px' : '24px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '16px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          {posts.map((post, index) => {
            const catColor = CATEGORY_COLORS[post.category] || '#00ff66'
            return (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedPost(post) }}
                style={{
                  flex: '0 0 auto',
                  width: isMobile ? '88vw' : '75vw',
                  maxWidth: '960px',
                  scrollSnapAlign: 'start',
                  background: 'rgba(0, 255, 102, 0.02)',
                  border: '1px solid rgba(0, 255, 102, 0.1)',
                  borderRadius: '8px',
                  padding: '28px',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = catColor
                  e.currentTarget.style.background = `rgba(${catColor === '#ff3366' ? '255,51,102' : catColor === '#FF6600' ? '255,102,0' : catColor === '#00ccff' ? '0,204,255' : '0,255,102'}, 0.04)`
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.1)'
                  e.currentTarget.style.background = 'rgba(0, 255, 102, 0.02)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Category + Date */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: catColor,
                      padding: '3px 10px',
                      border: `1px solid ${catColor}40`,
                      borderRadius: '3px',
                      background: `${catColor}10`,
                    }}>
                      {post.category}
                    </span>
                    <span style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.35)',
                      letterSpacing: '0.05em',
                    }}>
                      {post.date}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '20px',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    margin: '0 0 12px 0',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}>
                    {post.title}
                  </h3>

                  <p style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '12px',
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.5)',
                    margin: 0,
                  }}>
                    {post.excerpt}
                  </p>
                </div>

                {/* Read more */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(0, 255, 102, 0.08)',
                }}>
                  <span style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '10px',
                    color: '#00ff66',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    {'> READ_MORE'}
                  </span>
                  <span style={{ color: '#00ff66', fontSize: '10px' }}>{'->'}</span>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </section>
  )
}
