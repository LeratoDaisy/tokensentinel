import { useEffect, useRef, useState } from 'react'
import { verticals } from '../data/verticals.js'

const MAX_FEED = 60
const MAX_CHART = 40
const MAX_INCIDENTS = 25
const TICK_MS = 1400
const SEED_EVENTS = 14

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function gauss(mean, sd) {
  const u = 1 - Math.random()
  const v = Math.random()
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

function nowStr() {
  const d = new Date()
  return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
}

export function fmtR(v) {
  return 'R' + Math.round(v).toLocaleString()
}

function randomAccountId() {
  const a = Math.floor(1000 + Math.random() * 9000)
  const b = Math.floor(100 + Math.random() * 900)
  const c = Math.floor(1000 + Math.random() * 9000)
  return `${a}-${b}-${c}`
}

/**
 * Encapsulates the tokenSentinel simulation for a single vertical (electricity,
 * water, airtime, transit, grants, retail — see data/verticals.js). Generates
 * simulated prepaid issuance events for that vertical's seed entities, scores
 * each one against the issuing entity's own learned baseline, and derives a
 * single composite risk score.
 *
 * The scoring logic below is identical regardless of verticalKey — only the
 * seed data and terminology change. That's the point: one detection engine,
 * many prepaid systems. A production version would replace generateEvent()'s
 * random event source with a real transaction stream per vertical.
 */
export function useSimulation(verticalKey) {
  const vertical = verticals[verticalKey]

  const operatorsRef = useRef(
    vertical.operators.map((o) => ({
      ...o,
      history: [],
      riskScore: Math.round(6 + Math.random() * 10),
    })),
  )
  const feedIdRef = useRef(0)
  const incidentIdRef = useRef(1000)
  const systemRiskRef = useRef(8)

  const [operators, setOperators] = useState(operatorsRef.current)
  const [feed, setFeed] = useState([])
  const [incidents, setIncidents] = useState([])
  const [chartPoints, setChartPoints] = useState([])
  const [systemRisk, setSystemRisk] = useState(8)
  const [stats, setStats] = useState({
    issuedToday: 0,
    valueToday: 0,
    flagsToday: 0,
    lossIntercepted: 0,
  })

  function generateEvent() {
    const ops = operatorsRef.current
    const op = ops[Math.floor(Math.random() * ops.length)]
    const forceAnomaly = Math.random() < 0.12 // ~12% of events are seeded anomalies for the demo

    let amount
    let reason = null
    let offHours = false
    let duplicate = false

    if (forceAnomaly) {
      const kind = Math.random()
      if (kind < 0.45) {
        amount = op.baseAmt * rand(4.5, 8) // large value spike
        reason = 'value spike'
      } else if (kind < 0.8) {
        amount = gauss(op.baseAmt, op.sd)
        offHours = true
        reason = 'off-hours issuance'
      } else {
        amount = op.baseAmt * rand(0.9, 1.1)
        duplicate = true
        reason = 'duplicate signature'
      }
    } else {
      amount = Math.max(20, gauss(op.baseAmt, op.sd))
    }

    // Composite anomaly score: behavioral deviation (z-score) + temporal +
    // structural signals. Threshold of 42 chosen so ~12% seed rate mostly
    // (not always) crosses it, mirroring how real fraud isn't always extreme.
    const z = Math.abs((amount - op.baseAmt) / op.sd)
    const score = Math.min(100, z * 14 + (offHours ? 28 : 0) + (duplicate ? 34 : 0))
    const isAnomaly = score > 42

    op.history = [...op.history, amount].slice(-40)
    const accountId = randomAccountId()

    setStats((prev) => ({
      issuedToday: prev.issuedToday + 1,
      valueToday: prev.valueToday + amount,
      flagsToday: prev.flagsToday + (isAnomaly ? 1 : 0),
      lossIntercepted: prev.lossIntercepted + (isAnomaly ? amount * rand(0.6, 1) : 0),
    }))

    if (isAnomaly) {
      systemRiskRef.current = Math.min(100, systemRiskRef.current + rand(6, 12))
      op.riskScore = Math.min(100, Math.round(op.riskScore * 0.6 + score * 0.4 + 8))

      incidentIdRef.current += 1
      const severity = score > 70 ? 'high' : score > 50 ? 'med' : 'low'
      setIncidents((prev) =>
        [
          {
            id: 'INC-' + incidentIdRef.current,
            operator: op.id,
            depot: op.depot,
            accountId,
            pattern: reason || 'behavioral deviation',
            severity,
            status: 'open',
            time: nowStr(),
          },
          ...prev,
        ].slice(0, MAX_INCIDENTS),
      )
    } else {
      systemRiskRef.current = Math.max(4, systemRiskRef.current - 0.6)
      op.riskScore = Math.max(3, op.riskScore * 0.94)
    }

    setSystemRisk(Math.max(3, Math.min(100, systemRiskRef.current)))

    feedIdRef.current += 1
    setFeed((prev) =>
      [
        {
          key: feedIdRef.current,
          opId: op.id,
          depot: op.depot,
          accountId,
          amount,
          isAnomaly,
          reason,
          offHours,
          time: nowStr(),
        },
        ...prev,
      ].slice(0, MAX_FEED),
    )

    setChartPoints((prev) => [...prev, { amt: amount, anomaly: isAnomaly }].slice(-MAX_CHART))
    setOperators(operatorsRef.current.map((o) => ({ ...o })))
  }

  // Re-seed the whole simulation whenever the vertical changes.
  useEffect(() => {
    operatorsRef.current = vertical.operators.map((o) => ({
      ...o,
      history: [],
      riskScore: Math.round(6 + Math.random() * 10),
    }))
    feedIdRef.current = 0
    incidentIdRef.current = 1000
    systemRiskRef.current = 8

    setOperators(operatorsRef.current)
    setFeed([])
    setIncidents([])
    setChartPoints([])
    setSystemRisk(8)
    setStats({ issuedToday: 0, valueToday: 0, flagsToday: 0, lossIntercepted: 0 })

    for (let i = 0; i < SEED_EVENTS; i++) generateEvent()
    const interval = setInterval(generateEvent, TICK_MS)
    return () => clearInterval(interval)
    // Intentionally only re-runs when the vertical changes; generateEvent
    // reads/writes via refs and setState updaters, so it doesn't need to be
    // in the dependency array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verticalKey])

  function updateIncident(id, status) {
    setIncidents((prev) => prev.map((inc) => (inc.id === id ? { ...inc, status } : inc)))
  }

  return { vertical, operators, feed, incidents, chartPoints, systemRisk, stats, updateIncident }
}
