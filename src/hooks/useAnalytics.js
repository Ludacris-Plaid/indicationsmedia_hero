import { useEffect, useCallback } from 'react'

export default function useAnalytics() {
  const record = useCallback(async (type, page, meta = {}) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, page, meta }),
        keepalive: true,
      })
    } catch {
      // silent fail — analytics should never break the UI
    }
  }, [])

  useEffect(() => {
    record('pageview', window.location.pathname)

    const handleClick = (e) => {
      const el = e.target.closest('a, button, [data-track]')
      if (!el) return
      const name = el.dataset.track || el.textContent?.trim().slice(0, 40) || 'click'
      record('interaction', window.location.pathname, { name, tag: el.tagName })
    }

    const handleScroll = () => {
      const pct = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      if (pct > 0 && pct % 25 === 0) {
        record('interaction', window.location.pathname, { name: `scroll_${pct}%` })
      }
    }

    document.addEventListener('click', handleClick, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [record])

  return { record }
}
