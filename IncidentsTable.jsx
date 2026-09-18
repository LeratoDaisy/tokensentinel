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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr key={inc.id}>
              <td className="mono">{inc.id}</td>
              <td className="mono">{inc.operator}</td>
              <td className="mono">{inc.accountId}</td>
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
