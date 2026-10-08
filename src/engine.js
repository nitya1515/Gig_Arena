// Rule-based eligibility + matching. Unspecified rules = UNKNOWN, never auto-pass.
export function checkEligibility(p, o) {
  const r = [], add = (label, status, why) => r.push({ label, status, why })
  if (!o.years?.length) add('Graduation year', 'unknown', 'Not specified by the listing')
  else if (!p.year) add('Graduation year', 'unknown', 'Add your graduation year to your profile')
  else add('Graduation year', o.years.includes(+p.year) ? 'ok' : 'fail', `Listing accepts ${o.years.join(', ')}; you: ${p.year}`)
  if (!o.branches?.length) add('Branch', 'unknown', 'Not specified by the listing')
  else if (!p.branch) add('Branch', 'unknown', 'Add your branch to your profile')
  else add('Branch', o.branches.includes(p.branch.toUpperCase()) ? 'ok' : 'fail', `Listing accepts ${o.branches.join(', ')}; you: ${p.branch}`)
  if (o.minCgpa == null) add('Minimum CGPA', 'unknown', 'Not specified by the listing')
  else if (p.cgpa === '' || p.cgpa == null) add('Minimum CGPA', 'unknown', 'Add your CGPA to your profile')
  else add('Minimum CGPA', +p.cgpa >= o.minCgpa ? 'ok' : 'fail', `Required ${o.minCgpa}; you: ${p.cgpa}`)
  if (o.maxBacklogs == null) add('Backlogs', 'unknown', 'Not specified - confirm with the company')
  else if (p.backlogs === '' || p.backlogs == null) add('Backlogs', 'unknown', 'Add your active backlogs to your profile')
  else add('Backlogs', +p.backlogs <= o.maxBacklogs ? 'ok' : 'fail', `Max allowed ${o.maxBacklogs}; you: ${p.backlogs}`)
  const status = r.some(x => x.status === 'fail') ? 'not' : r.some(x => x.status === 'unknown') ? 'verify' : 'eligible'
  return { status, rules: r }
}
export const daysLeft = (o) => Math.ceil((new Date(o.deadline) - Date.now()) / 864e5)
// Profile Match (0-100, NOT a selection probability): skills 40 + role 25 + location 15 + type 10 + urgency 10.
export function profileMatch(p, o) {
  const mine = (p.skills || []).map(s => s.toLowerCase())
  const have = o.skills.filter(s => mine.includes(s.toLowerCase()))
  const role = (p.role || '').toLowerCase()
  const roleHit = role && o.title.toLowerCase().split(/\W+/).some(w => w.length > 3 && role.includes(w))
  const locHit = p.location && (o.loc === 'Remote' || o.loc.toLowerCase() === p.location.toLowerCase())
  const dl = daysLeft(o), urgency = dl < 0 ? 0 : dl <= 7 ? 10 : dl <= 21 ? 6 : 3
  const score = Math.round((have.length / o.skills.length) * 40 + (roleHit ? 25 : 0) + (locHit ? 15 : 0) + (p.pref && p.pref === o.type ? 10 : 0) + urgency)
  const reasons = [have.length ? `Skills matched: ${have.join(', ')}` : 'No listed skills matched yet', roleHit ? 'Matches your target role' : null, locHit ? 'Location fits' : null].filter(Boolean)
  return { score, reasons, have, missing: o.skills.filter(s => !have.includes(s)) }
}
