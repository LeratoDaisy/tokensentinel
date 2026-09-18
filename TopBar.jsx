const RING_CIRCUMFERENCE = 150.8

function titlesFor(section, vertical) {
  const map = {
    overview: [
      'System overview',
      `Monitoring ${vertical.operators.length} ${vertical.entityLabelPlural} · ${vertical.tagline.toLowerCase()}`,
    ],
    incidents: ['Flagged incidents', 'Every anomaly auto-escalates here for investigation'],
    operators: [
      `${vertical.entityLabel[0].toUpperCase()}${vertical.entityLabel.slice(1)} risk profile`,
      `Baseline behavior learned per ${vertical.entityLabel}, not one fixed rule for all`,
    ],
    verify: [
      `Verify a ${vertical.unitLabel}`,
      `Check a ${vertical.unitLabel} against the issuance ledger before crediting the ${vertical.accountLabel}`,
    ],
    challenge: [
      'Spot the fraud',
      'Human review vs. the engine, on the same live issuance events',
    ],
    methodology: ['Detection methodology', 'How the anomaly score is calculated'],
  }
  return map[section]
}

export default function TopBar({ section, systemRisk, vertical, theme, onToggleTheme }) {
  const [title, subtitle] = titlesFor(section, vertical)
  const offset = RING_CIRCUMFERENCE - (systemRisk / 100) * RING_CIRCUMFERENCE

  let color = '#2FBF9A'
  let label = 'NOMINAL'
  if (systemRisk >= 60) {
    color = '#F2542D'
    label = 'CRITICAL'
  } else if (systemRisk >= 25) {
    color = '#F5A623'
    label = 'ELEVATED'
  }

  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-right">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="risk-gauge">
          <div className="risk-label">
            <div className="status" style={{ color }}>
              {label}
            </div>
            <div className="hint">system risk score</div>
          </div>
          <div className="risk-ring">
            <svg viewBox="0 0 58 58">
              <circle className="track" cx="29" cy="29" r="24" />
              <circle
                className="prog"
                cx="29"
                cy="29"
                r="24"
                stroke={color}
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="val">{Math.round(systemRisk)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
