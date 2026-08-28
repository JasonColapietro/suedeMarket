import { ImageResponse } from 'next/og'

export const alt = 'suedeMarket — Musical Instrument Marketplace'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, #0f0f14 0%, #1a1a22 58%, #312e81 100%)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          padding: '72px 84px',
          width: '100%',
        }}
      >
        <div style={{ color: '#a5b4fc', display: 'flex', fontSize: 30, fontWeight: 700 }}>
          SUEDE LABS AI
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26, maxWidth: 980 }}>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, letterSpacing: '-0.04em' }}>
            suedeMarket
          </div>
          <div style={{ color: '#c7d2fe', display: 'flex', fontSize: 44 }}>
            Musical instruments, built for agents and humans.
          </div>
          <div style={{ color: '#a1a1aa', display: 'flex', fontSize: 28 }}>
            Prelaunch marketplace preview
          </div>
        </div>
      </div>
    ),
    size,
  )
}
