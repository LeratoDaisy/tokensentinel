import { useEffect, useState } from 'react'
// SECURITY: hashId masks the real account number; recordIsIntact checks
// the incident hasn't been altered since it was created (see useSimulation.js)
import { hashId, recordIsIntact } from '../utils/security.js'

// SECURITY: small badge that proves a record is untouched.
// Shows nothing until useSimulation.js is updated to add incident.integrityHash —
// once that's wired in, this badge starts showing ✓ Verified / ⚠ Tampered for real.
function IntegrityBadge({ incident }) {
  const [state, setState] = useState('checking')

  useEffect(() => {
    if (!incident.integrityHash) {
      setState('unsigned')
      return
    }
    let cancelled = false
    recordIsIntact(incident).then((ok) => {
      if (!cancelled) setState(ok ? 'verified' : 'tampered')
    })
    return () => {
      cancelled = true
    }
  }, [incident])

  if (state === 'unsigned') return null
  if (state === 'checking') return <span style={{ color: 'var(--text-3)', fontSize: 11.5 }}>checking…</span>
  if (state === 'tampered')
    return <span style={{ color: '#F2542D', fontSize: 11.5 }}>⚠ tampered</span>
  return <span style={{ color: '#2FBF9A', fontSize: 11.5 }}>✓ verified</span>
}

export default function IncidentsTable({ incidents, onUpdate, vertical }) {
  const openCount = incidents.filter((i) => i.status === 'open').length
  const entity = vertical.entityLabel[0].toUpperCase() + vertical.entityLabel.slice(1)
  const account = vertical.accountLabel[0].toUpperCase() + vertical.accountLabel.slice(1)

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Flagged incidents</h2>
        <span className="tag">{openCount} open</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>{entity}</th>
            <th>{account}</th>
            <th>Pattern detected</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Integrity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr key={inc.id}>
              <td className="mono">{inc.id}</td>
              <td className="mono">{inc.operator}</td>
              {/* SECURITY: was {inc.accountId} — now shows a masked code instead of the real ID */}
              <td className="mono">{hashId(inc.accountId)}</td>
              <td>
                {inc.pattern}{' '}
                <span style={{ color: 'var(--text-3)', fontSize: 11.5 }}>· {inc.depot}</span>
              </td>
              <td>
                <span className={'badge ' + inc.severity}>{inc.severity}</span>
              </td>
              <td>
                <span className={'status-pill ' + inc.status}>{inc.status}</span>
              </td>
              <td>
                <IntegrityBadge incident={inc} />
              </td>
              <td>
                <div className="row-actions">
                  <button
                    className={'btn' + (inc.status !== 'open' ? ' done' : '')}
                    onClick={() => onUpdate(inc.id, 'investigating')}
                  >
                    Investigate
                  </button>
                  <button
                    className={'btn primary' + (inc.status === 'blocked' ? ' done' : '')}
                    onClick={() => onUpdate(inc.id, 'blocked')}
                  >
                    Block
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
