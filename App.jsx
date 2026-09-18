import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import StatTiles from './components/StatTiles.jsx'
import LiveFeed from './components/LiveFeed.jsx'
import VolumeChart from './components/VolumeChart.jsx'
import IncidentsTable from './components/IncidentsTable.jsx'
import OperatorsTable from './components/OperatorsTable.jsx'
import Methodology from './components/Methodology.jsx'
import TokenCheck from './components/TokenCheck.jsx'
import Challenge from './components/Challenge.jsx'
import { useSimulation } from './hooks/useSimulation.js'

export default function App() {
  const [section, setSection] = useState('overview')
  const [verticalKey, setVerticalKey] = useState('electricity')
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return window.localStorage.getItem('tokensentinel-theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem('tokensentinel-theme', theme)
    } catch (e) {
      // storage unavailable — theme still applies for this session
    }
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  const {
    vertical,
    operators,
    feed,
    incidents,
    chartPoints,
    systemRisk,
    stats,
    updateIncident,
    verifyToken,
    makeTokenCode,
  } = useSimulation(verticalKey)
  const openIncidents = incidents.filter((i) => i.status === 'open').length

  return (
    <div className="app">
      <Sidebar
        active={section}
        onNavigate={setSection}
        openIncidents={openIncidents}
        verticalKey={verticalKey}
        onVerticalChange={setVerticalKey}
      />
      <main>
        <TopBar
          section={section}
          systemRisk={systemRisk}
          vertical={vertical}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <div className="content">
          {section === 'overview' && (
            <>
              <StatTiles stats={stats} vertical={vertical} />
              <div className="grid-2">
                <LiveFeed feed={feed} vertical={vertical} />
                <VolumeChart chartPoints={chartPoints} vertical={vertical} />
              </div>
            </>
          )}
          {section === 'incidents' && (
            <IncidentsTable incidents={incidents} onUpdate={updateIncident} vertical={vertical} />
          )}
          {section === 'challenge' && <Challenge feed={feed} vertical={vertical} />}
          {section === 'verify' && (
            <TokenCheck
              feed={feed}
              vertical={vertical}
              verifyToken={verifyToken}
              makeTokenCode={makeTokenCode}
            />
          )}
          {section === 'operators' && <OperatorsTable operators={operators} vertical={vertical} />}
          {section === 'methodology' && <Methodology vertical={vertical} />}
        </div>
      </main>
    </div>
  )
}
