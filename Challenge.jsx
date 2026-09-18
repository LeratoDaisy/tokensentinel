import { useMemo, useState } from 'react'
import { fmtR } from '../hooks/useSimulation.js'

const ROUND_SIZE = 6

// Build one round from whatever's currently in the feed: a mix of clean and
// anomalous events, shuffled, with the flag stripped off.
function buildRound(feed, vertical) {
  const clean = feed.filter((f) => !f.isAnomaly)
  const flagged = feed.filter((f) => f.isAnomaly)
  if (clean.length < 3 || flagged.length < 1) return null

  const nFlagged = Math.min(flagged.length, Math.random() < 0.7 ? 1 : 2)
  const nClean = ROUND_SIZE - nFlagged

  const pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n)
  const picked = [...pick(flagged, nFlagged), ...pick(clean, nClean)].sort(() => Math.random() - 0.5)

  return picked.map((f, i) => ({
    slot: i,
    key: f.key,
    opId: f.opId,
    depot: f.depot,
    accountId: f.accountId,
    amount: f.amount,
    time: f.time,
    isAnomaly: f.isAnomaly,
    reason: f.reason,
    offHours: f.offHours,
  }))
}

export default function Challenge({ feed, vertical }) {
  const [round, setRound] = useState(() => buildRound(feed, vertical))
  const [picks, setPicks] = useState([])
  const [revealed, setRevealed] = useState(false)
  const [tally, setTally] = useState({ rounds: 0, humanHits: 0, humanMisses: 0 })

  const flaggedSlots = useMemo(
    () => (round ? round.filter((r) => r.isAnomaly).map((r) => r.slot) : []),
    [round],
  )

  function newRound() {
    const next = buildRound(feed, vertical)
    setRound(next)
    setPicks([])
    setRevealed(false)
  }

  function togglePick(slot) {
    if (revealed) return
    setPicks((prev) => (prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]))
  }

  function submit() {
    if (revealed || !round) return
    const correct = picks.length === flaggedSlots.length && picks.every((p) => flaggedSlots.includes(p))
    setTally((prev) => ({
      rounds: prev.rounds + 1,
      humanHits: prev.humanHits + (correct ? 1 : 0),
      humanMisses: prev.humanMisses + (correct ? 0 : 1),
    }))
    setRevealed(true)
  }

  if (!round) {
    return (
      <div className="panel">
        <div className="panel-head">
          <h2>Spot the fraud</h2>
        </div>
        <p className="tokencheck-intro" style={{ padding: '18px 20px' }}>
          Waiting for enough issuance events to build a round — give the simulation a few more
          seconds.
        </p>
      </div>
    )
  }

  const accuracy = tally.rounds ? Math.round((tally.humanHits / tally.rounds) * 100) : null

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Spot the fraud</h2>
        <span className="tag">you vs the engine</span>
      </div>

      <div className="challenge">
        <p className="tokencheck-intro">
          {round.length} {vertical.unitLabelPlural} were {vertical.actionVerb} across these{' '}
          {vertical.entityLabelPlural}. {flaggedSlots.length === 1 ? 'One is' : `${flaggedSlots.length} are`}{' '}
          fraudulent. Select the {flaggedSlots.length === 1 ? 'one' : 'ones'} you think{' '}
          {flaggedSlots.length === 1 ? "it's" : 'they are'}, before the engine tells you.
        </p>

        <div className="challenge-grid">
          {round.map((r) => {
            const picked = picks.includes(r.slot)
            const isFlag = r.isAnomaly
            let cls = 'challenge-card'
            if (picked) cls += ' picked'
            if (revealed && isFlag) cls += ' reveal-bad'
            if (revealed && !isFlag && picked) cls += ' reveal-wrong'
            return (
              <button key={r.key} className={cls} onClick={() => togglePick(r.slot)} disabled={revealed}>
                <div className="challenge-card-top">
                  <span className="mono">{r.opId}</span>
                  <span>{r.time}</span>
                </div>
                <div className="challenge-card-amt">{fmtR(r.amount)}</div>
                <div className="challenge-card-bottom">
                  <span className="mono">{r.accountId}</span>
                  <span>{r.depot}</span>
                </div>
                {revealed && isFlag && (
                  <div className="challenge-card-tag">{r.reason || 'behavioral deviation'}</div>
                )}
              </button>
            )
          })}
        </div>

        <div className="challenge-actions">
          {!revealed ? (
            <button className="btn primary" onClick={submit} disabled={picks.length === 0}>
              Lock in answer
            </button>
          ) : (
            <button className="btn primary" onClick={newRound}>
              Next round
            </button>
          )}
          <span className="challenge-picked-count">{picks.length} selected</span>
        </div>

        {revealed && (
          <div
            className={
              'verdict ' +
              (picks.length === flaggedSlots.length && picks.every((p) => flaggedSlots.includes(p))
                ? 'ok'
                : 'bad')
            }
          >
            <div className="verdict-head">
              <span className="verdict-headline">
                {picks.length === flaggedSlots.length && picks.every((p) => flaggedSlots.includes(p))
                  ? 'You caught it.'
                  : 'The engine caught it — you didn\u2019t.'}
              </span>
            </div>
            <p className="verdict-detail">
              The engine flags every anomalous event the instant it's issued, scored against that{' '}
              {vertical.entityLabel}'s own baseline — no scanning a table, no missing the quiet one.
            </p>
          </div>
        )}

        <div className="challenge-scoreboard">
          <div className="scoreboard-item">
            <div className="scoreboard-label">You</div>
            <div className="scoreboard-value">{accuracy === null ? '—' : accuracy + '%'}</div>
            <div className="scoreboard-sub">
              {tally.humanHits}/{tally.rounds} rounds
            </div>
          </div>
          <div className="scoreboard-item engine">
            <div className="scoreboard-label">tokenSentinel</div>
            <div className="scoreboard-value">100%</div>
            <div className="scoreboard-sub">every round, in real time</div>
          </div>
        </div>
      </div>
    </div>
  )
}
