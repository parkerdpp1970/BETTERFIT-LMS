/* global React, BF */
const { Button, IconButton, Fab, TextField, Select, Checkbox, RadioGroup, Switch, Chip, ResultBadge, ProgressBar, ProgressRing, ProgressTracker, Snackbar, QuizQuestion, ScoreCard, TopAppBar, NavRail, BottomNav, Tabs, Card, StatCard, CourseCard, Icon } = BF;
const { useState } = React;

const learnerNav = [{id:'home',label:'Home',icon:'layout-dashboard'},{id:'courses',label:'Courses',icon:'book-open'},{id:'progress',label:'Progress',icon:'bar-chart-3'},{id:'results',label:'Results',icon:'award'},{id:'calendar',label:'Calendar',icon:'calendar'},{id:'messages',label:'Messages',icon:'message-square'}];
const assessorNav = [{id:'home',label:'Home',icon:'layout-dashboard'},{id:'learners',label:'Learners',icon:'users'},{id:'pending',label:'Pending',icon:'clock'},{id:'analytics',label:'Analytics',icon:'bar-chart-3'},{id:'reports',label:'Reports',icon:'file-text'}];

function Shell({ nav, active, title, subtitle, children }) {
  const [a, setA] = useState(active);
  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 720, background: 'var(--surface)' }}>
      <NavRail items={nav} activeId={a} onSelect={setA} footer={<IconButton icon="log-out" label="Sign out" />} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopAppBar title={title} subtitle={subtitle} actions={[{ icon: 'bell', label: 'Notifications' }, { icon: 'user-circle', label: 'Account' }]} />
        <main style={{ flex: 1, overflow: 'auto', padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}

function LearnerDashboard() {
  return (
    <Shell nav={learnerNav} active="home" title="Home" subtitle="Welcome back, Liam">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 16, marginBottom: 24 }}>
        <Card variant="tertiary"><StatCard label="Course progress" value="58%" delta="+6% this week" deltaDirection="up" icon="trending-up" /></Card>
        <Card><StatCard label="Units passed" value="7 / 12" icon="check-circle-2" /></Card>
        <Card><StatCard label="Awaiting marking" value="1" icon="clock" /></Card>
        <Card><StatCard label="Next CPD" value="15 Nov" delta="Boxing · Birmingham" icon="calendar" /></Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
              <div><ResultBadge status="in progress" /><h2 style={{ font: 'var(--type-headline-sm)', margin: '10px 0 4px' }}>Level 3 Personal Trainer</h2><span style={{ font: 'var(--type-body-md)', color: 'var(--on-surface-muted)' }}>Assessor: Sarah Connor · NCFE · Flexi learning</span></div>
              <Button>Continue unit 8</Button>
            </div>
            <ProgressTracker steps={[{ label: 'Anatomy', meta: 'Passed 15 Oct', state: 'done' }, { label: 'Nutrition', meta: 'Passed 20 Oct', state: 'done' }, { label: 'Programming', meta: 'Pending marking', state: 'current' }, { label: 'Practical', meta: 'Not started' }, { label: 'Business', meta: 'Not started' }]} />
          </Card>
          <div>
            <h3 style={{ font: 'var(--type-title-md)', margin: '0 0 12px' }}>My courses</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16 }}>
              <CourseCard title="Level 3 Personal Trainer" level="Level 3" meta="12 units" progress={58} />
              <CourseCard title="Level 2 Gym Instructor" level="Level 2" meta="8 units · Completed" status="pass" actionLabel="Certificate" />
              <CourseCard title="Kettlebells CPD" level="CPD" meta="1 day · Birmingham" progress={0} actionLabel="Start" />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card variant="filled">
            <h3 style={{ font: 'var(--type-title-md)', margin: '0 0 12px' }}>Recent results</h3>
            {[['Multiple choice exam', 'Anatomy · 92%', 'pass'], ['Food diary analysis', 'Nutrition', 'pass'], ['12 week plan', 'Programming', 'pending']].map(([t, m, s]) => (
              <div key={t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid var(--outline-variant)' }}>
                <div style={{ minWidth: 0 }}><div style={{ font: 'var(--type-label-lg)' }}>{t}</div><div style={{ font: 'var(--type-body-sm)', color: 'var(--on-surface-muted)' }}>{m}</div></div>
                <ResultBadge status={s} />
              </div>
            ))}
            <Button variant="text" size="sm" trailingIcon="arrow-right" style={{ marginTop: 8 }}>All results</Button>
          </Card>
          <Card>
            <h3 style={{ font: 'var(--type-title-md)', margin: '0 0 12px' }}>Upcoming</h3>
            {[['15', 'Nov', 'Boxing CPD', '09:00 – 16:00 · Birmingham'], ['25', 'Nov', 'L3 submission day', '09:00 – 17:00 · Manchester']].map(([d, mo, t, m]) => (
              <div key={t} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '10px 0' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--primary-container)', color: 'var(--on-primary-container)', display: 'grid', placeItems: 'center', lineHeight: 1 }}><b style={{ font: 'var(--type-title-md)' }}>{d}</b><span style={{ font: 'var(--type-label-sm)' }}>{mo}</span></div>
                <div><div style={{ font: 'var(--type-label-lg)' }}>{t}</div><div style={{ font: 'var(--type-body-sm)', color: 'var(--on-surface-muted)' }}>{m}</div></div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function QuizMobile() {
  const [q, setQ] = useState(0); const [ans, setAns] = useState({}); const [revealed, setRevealed] = useState(false);
  const qs = [
    { question: 'Which muscle is the prime mover in a barbell back squat?', options: ['Gastrocnemius', 'Gluteus maximus', 'Biceps brachii', 'Trapezius'], correct: ['1'], feedback: 'Correct — the glutes extend the hip during the concentric phase.' },
    { question: 'What is the recommended rest between sets for maximal strength?', options: ['30 seconds', '60 seconds', '2–5 minutes', 'No rest'], correct: ['2'], feedback: 'Maximal strength work needs 2–5 minutes for ATP-PC recovery.' },
    { question: 'Which plane does a lateral raise move through?', options: ['Sagittal', 'Frontal', 'Transverse', 'Oblique'], correct: ['1'], feedback: 'Abduction away from the midline happens in the frontal plane.' },
  ];
  const cur = qs[q]; const sel = ans[q];
  const next = () => { if (!revealed) setRevealed(true); else { setRevealed(false); setQ((q + 1) % qs.length); } };
  return (
    <div style={{ width: 390, height: 844, margin: '0 auto', display: 'flex', flexDirection: 'column', background: 'var(--surface)', borderRadius: 28, overflow: 'hidden', boxShadow: 'var(--elevation-3)', border: '1px solid var(--outline-variant)' }}>
      <TopAppBar tone="tertiary" navIcon="x" title={'Question ' + (q + 1) + ' of ' + qs.length} subtitle="L3 Anatomy & Physiology — MCQ" actions={[{ icon: 'flag', label: 'Flag question' }]} />
      <div style={{ padding: '12px 16px 0' }}><ProgressBar value={q + (revealed ? 1 : 0)} max={qs.length} showValue={false} thickness="thin" /></div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <QuizQuestion question={cur.question} options={cur.options} value={sel} onChange={v => setAns({ ...ans, [q]: v })} revealed={revealed} correctIds={cur.correct} feedback={cur.feedback} hint={revealed ? 'Marked' : undefined} />
      </div>
      <div style={{ padding: 16, borderTop: '1px solid var(--outline-variant)', display: 'flex', gap: 12, background: 'var(--surface-container-lowest)' }}>
        <Button variant="outlined" arrow={false} size="lg" onClick={() => { setRevealed(false); setQ(Math.max(0, q - 1)); }} disabled={q === 0} aria-label="Previous">Back</Button>
        <Button size="lg" block disabled={sel == null} onClick={next}>{revealed ? (q === qs.length - 1 ? 'Finish' : 'Next question') : 'Check answer'}</Button>
      </div>
      <BottomNav activeId="courses" items={[{ id: 'home', label: 'Home', icon: 'home' }, { id: 'courses', label: 'Courses', icon: 'book-open' }, { id: 'results', label: 'Results', icon: 'award' }, { id: 'profile', label: 'Profile', icon: 'user' }]} />
    </div>
  );
}

function MarkingDesk() {
  const [tab, setTab] = useState('pending'); const [sel, setSel] = useState(0); const [outcome, setOutcome] = useState('pass'); const [toast, setToast] = useState(null); const [iqa, setIqa] = useState(true);
  const rows = [
    { name: 'Liam Hunter', no: '000123456', unit: 'L3 Programming · 12 week plan', type: 'Assignment', due: 'Due today', status: 'pending' },
    { name: 'Emma Brooks', no: '000123457', unit: 'L2 Anatomy · Worksheet 2', type: 'Assignment', due: '2 days left', status: 'submitted' },
    { name: 'Olivia Smith', no: '000123459', unit: 'L4 Obesity · Case study', type: 'Portfolio', due: 'Resubmission', status: 'refer' },
    { name: 'Noah Chen', no: '000123458', unit: 'L3 Ex Referral · Observation', type: 'Observation', due: '5 days left', status: 'pending' },
  ];
  const r = rows[sel];
  return (
    <Shell nav={assessorNav} active="pending" title="Pending submissions" subtitle="Welcome back, David">
      <Tabs activeId={tab} onChange={setTab} tabs={[{ id: 'pending', label: 'Pending', count: 12 }, { id: 'marked', label: 'Marked this week', count: 8 }, { id: 'referred', label: 'Referred', count: 2 }]} />
      <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}><Chip selected>All levels</Chip><Chip>Level 2</Chip><Chip>Level 3</Chip><Chip>Level 4</Chip><Chip icon="calendar">Due this week</Chip></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,3fr) minmax(320px,2fr)', gap: 24, alignItems: 'start' }}>
        <Card padding={false}>
          <table style={{ width: '100%', borderCollapse: 'collapse', font: 'var(--type-body-md)' }}>
            <thead><tr style={{ background: 'var(--surface-container-low)', textAlign: 'left' }}>{['Learner', 'Submission', 'Due', 'Status'].map(h => <th key={h} style={{ padding: '12px 16px', font: 'var(--type-label-md)', color: 'var(--on-surface-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((row, i) => (
              <tr key={row.no} onClick={() => setSel(i)} style={{ cursor: 'pointer', background: i === sel ? 'var(--primary-container)' : 'transparent', borderTop: '1px solid var(--outline-variant)' }}>
                <td style={{ padding: '12px 16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--secondary-container)', color: 'var(--on-secondary-container)', display: 'grid', placeItems: 'center', font: 'var(--type-label-md)' }}>{row.name.split(' ').map(w => w[0]).join('')}</span><div><div style={{ font: 'var(--type-label-lg)' }}>{row.name}</div><div style={{ font: 'var(--type-mono-sm)', color: 'var(--on-surface-muted)' }}>{row.no}</div></div></div></td>
                <td style={{ padding: '12px 16px' }}><div>{row.unit}</div><div style={{ font: 'var(--type-body-sm)', color: 'var(--on-surface-muted)' }}>{row.type}</div></td>
                <td style={{ padding: '12px 16px', color: row.due === 'Due today' ? 'var(--error)' : 'inherit', fontWeight: row.due === 'Due today' ? 700 : 400 }}>{row.due}</td>
                <td style={{ padding: '12px 16px' }}><ResultBadge status={row.status} /></td>
              </tr>))}</tbody>
          </table>
        </Card>
        <Card variant="elevated">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
            <div><div style={{ font: 'var(--type-label-md)', color: 'var(--on-surface-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Marking</div><h2 style={{ font: 'var(--type-title-lg)', margin: '4px 0 2px' }}>{r.name}</h2><span style={{ font: 'var(--type-body-sm)', color: 'var(--on-surface-muted)' }}>{r.unit}</span></div>
            <IconButton icon="external-link" label="Open submission" variant="outlined" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><div style={{ font: 'var(--type-label-lg)', marginBottom: 8 }}>Outcome</div><RadioGroup name="outcome" value={outcome} onChange={setOutcome} direction="row" options={[{ value: 'pass', label: 'Pass' }, { value: 'refer', label: 'Refer' }]} /></div>
            <TextField label="Grade / score" placeholder="e.g. 86%" style={{ maxWidth: 160 }} />
            <TextField label="Feedback to learner" multiline placeholder="What was done well, what to improve…" helper="Visible to the learner and IQA." required />
            <Checkbox label="Assessment criteria 1.1 – 1.4 met" checked onChange={() => { }} />
            <Switch label="Flag for IQA sampling" checked={iqa} onChange={e => setIqa(e.target.checked)} />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
              <Button variant="text" arrow={false}>Save draft</Button>
              <Button variant={outcome === 'refer' ? 'danger' : 'filled'} arrow={false} icon={outcome === 'pass' ? 'check' : 'rotate-ccw'} onClick={() => { setToast(outcome === 'pass' ? 'Marked as Pass · learner notified' : 'Marked as Refer · learner notified'); setTimeout(() => setToast(null), 3500); }}>{outcome === 'pass' ? 'Submit pass' : 'Submit refer'}</Button>
            </div>
          </div>
        </Card>
      </div>
      {toast ? <div style={{ position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 10 }}><Snackbar message={toast} action="Undo" onAction={() => setToast(null)} tone={outcome === 'pass' ? 'success' : 'error'} /></div> : null}
    </Shell>
  );
}

function LoginScreen() {
  const [role, setRole] = useState('learner');
  const roles = [['learner', 'Learner', 'graduation-cap'], ['assessor', 'Assessor', 'award'], ['creator', 'Creator', 'pen-tool'], ['moderator', 'IQA', 'scale'], ['admin', 'Admin', 'shield-check']];
  return (
    <div style={{ minHeight: 720, display: 'grid', gridTemplateColumns: '5fr 7fr', background: 'var(--surface)' }}>
      <div style={{ background: 'var(--tertiary)', color: 'var(--on-tertiary)', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-gradient)', display: 'grid', placeItems: 'center', font: '800 22px var(--font-sans)' }}>B</div><div style={{ font: '800 22px/24px var(--font-sans)' }}>BETTERFIT<div style={{ font: 'var(--type-label-sm)', letterSpacing: '0.08em', color: 'var(--inverse-primary)' }}>LMS PORTAL</div></div></div>
        <div>
          <div style={{ font: 'var(--type-display-sm)', letterSpacing: '-0.02em', textWrap: 'pretty', marginBottom: 16 }}>The expert in anything was once a beginner.</div>
          <div style={{ font: 'var(--type-body-lg)', color: 'rgba(255,255,255,0.8)' }}>Access your courses, submit work and track your progress — on the gym floor or at your desk.</div>
        </div>
        <div style={{ font: 'var(--type-body-sm)', color: 'rgba(255,255,255,0.7)' }}>Regulated qualifications · NCFE · YMCA Awards · Active IQ</div>
      </div>
      <div style={{ display: 'grid', placeItems: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div><h1 style={{ font: 'var(--type-headline-md)', margin: 0 }}>Sign in</h1><p style={{ font: 'var(--type-body-md)', color: 'var(--on-surface-muted)', margin: '4px 0 0' }}>Choose your role, then sign in with your BETTERFIT email.</p></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{roles.map(([id, l, ic]) => <Chip key={id} icon={ic} selected={role === id} onClick={() => setRole(id)}>{l}</Chip>)}</div>
          <TextField label="Email" type="email" icon="mail" placeholder="you@betterfit.com" required />
          <TextField label="Password" type="password" icon="lock" placeholder="••••••••" required />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Checkbox label="Keep me signed in" checked onChange={() => { }} /><a href="#" style={{ font: 'var(--type-label-lg)' }}>Forgot password?</a></div>
          <Button size="lg" block icon="log-in">Sign in</Button>
          <p style={{ font: 'var(--type-body-sm)', color: 'var(--on-surface-muted)', textAlign: 'center', margin: 0 }}>Authorised personnel only. Need help? <a href="#">Contact support</a></p>
        </div>
      </div>
    </div>
  );
}

window.BFScreens = { LearnerDashboard, QuizMobile, MarkingDesk, LoginScreen };
