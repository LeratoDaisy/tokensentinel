import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import StatTiles from './components/StatTiles.jsx'
import LiveFeed from './components/LiveFeed.jsx'
import VolumeChart from './components/VolumeChart.jsx'
import IncidentsTable from './components/IncidentsTable.jsx'
import OperatorsTable from './components/OperatorsTable.jsx'
import Methodology from './components/Methodology.jsx'
import { useSimulation } from './hooks/useSimulation.js'

export default function App() {
  const [section, setSection] = useState('overview')
  const [verticalKey, setVerticalKey] = useState('electricity')

  const { vertical, operators, feed, incidents, chartPoints, systemRisk, stats, updateIncident } =
    useSimulation(verticalKey)
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
        <TopBar section={section} systemRisk={systemRisk} vertical={vertical} />
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
          {section === 'operators' && <OperatorsTable operators={operators} vertical={vertical} />}
          {section === 'methodology' && <Methodology vertical={vertical} />}
        </div>
      </main>
    </div>
  )
}
