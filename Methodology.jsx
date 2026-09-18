export default function Methodology({ vertical }) {
  return (
    <div className="methodology">
      <h3>Protecting utilities from fraud, from the inside out</h3>
      <p>
        Our goal isn't just to stop a fraudulent transaction. It's to detect the pattern, protect
        the customer, alert the utility, and help investigators trace the activity back to its
        source.
      </p>

      <p style={{ marginTop: 14 }}>
        Every issuance event is scored against the issuing {vertical.entityLabel}'s own learned
        baseline — not a single fixed rule — so normal variation at one {vertical.locationLabel}{' '}
        doesn't trigger noise at another.
      </p>
      <ul>
        <li>
          <b>Behavioral deviation</b> — value and frequency are compared to each{' '}
          {vertical.entityLabel}'s historical mean and spread using a rolling <code>z-score</code>.
          A {vertical.unitLabel} far outside normal range raises the score.
        </li>
        <li>
          <b>Temporal pattern</b> — issuance outside normal operating hours, or in unusually rapid
          succession, is weighted more heavily.
        </li>
        <li>
          <b>Duplication &amp; structure checks</b> — reference patterns that resemble known fraud
          signatures (e.g. replayed or sequentially manipulated entries) are flagged independently
          of value.
        </li>
        <li>
          <b>Composite risk score</b> — the three signals combine into a single 0–100 system risk
          score, decaying over time as no new anomalies appear.
        </li>
      </ul>

      <p style={{ marginTop: 14 }}>
        <b>Beyond the transaction.</b> A flagged event isn't just blocked — it's linked to the{' '}
        {vertical.entityLabel} who issued it and the {vertical.accountLabel} it affected. That
        pairing is what turns a single flag into evidence: a case an investigator can actually
        open, not just a number that disappears.
      </p>

      <p style={{ marginTop: 14 }}>
        <b>One engine, many prepaid systems.</b> Everything above is identical regardless of which
        vertical is selected in the sidebar — electricity and water first, extending to airtime,
        transit, social grants, and retail gift cards. Only the seed data and terminology change;
        the scoring logic that actually catches insider fraud doesn't.
      </p>
      <p style={{ marginTop: 14 }}>
        This demo simulates {vertical.tagline.toLowerCase()} activity live in the browser to
        illustrate the detection logic end-to-end; production would connect each vertical's
        engine to that platform's real transaction stream.
      </p>
    </div>
  )
}
