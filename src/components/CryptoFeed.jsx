import { useState, useEffect } from 'react'

const COINS = [
  { id: 'bitcoin', symbol: 'BTC', color: '#f7931a' },
  { id: 'litecoin', symbol: 'LTC', color: '#bfbbbb' },
  { id: 'monero', symbol: 'XMR', color: '#ff6600' },
  { id: 'ethereum', symbol: 'ETH', color: '#627eea' },
]

export default function CryptoFeed({ isVisible }) {
  const [prices, setPrices] = useState({})
  const [lastUpdate, setLastUpdate] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = () => {
      const ids = COINS.map(c => c.id).join(',')
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`)
        .then(r => r.json())
        .then(data => {
          setPrices(data)
          const now = new Date()
          setLastUpdate(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      padding: '16px',
      borderRadius: '2px',
      border: '1px solid rgba(0, 204, 255, 0.2)',
      background: 'rgba(0, 204, 255, 0.02)',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
      transition: 'all 0.8s ease 0.7s',
    }}>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '10px',
        color: '#00ccff',
        letterSpacing: '0.1em',
        marginBottom: '14px',
        textTransform: 'uppercase',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        {'// CRYPTO_FEED'}
        <span style={{ color: 'rgba(0, 204, 255, 0.4)' }}>
          {loading ? 'LOADING...' : lastUpdate}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
      }}>
        {COINS.map((coin) => {
          const data = prices[coin.id]
          const price = data?.usd
          const change = data?.usd_24h_change
          const isUp = change > 0

          return (
            <div
              key={coin.id}
              style={{
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '4px',
                background: 'rgba(0, 0, 0, 0.2)',
              }}
            >
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: coin.color,
                marginBottom: '6px',
              }}>
                {coin.symbol}
              </div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '16px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '2px',
              }}>
                {price != null ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '—'}
              </div>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                fontWeight: 600,
                color: price != null ? (isUp ? '#00ff66' : '#ff3366') : 'rgba(255,255,255,0.3)',
              }}>
                {change != null ? `${isUp ? '+' : ''}${change.toFixed(1)}%` : '—'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
