import { verticals, verticalKeys } from '../data/verticals.js'

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview' },
  { key: 'incidents', label: 'Incidents' },
  { key: 'operators', label: 'Operators' },
  { key: 'methodology', label: 'How it works' },
]

export default function Sidebar({ active, onNavigate, openIncidents, verticalKey, onVerticalChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <svg viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="13" stroke="#57C7D4" strokeWidth="2" />
          <path
            d="M16 9v14M12 12.5c0-1.8 1.8-3 4-3s4 1.2 4 3-1.8 2.6-4 3-4 1.2-4 3 1.8 3 4 3 4-1.2 4-3"
            stroke="#57C7D4"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <div>
          <div className="brand-name">
            token<b>Sentinel</b>
          </div>
          <div className="brand-sub">insider fraud detection</div>
        </div>
      </div>

      <div className="vertical-switcher">
        <div className="vertical-switcher-label">Prepaid system</div>
        <select
          className="vertical-select"
          value={verticalKey}
          onChange={(e) => onVerticalChange(e.target.value)}
        >
          {verticalKeys.map((key) => (
            <option key={key} value={key}>
              {verticals[key].label}
            </option>
          ))}
        </select>
      </div>

      <nav className="navlist">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.key}
            className={'navitem' + (active === item.key ? ' active' : '')}
            onClick={() => onNavigate(item.key)}
          >
            <span>{item.label}</span>
            {item.key === 'incidents' && openIncidents > 0 && (
              <span className="count">{openIncidents}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div>
          <span className="dot" />
          Live simulation running
        </div>
        <div style={{ marginTop: 6 }}>
          Detect the pattern. Protect the customer. Alert the utility. · Track 2, Cyber Safe &amp; Secure
        </div>
      </div>
    </aside>
  )
}
