import { useState } from 'react'
import { fmtToken, fmtR } from '../hooks/useSimulation.js'

const VERDICT_COPY = {
  valid: { tone: 'ok', label: 'Valid' },
  suspect: { tone: 'warn', label: 'Suspicious' },
  blocked: { tone: 'bad', label: 'Blocked' },
  unissued: { tone: 'bad', label: 'Not issued' },
  invalid: { tone: 'bad', label: 'Invalid' },
}

export default function TokenCheck({ feed, vertical, verifyToken, makeTokenCode }) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)

  const unit = vertical.unitLabel

  function run(value) {
    const v = value !== undefined ? value : input
    setInput(v)
    setResult(verifyToken(v))
  }

  // Demo affordances: pull a token that really was issued in this session, or
  // fabricate a well-formed one that never was.
  function pullIssued(anomalous) {
    const match = feed.find((f) => Boolean(f.isAnomaly) === anomalous && f.tokenCode)
    if (match) run(fmtToken(match.tokenCode))
  }

  function pullForged() {
    run(fmtToken(makeTokenCode()))
  }

  const copy = result ? VERDICT_COPY[result.verdict] : null

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Verify a {unit}</h2>
        <span className="tag">counter check</span>
      </div>

      <div className="tokencheck">
        <p className="tokencheck-intro">
          Enter a 20-digit {unit} to check it against the issuance ledger before crediting the{' '}
          {vertical.accountLabel}.
        </p>

        <div className="tokencheck-entry">
          <input
            className="token-input mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            placeholder="0000 0000 0000 0000 0000"
            maxLength={29}
            inputMode="numeric"
          />
          <button className="btn primary" onClick={() => run()}>
            Verify
          </button>
        </div>

        <div className="tokencheck-samples">
          <span>Try:</span>
          <button className="btn" onClick={() => pullIssued(false)}>
            a clean {unit}
          </button>
          <button className="btn" onClick={() => pullIssued(true)}>
            a flagged {unit}
          </button>
          <button className="btn" onClick={pullForged}>
            a forged {unit}
          </button>
        </div>

        {result && (
          <div className={'verdict ' + copy.tone}>
            <div className="verdict-head">
              <span className="verdict-label">{copy.label}</span>
              <span className="verdict-headline">{result.headline}</span>
            </div>
            <p className="verdict-detail">{result.detail}</p>

            <ul className="verdict-checks">
              {result.checks.map((c) => (
                <li key={c.label}>
                  <span className={'check-dot ' + (c.pass === null ? 'skip' : c.pass ? 'pass' : 'fail')} />
                  <span className="check-label">{c.label}</span>
                  <span className="check-note">{c.note}</span>
                </li>
              ))}
            </ul>

            {result.record && (
              <div className="verdict-record mono">
                {vertical.accountLabel}: {result.record.accountId} · value:{' '}
                {fmtR(result.record.amount)}
                {result.record.incidentId ? ' · ' + result.record.incidentId : ''}
              </div>
            )}
          </div>
        )}

        <p className="tokencheck-note">
          A {unit} cannot be judged authentic by its digits alone — structure only rules out
          typos and crude fakes. Authenticity means the utility's own system issued it, which is why
          the registry check is the decisive one. And because an insider can issue a perfectly real{' '}
          {unit} fraudulently, the verdict is three-state rather than real/fake.
        </p>
      </div>
    </div>
  )
}
