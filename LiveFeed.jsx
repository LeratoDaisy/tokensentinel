import { fmtR } from '../hooks/useSimulation.js'
// SECURITY: hides real account/meter numbers on screen
import { hashId } from '../utils/security.js'

export default function LiveFeed({ feed, vertical }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Live {vertical.unitLabel} feed</h2>
        <span className="tag">auto-updating</span>
      </div>
      <div className="feed">
        {feed.map((row) => (
          <div key={row.key} className={'feed-row' + (row.isAnomaly ? ' is-anomaly' : '')}>
            <div className="op">{row.opId}</div>
            <div className="detail">
              {row.depot}
              {/* SECURITY: was #{row.accountId} — now shows a masked code instead of the real ID */}
              <span style={{ color: 'var(--text-3)' }}> · #{hashId(row.accountId)}</span>
              {row.isAnomaly && <span className="flag-pill">{row.reason.toUpperCase()}</span>}
            </div>
            <div className="amt">{fmtR(row.amount)}</div>
            <div className="time">
              {row.offHours ? '⚠ ' : ''}
              {row.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
