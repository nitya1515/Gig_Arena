import { useState, useEffect, useMemo } from 'react'
import { Briefcase, ClipboardList, GraduationCap, MessagesSquare, Search, Bookmark, X, Trash2, Zap, LogOut, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react'
import { OPPS, QUESTIONS, SAMPLE_REPORTS } from './data.js'
import { checkEligibility, profileMatch, daysLeft } from './engine.js'

const useLS = (k, d) => {
  const [v, s] = useState(() => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } })
  useEffect(() => { localStorage.setItem(k, JSON.stringify(v)) }, [k, v])
  return [v, s]
}
const STAGES = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn']
const inp = 'w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'
const btn = 'rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-300'
const card = 'rounded-xl border border-slate-800 bg-slate-900 p-4'
const Field = ({ label, children }) => <label className="block text-xs text-slate-400 space-y-1"><span>{label}</span>{children}</label>
const Logo = () => <div className="flex items-center gap-2 font-bold text-white text-lg"><span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center"><Zap size={16} /></span>Gig Arena</div>

export default function App() {
  const [user, setUser] = useLS('ga_user', null)
  const [profile, setProfile] = useLS('ga_profile', null)
  const [tab, setTab] = useState('opps')
  if (!user) return <Landing onStart={setUser} />
  if (!profile) return <Onboarding name={user.name} onDone={setProfile} />
  const tabs = [['opps', 'Opportunities', Briefcase], ['track', 'My Applications', ClipboardList], ['prep', 'Diagnostics', GraduationCap], ['exp', 'Experiences', MessagesSquare]]
  return (
    <div className="min-h-screen text-slate-200">
      <header className="border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <Logo />
        <nav className="flex gap-1 flex-wrap">{tabs.map(([k, l, I]) => <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${tab === k ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><I size={15} />{l}</button>)}</nav>
        <div className="flex items-center gap-2 text-sm"><span className="text-slate-400">Hi, {profile.name}</span>
          <button title="Edit profile" className="text-xs underline text-slate-400" onClick={() => setProfile(null)}>Edit profile</button>
          <button title="Sign out" onClick={() => setUser(null)}><LogOut size={16} /></button></div>
      </header>
      <main className="max-w-5xl mx-auto p-4">
        {tab === 'opps' && <Opps profile={profile} />}
        {tab === 'track' && <Tracker />}
        {tab === 'prep' && <Quiz />}
        {tab === 'exp' && <Experiences />}
      </main>
    </div>
  )
}

function Landing({ onStart }) {
  const [name, setName] = useState('')
  return (
    <div className="min-h-screen grid place-items-center p-6 text-slate-200">
      <div className="max-w-xl text-center space-y-5">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="text-4xl font-bold text-white">From Opportunity to Offer, <span className="text-indigo-400">Prepare Smarter.</span></h1>
        <p className="text-slate-400">Check eligibility with explained reasons, see transparent profile matches, track applications and practise with diagnostics.</p>
        <form onSubmit={e => { e.preventDefault(); name.trim() && onStart({ name: name.trim() }) }} className="flex gap-2 max-w-sm mx-auto">
          <input aria-label="Your name" className={inp} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          <button className={btn}>Start demo</button>
        </form>
        <p className="text-xs text-slate-500">Demo mode: data stays in this browser. All listings are fictional samples.</p>
      </div>
    </div>
  )
}

function Onboarding({ name, onDone }) {
  const [f, setF] = useState({ name, branch: '', year: '', cgpa: '', backlogs: '0', role: '', location: '', skills: '', pref: 'Internship' })
  const [err, setErr] = useState('')
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const submit = e => {
    e.preventDefault()
    if (+f.cgpa < 0 || +f.cgpa > 10 || f.cgpa === '') return setErr('CGPA must be between 0 and 10')
    if (!f.year || +f.year < 2024 || +f.year > 2032) return setErr('Enter a valid graduation year')
    if (!f.branch.trim()) return setErr('Branch is required')
    onDone({ ...f, skills: f.skills.split(',').map(s => s.trim()).filter(Boolean) })
  }
  return (
    <form onSubmit={submit} className="max-w-xl mx-auto p-6 space-y-3 text-slate-200">
      <h2 className="text-2xl font-bold text-white">Your profile</h2>
      <p className="text-xs text-slate-500">Used only for eligibility and matching. Not shared publicly.</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Display name"><input className={inp} value={f.name} onChange={set('name')} /></Field>
        <Field label="Branch (e.g. CSE)"><input className={inp} value={f.branch} onChange={set('branch')} /></Field>
        <Field label="Graduation year"><input className={inp} type="number" value={f.year} onChange={set('year')} /></Field>
        <Field label="CGPA (0-10)"><input className={inp} type="number" step="0.01" value={f.cgpa} onChange={set('cgpa')} /></Field>
        <Field label="Active backlogs"><input className={inp} type="number" min="0" value={f.backlogs} onChange={set('backlogs')} /></Field>
        <Field label="Preferred type"><select className={inp} value={f.pref} onChange={set('pref')}><option>Internship</option><option>Full-time</option></select></Field>
        <Field label="Target role"><input className={inp} placeholder="Software Engineer" value={f.role} onChange={set('role')} /></Field>
        <Field label="Preferred location"><input className={inp} placeholder="Bengaluru" value={f.location} onChange={set('location')} /></Field>
      </div>
      <Field label="Skills (comma separated)"><input className={inp} placeholder="Java, SQL, DSA" value={f.skills} onChange={set('skills')} /></Field>
      {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
      <button className={btn}>Save and continue</button>
    </form>
  )
}

const badge = { eligible: ['Eligible on available info', 'bg-emerald-900 text-emerald-300'], verify: ['Needs verification', 'bg-amber-900 text-amber-300'], not: ['Not eligible (known rule)', 'bg-red-900 text-red-300'] }
const ruleIcon = { ok: <CheckCircle2 size={14} className="text-emerald-400" />, fail: <X size={14} className="text-red-400" />, unknown: <HelpCircle size={14} className="text-amber-400" /> }

function Opps({ profile }) {
  const [apps, setApps] = useLS('ga_apps', [])
  const [q, setQ] = useState(''), [type, setType] = useState(''), [onlyOk, setOnlyOk] = useState(false), [sort, setSort] = useState('match'), [sel, setSel] = useState(null)
  const [quiz] = useLS('ga_quiz', null)
  const rows = useMemo(() => OPPS.map(o => ({ o, el: checkEligibility(profile, o), m: profileMatch(profile, o) }))
    .filter(({ o, el }) => (!q || (o.company + o.title + o.skills.join()).toLowerCase().includes(q.toLowerCase())) && (!type || o.type === type) && (!onlyOk || el.status !== 'not'))
    .sort((a, b) => sort === 'match' ? b.m.score - a.m.score : new Date(a.o.deadline) - new Date(b.o.deadline)), [profile, q, type, onlyOk, sort])
  const tracked = id => apps.find(a => a.id === id)
  const save = id => !tracked(id) && setApps([...apps, { id, status: 'Saved', notes: '' }])
  const selRow = rows.find(r => r.o.id === sel) || OPPS.filter(o => o.id === sel).map(o => ({ o, el: checkEligibility(profile, o), m: profileMatch(profile, o) }))[0]
  return (
    <div className="space-y-4">
      <p className="text-xs text-amber-400 bg-amber-950 rounded-lg p-2">Sample data: all companies and openings below are fictional and illustrative, not live vacancies.</p>
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[180px]"><Search size={14} className="absolute left-3 top-3 text-slate-500" /><input aria-label="Search" className={inp + ' pl-8'} placeholder="Search company, role, skill" value={q} onChange={e => setQ(e.target.value)} /></div>
        <select aria-label="Type" className={inp + ' !w-auto'} value={type} onChange={e => setType(e.target.value)}><option value="">All types</option><option>Internship</option><option>Full-time</option></select>
        <select aria-label="Sort" className={inp + ' !w-auto'} value={sort} onChange={e => setSort(e.target.value)}><option value="match">Sort: Profile Match</option><option value="deadline">Sort: Deadline</option></select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyOk} onChange={e => setOnlyOk(e.target.checked)} />Hide ineligible</label>
      </div>
      {!rows.length && <div className={card + ' text-center text-slate-400'}>No opportunities match. Try clearing filters.</div>}
      <div className="grid md:grid-cols-2 gap-3">
        {rows.map(({ o, el, m }) => (
          <button key={o.id} onClick={() => setSel(o.id)} className={card + ' text-left hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'}>
            <div className="flex justify-between gap-2"><div><div className="font-semibold text-white">{o.title}</div><div className="text-sm text-slate-400">{o.company} - {o.loc} - {o.type}</div></div><div className="text-right"><div className="text-lg font-bold text-indigo-400">{m.score}%</div><div className="text-[10px] text-slate-500">Profile Match</div></div></div>
            <div className="mt-2 flex items-center justify-between text-xs"><span className={`px-2 py-0.5 rounded-full ${badge[el.status][1]}`}>{badge[el.status][0]}</span><span className={daysLeft(o) < 0 ? 'text-red-400' : 'text-slate-400'}>{daysLeft(o) < 0 ? 'Deadline passed' : `${daysLeft(o)} days left`}</span></div>
          </button>
        ))}
      </div>
      {selRow && (() => { const { o, el, m } = selRow; const weak = quiz ? Object.entries(quiz.topics).filter(([, v]) => v < 60).map(([k]) => k) : []; const mins = +profile.daily || 60
        return (
          <div className="fixed inset-0 bg-black/60 grid place-items-center p-4 z-10" onClick={() => setSel(null)}>
            <div role="dialog" aria-label="Opportunity details" className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-5 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between"><div><h2 className="text-xl font-bold text-white">{o.title}</h2><p className="text-slate-400 text-sm">{o.company} - {o.loc} - SAMPLE listing</p></div><button aria-label="Close" onClick={() => setSel(null)}><X /></button></div>
              <section><h3 className="font-semibold text-white mb-1">Eligibility <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${badge[el.status][1]}`}>{badge[el.status][0]}</span></h3>
                <ul className="text-sm space-y-1">{el.rules.map(r => <li key={r.label} className="flex gap-2 items-start">{ruleIcon[r.status]}<span><b>{r.label}:</b> {r.status === 'ok' ? 'met' : r.status === 'fail' ? 'not met' : 'unknown'} - {r.why}</span></li>)}</ul></section>
              <section><h3 className="font-semibold text-white mb-1">Profile Match: {m.score}%</h3><p className="text-sm text-slate-400">{m.reasons.join('. ')}. Formula: skills 40 + role 25 + location 15 + type 10 + urgency 10. Not a selection probability, and it never overrides eligibility.</p></section>
              <section><h3 className="font-semibold text-white mb-1">Preparation brief</h3>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Skills you have: {m.have.join(', ') || 'none listed yet'}</li>
                  <li>Skills to build: {m.missing.join(', ') || 'none - nice'}</li>
                  <li>Priority topics: {o.topics.join(', ')} <i className="text-slate-500">(why: listed for this role)</i></li>
                  {weak.length > 0 && <li>Your weak diagnostic areas: {weak.join(', ')} <i className="text-slate-500">(why: scored under 60% in your quiz)</i></li>}
                  <li>Suggested daily plan ({mins} min): {Math.round(mins * .5)} min on {(m.missing[0] || o.topics[0])}, {Math.round(mins * .3)} min practice problems, {Math.round(mins * .2)} min mock explanation</li>
                  <li>Selection process (illustrative): {o.process}</li>
                  <li>Deadline: {new Date(o.deadline).toDateString()}</li>
                </ul></section>
              <button className={btn} disabled={!!tracked(o.id)} onClick={() => save(o.id)}><Bookmark size={14} className="inline mr-1" />{tracked(o.id) ? 'In your tracker' : 'Save to tracker'}</button>
            </div>
          </div>) })()}
    </div>
  )
}

function Tracker() {
  const [apps, setApps] = useLS('ga_apps', [])
  if (!apps.length) return <div className={card + ' text-center text-slate-400'}>No applications yet. Save an opportunity from the Opportunities tab.</div>
  const upd = (id, patch) => setApps(apps.map(a => a.id === id ? { ...a, ...patch } : a))
  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap text-xs">{STAGES.map(s => <span key={s} className="px-2 py-1 rounded bg-slate-800">{s}: {apps.filter(a => a.status === s).length}</span>)}</div>
      {apps.map(a => { const o = OPPS.find(x => x.id === a.id); return (
        <div key={a.id} className={card + ' space-y-2'}>
          <div className="flex justify-between"><div><b className="text-white">{o.title}</b> <span className="text-slate-400 text-sm">- {o.company}</span></div>
            <button aria-label="Remove" onClick={() => window.confirm('Remove this application?') && setApps(apps.filter(x => x.id !== a.id))}><Trash2 size={16} className="text-slate-500 hover:text-red-400" /></button></div>
          <div className="grid sm:grid-cols-2 gap-2">
            <Field label="Status"><select className={inp} value={a.status} onChange={e => upd(a.id, { status: e.target.value, ...(e.target.value === 'Applied' && !a.appliedOn ? { appliedOn: new Date().toISOString().slice(0, 10) } : {}) })}>{STAGES.map(s => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Notes"><input className={inp} value={a.notes} onChange={e => upd(a.id, { notes: e.target.value })} placeholder="Personal notes" /></Field>
          </div>
          <p className="text-xs text-slate-500">Deadline: {new Date(o.deadline).toDateString()}{a.appliedOn && ` - Applied on ${a.appliedOn}`}</p>
        </div>) })}
    </div>
  )
}

function Quiz() {
  const [res, setRes] = useLS('ga_quiz', null)
  const [ans, setAns] = useState({}), [taking, setTaking] = useState(!res)
  const submit = () => {
    const t = {}; QUESTIONS.forEach(q => { t[q.topic] ??= [0, 0]; t[q.topic][1]++; if (ans[q.id] === q.a) t[q.topic][0]++ })
    setRes({ answers: ans, score: Math.round(QUESTIONS.filter(q => ans[q.id] === q.a).length / QUESTIONS.length * 100), topics: Object.fromEntries(Object.entries(t).map(([k, [c, n]]) => [k, Math.round(c / n * 100)])) }); setTaking(false)
  }
  if (taking) return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-white">Skill diagnostic</h2>
      {QUESTIONS.map(q => <div key={q.id} className={card}><p className="mb-2 text-sm"><span className="text-xs text-indigo-400">{q.topic}</span><br />{q.q}</p>
        <div className="grid sm:grid-cols-2 gap-2">{q.o.map((o, i) => <label key={i} className="flex gap-2 text-sm"><input type="radio" name={'q' + q.id} checked={ans[q.id] === i} onChange={() => setAns({ ...ans, [q.id]: i })} />{o}</label>)}</div></div>)}
      <button className={btn} disabled={Object.keys(ans).length < QUESTIONS.length} onClick={submit}>Submit answers</button>
    </div>)
  return (
    <div className="space-y-3">
      <div className={card}><h2 className="text-xl font-bold text-white">Score: {res.score}%</h2><p className="text-xs text-slate-500">A preparation indicator from {QUESTIONS.length} sample questions, not a hiring prediction.</p>
        <div className="mt-2 space-y-1">{Object.entries(res.topics).map(([k, v]) => <div key={k} className="text-sm flex items-center gap-2"><span className="w-24">{k}</span><div className="flex-1 h-2 bg-slate-800 rounded"><div className="h-2 bg-indigo-500 rounded" style={{ width: v + '%' }} /></div><span>{v}%</span></div>)}</div></div>
      {QUESTIONS.filter(q => res.answers[q.id] !== q.a).map(q => <div key={q.id} className={card + ' text-sm'}><AlertTriangle size={14} className="inline text-amber-400 mr-1" />{q.q}<br /><span className="text-red-400">Your answer: {q.o[res.answers[q.id]]}</span> - <span className="text-emerald-400">Correct: {q.o[q.a]}</span><br /><span className="text-slate-400">{q.why}</span></div>)}
      <button className={btn} onClick={() => { setAns({}); setTaking(true) }}>Retake</button>
    </div>)
}

function Experiences() {
  const [mine, setMine] = useLS('ga_reports', [])
  const [f, setF] = useState({ company: '', role: '', round: '', topics: '', advice: '' })
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const submit = e => { e.preventDefault(); if (!f.company.trim() || !f.advice.trim()) return
    setMine([...mine, { ...f, id: Date.now(), topics: f.topics.split(',').map(s => s.trim()).filter(Boolean), status: 'Pending review' }]); setF({ company: '', role: '', round: '', topics: '', advice: '' }) }
  const Rep = ({ r, own }) => <div className={card + ' text-sm'}><div className="flex justify-between"><b className="text-white">{r.company} - {r.role} {r.round && `(${r.round})`}</b>
    {own ? <button aria-label="Delete" onClick={() => setMine(mine.filter(x => x.id !== r.id))}><Trash2 size={14} /></button> : null}</div>
    <p className="text-slate-400">Topics: {r.topics.join(', ') || 'n/a'}</p><p>{r.advice}</p>
    <p className="text-xs text-amber-400 mt-1">{r.sample ? 'Sample report - illustrative' : r.status}. Student recollection, not official company information.</p></div>
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-3"><h2 className="text-xl font-bold text-white">Approved reports</h2>{SAMPLE_REPORTS.map(r => <Rep key={r.id} r={r} />)}
        <p className="text-xs text-slate-500">Too few reports for topic statistics. New submissions stay "Pending review" until a moderator approves them (admin queue not included in this demo).</p>
        {mine.length > 0 && <><h3 className="font-semibold text-white">Your submissions</h3>{mine.map(r => <Rep key={r.id} r={r} own />)}</>}</div>
      <form onSubmit={submit} className={card + ' space-y-2 h-fit'}><h3 className="font-semibold text-white">Share your experience</h3>
        <Field label="Company"><input className={inp} value={f.company} onChange={set('company')} /></Field>
        <Field label="Role"><input className={inp} value={f.role} onChange={set('role')} /></Field>
        <Field label="Round"><input className={inp} value={f.round} onChange={set('round')} /></Field>
        <Field label="Topics (comma separated)"><input className={inp} value={f.topics} onChange={set('topics')} /></Field>
        <Field label="Preparation advice"><textarea className={inp} rows="3" value={f.advice} onChange={set('advice')} /></Field>
        <p className="text-xs text-slate-500">Don't include personal contact details. Be honest and respectful.</p><button className={btn}>Submit for review</button></form>
    </div>)
}
