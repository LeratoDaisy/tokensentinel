import { useEffect, useRef } from 'react'

export default function VolumeChart({ chartPoints, vertical }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)
    if (chartPoints.length === 0) return

    const max = Math.max(...chartPoints.map((p) => p.amt)) * 1.1
    const barW = w / 40
    const gap = 3

    ctx.strokeStyle = '#1B252D'
    ctx.lineWidth = 1
    for (let i = 1; i < 4; i++) {
      const y = h - (h / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    chartPoints.forEach((p, i) => {
      const x = i * barW
      const barH = Math.max(2, (p.amt / max) * (h - 10))
      ctx.fillStyle = p.anomaly ? '#F2542D' : '#2FBF9A'
      ctx.globalAlpha = p.anomaly ? 1 : 0.55
      ctx.fillRect(x, h - barH, barW - gap, barH)
    })
    ctx.globalAlpha = 1
  }, [chartPoints])

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Volume by {vertical.entityLabel}, last 40 events</h2>
        <span className="tag">flagged in red</span>
      </div>
      <div className="chart-wrap">
        <canvas ref={canvasRef} width={480} height={260} />
        <div className="legend">
          <span>
            <i style={{ background: '#2FBF9A' }} />
            within baseline
          </span>
          <span>
            <i style={{ background: '#F2542D' }} />
            anomalous
          </span>
        </div>
      </div>
    </div>
  )
}
