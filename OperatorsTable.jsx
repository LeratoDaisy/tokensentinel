import { fmtR } from '../hooks/useSimulation.js'

export default function OperatorsTable({ operators, vertical }) {
  const sorted = [...operators].sort((a, b) => b.riskScore - a.riskScore)
  const entity = vertical.entityLabel[0].toUpperCase() + vertical.entityLabel.slice(1)

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>{entity} risk profile</h2>
        <span className="tag">baseline learned from 90-day history</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>{entity}</th>
            <th>{vertical.locationLabel[0].toUpperCase() + vertical.locationLabel.slice(1)}</th>
            <th>Avg {vertical.unitLabelPlural} / day</th>
            <th>Avg value</th>
            <th>Deviation score</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((op) => {
            const avgAmt = op.history.length
              ? op.history.reduce((a, b) => a + b, 0) / op.history.length
              : op.baseAmt
            const risk = Math.round(op.riskScore)
            const cls = risk > 55 ? 'high' : risk > 28 ? 'med' : 'low'
            const color = risk > 55 ? '#F2542D' : risk > 28 ? '#F5A623' : '#2FBF9A'
            return (
              <tr key={op.id}>
                <td>
                  {op.id} <span style={{ color: 'var(--text-3)', fontSize: 11.5 }}>{op.name}</span>
                </td>
                <td>{op.depot}</td>
                <td className="mono">{Math.round(op.freq * 22)}</td>
                <td className="mono">{fmtR(avgAmt)}</td>
                <td>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: risk + '%', background: color }} />
                  </div>
                </td>
                <td>
                  <span className={'badge ' + cls}>{cls}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
