import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'CrackIt — Crack every round. Land every offer.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Yellow glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 300,
          background: 'rgba(250, 204, 21, 0.08)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <span style={{ fontSize: 48, color: '#facc15' }}>⚡</span>
          <span style={{ fontSize: 56, fontWeight: 700, color: '#ffffff' }}>CrackIt</span>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 28,
          color: 'rgba(255,255,255,0.6)',
          marginBottom: 48,
          textAlign: 'center',
        }}>
          Crack every round. Land every offer.
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 40 }}>
          {[
            { value: '225+', label: 'DSA Questions' },
            { value: '16', label: 'Companies' },
            { value: '100%', label: 'Free' },
          ].map(stat => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: '#facc15' }}>{stat.value}</span>
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}