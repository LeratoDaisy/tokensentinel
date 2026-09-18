// src/utils/security.js
//
// Two small helpers for tokenSentinel. No extra libraries needed —
// both use the hashing tools already built into the browser.

// ── 1. Hide real meter/account numbers on screen ───────────────────
// We never want a raw customer ID sitting in the page. This turns a
// real ID into a short code that LOOKS like an ID but isn't the real
// one — like showing "Card ending 4417" instead of a full card number.
function fnv1a(str) {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = (hash * 0x01000193) >>> 0
  }
  return hash.toString(16).padStart(8, '0')
}

export function hashId(rawId) {
  if (!rawId) return ''
  const code = fnv1a(String(rawId)).slice(0, 6).toUpperCase()
  return `••••${code}`
}

// ── 2. Prove an incident record hasn't been changed ────────────────
// The moment a fraud incident is created, we "fingerprint" it with a
// real SHA-256 hash of its key fields. Later, anyone (an investigator,
// a judge asking "how do you know this wasn't edited?") can re-hash
// the record and compare. Same hash = untouched. Different hash =
// something changed after the fact.
async function sha256(text) {
  const bytes = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Call once, right when an incident is created.
export async function signRecord(incident) {
  const payload = JSON.stringify({
    id: incident.id,
    meter: incident.meter,
    operator: incident.operator,
    riskScore: incident.riskScore,
    createdAt: incident.createdAt,
  })
  return sha256(payload)
}

// Call any time to check a record is still exactly what it was when signed.
export async function recordIsIntact(incident) {
  const currentHash = await signRecord(incident)
  return currentHash === incident.integrityHash
}
