import { fmtR } from '../hooks/useSimulation.js'

export default function StatTiles({ stats, vertical }) {
  const unit = vertical.unitLabelPlural[0].toUpperCase() + vertical.unitLabelPlural.slice(1)

  return (
    <div className="stats">
      <div className="stat">
        <div className="label">
          {unit} {vertical.actionVerb} · today
        </div>
        <div className="value">{stats.issuedToday}</div>
        <div className="delta">across {vertical.entityLabelPlural}</div>
      </div>
      <div className="stat">
        <div className="label">Total value issued</div>
        <div className="value">{fmtR(stats.valueToday)}</div>
        <div className="delta">{vertical.tagline.toLowerCase()}, all locations</div>
      </div>
      <div className="stat alarm">
        <div className="label">Flagged events · 24h</div>
        <div className="value">{stats.flagsToday}</div>
        <div className="delta">{stats.flagsToday ? 'auto-escalated to incidents' : 'no anomalies yet'}</div>
      </div>
      <div className="stat safe">
        <div className="label">Est. loss intercepted</div>
        <div className="value">{fmtR(stats.lossIntercepted)}</div>
        <div className="delta">flagged before settlement</div>
      </div>
    </div>
  )
}
