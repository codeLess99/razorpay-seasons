import React, { useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Cell, LineChart, Legend,
} from 'recharts';
import {
  Badge, Button, Heading, Text, Switch, TextArea,
  SparklesIcon, ArrowRightIcon, CalendarIcon, ClockIcon, TrendingUpIcon, PauseIcon, PlayIcon, CheckIcon,
} from '@razorpay/blade/components';
import { useSeasons } from './state';
import { DAYS, BLOCKS, Layer, formatINR } from './data';
import { ActionList, Facts, Insight, RayWhatsApp, layerName, QuickInsights, ReadinessPanel, ConfirmDialog } from './components';
import { aiLessons } from './ai';
import { YearStrip, PlaybookTag, Ring, usePlanProgress, ReadinessPlan, MiniWeek, MiniMonth, MiniYear, HowFlow, shortFact } from './visuals';

const PRIMARY = 'hsl(218, 89%, 51%)';
const PRIMARY_LIGHT = 'hsla(218, 89%, 51%, 0.16)';
const MUTED = 'hsl(204, 9%, 42%)';
const GRID = 'hsl(204, 8%, 92%)';


/* ---------------- Overview ---------------- */

export function Overview() {
  const { merchant: m, setView, pendingCount, setWaOpen } = useSeasons();
  const { plan, done, total } = usePlanProgress(m);
  const layers: { id: Layer; Icon: typeof CalendarIcon; title: string; viz: React.ReactNode }[] = [
    { id: 'week', Icon: ClockIcon, title: 'This week', viz: <MiniWeek grid={m.weekly.grid} /> },
    { id: 'month', Icon: CalendarIcon, title: 'This month', viz: <MiniMonth days={m.monthly.days} /> },
    { id: 'year', Icon: TrendingUpIcon, title: 'This year', viz: <MiniYear m={m} /> },
  ];
  return (
    <div className="stack gap-20">
      <div className="hero" data-tour="hero">
        <div className="hero-top">
          <div className="hero-text">
            <span className="eyebrow"><SparklesIcon size="small" color="surface.icon.staticWhite.normal" />Next moment · {layerName[m.headline.layer]}<PlaybookTag m={m} /></span>
            <h2>{m.headline.title}</h2>
            <p>{m.headline.sub}</p>
            <div className="hero-actions">
              <button className="btn-white" onClick={() => setView(m.headline.layer)}>Review the plan ({pendingCount(m.headline.layer)} actions)</button>
              <button className="btn-ghost" onClick={() => setWaOpen(true)}>See the WhatsApp alert</button>
            </div>
          </div>
          <div className="hero-side">
            <div className="hero-count"><div className="big">{m.headline.countdown.split(' ')[0]}</div><div className="small">{m.headline.countdown.split(' ').slice(1).join(' ')}</div></div>
            <button className="hero-ready" onClick={() => setView(plan.layer)} title="Open readiness plan">
              <Ring done={done} total={total} size={54} light />
              <span>{done === total ? 'Ready' : 'tasks ready'}<br /><b>{plan.title.replace(' readiness', '').replace(' (predicted)', '')}</b></span>
            </button>
          </div>
        </div>
        <YearStrip m={m} />
      </div>

      <div className="grid-insights">
        <QuickInsights />
        <ReadinessPanel />
      </div>

      <div className="grid-main">
        <div className="stack gap-16">
          <div className="grid-3">
            {layers.map(({ id, Icon, title, viz }) => (
              <button key={id} className="card card-pad layer-card stack gap-8" onClick={() => setView(id)}>
                <span className="layer-tag"><Icon size="small" color="surface.icon.primary.normal" />{title}</span>
                <div className="mini-viz">{viz}</div>
                <div className="stack">
                  <span className="mini-val">{shortFact(m, id).value}</span>
                  <Text size="xsmall" color="surface.text.gray.muted">{shortFact(m, id).label}</Text>
                </div>
                <span className="row between">
                  <Badge size="small" color={pendingCount(id) ? 'primary' : 'neutral'}>{pendingCount(id) ? `${pendingCount(id)} to approve` : 'Nothing pending'}</Badge>
                  <ArrowRightIcon size="small" color="surface.icon.gray.muted" />
                </span>
              </button>
            ))}
          </div>

          <div className="card card-pad">
            <div className="row between"><Heading size="small">Coming up</Heading><Text size="small" color="surface.text.gray.muted">Detected from {m.dataDays < 60 ? 'similar merchants + your first weeks' : 'your payments'}</Text></div>
            <div className="timeline mt-12">
              {m.moments.slice(0, 4).map((mo) => (
                <div className="moment" key={mo.date + mo.title}>
                  <div className="moment-date">{mo.date}</div>
                  <div className="moment-rail"><span className={`moment-dot ${mo.status}`} /></div>
                  <div className="stack gap-4">
                    <div className="row gap-8"><Text size="medium" weight="semibold">{mo.title}</Text><Badge size="xsmall" color="neutral">{layerName[mo.layer]}</Badge></div>
                    <Text size="small" color="surface.text.gray.muted">{mo.note}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Text size="small" weight="semibold" color="surface.text.gray.muted">HOW SEASONS WORKS</Text>
            <HowFlow />
          </div>
        </div>

        <div className="stack gap-8" style={{ alignItems: 'center' }} data-tour="whatsapp">
          <Text size="small" weight="semibold" color="surface.text.gray.muted">HOW {m.name.toUpperCase()} HEARS ABOUT IT</Text>
          <RayWhatsApp onOpen={() => setView(m.headline.layer)} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Year ---------------- */

export function YearView() {
  const { merchant: m } = useSeasons();
  const isBench = m.sources.year.source === 'benchmark';
  const firstF = m.annual.series.findIndex((p) => p.forecast !== undefined);
  const data = m.annual.series.map((p, i) => ({
    ...p,
    range: p.low !== undefined ? [p.low, p.high] : undefined,
    // join the forecast line to the last collected month
    forecast: p.forecast ?? (i === firstF - 1 ? p.actual : undefined),
  }));
  return (
    <div className="stack gap-16">
      <Insight>{m.annual.insight}</Insight>
      <ReadinessPlan m={m} layer="year" />
      <div className="card chart-card" data-tour="year-chart">
        <div className="row between wrap gap-8">
          <div className="stack gap-4">
            <Heading size="small">{isBench ? 'Expected year (index, Sep = 100)' : 'Your year, and what’s coming'}</Heading>
            <Text size="small" color="surface.text.gray.muted">{m.annual.peakTitle}</Text>
          </div>
          <div className="legend">
            {!isBench && <span><i className="sw" style={{ background: PRIMARY }} />Collected</span>}
            <span><i className="sw" style={{ background: PRIMARY_LIGHT, border: `1px dashed ${PRIMARY}` }} />Forecast range</span>
            <span><i className="sw" style={{ background: 'hsl(25,100%,44%)' }} />Forecast</span>
          </div>
        </div>
        <div style={{ height: 300, marginTop: 12 }}>
          <ResponsiveContainer>
            <ComposedChart data={data} margin={{ top: 18, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: MUTED }} tickLine={false} axisLine={{ stroke: GRID }} />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} tickLine={false} axisLine={false} tickFormatter={(v) => (isBench ? String(v) : formatINR(v))} width={56} />
              <Tooltip formatter={(v: number | number[], name: string) => [Array.isArray(v) ? `${isBench ? v[0] : formatINR(v[0])} – ${isBench ? v[1] : formatINR(v[1])}` : (isBench ? v : formatINR(v)), name]} />
              <Area dataKey="range" isAnimationActive={false} name="Forecast range" stroke={PRIMARY} strokeDasharray="4 3" fill={PRIMARY_LIGHT} strokeWidth={1} />
              {!isBench && <Bar dataKey="actual" isAnimationActive={false} name="Collected" fill={PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={34} />}
              <Line dataKey="forecast" name="Forecast" stroke="hsl(25,100%,44%)" isAnimationActive={false} strokeWidth={2.5} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="row gap-8 wrap" style={{ padding: '8px 4px 10px' }}>
          {m.annual.series.filter((p) => p.label).map((p) => <Badge key={p.month} size="small" color="neutral">{`${p.month}: ${p.label}`}</Badge>)}
        </div>
      </div>
      <Facts facts={m.annual.keyFacts} />
      <div className="section-title"><Heading size="small">Season plan</Heading><Text size="small" color="surface.text.gray.muted">Approve, edit or skip each one</Text></div>
      <ActionList layer="year" />
    </div>
  );
}

/* ---------------- Month ---------------- */

export function MonthView() {
  const { merchant: m } = useSeasons();
  const max = Math.max(...m.monthly.days.map((d) => d.share));
  return (
    <div className="stack gap-16">
      <Insight>{m.monthly.insight}</Insight>
      <div className="compare">
        <div className="side"><Text size="small" weight="semibold" color="surface.text.gray.muted">TODAY</Text><Text size="medium" weight="semibold">{m.monthly.current}</Text></div>
        <div className="arrow"><ArrowRightIcon size="medium" color="surface.icon.gray.muted" /></div>
        <div className="side new"><Text size="small" weight="semibold" color="surface.text.primary.normal">WITH SEASONS</Text><Text size="medium" weight="semibold">{m.monthly.proposed}</Text></div>
      </div>
      <ReadinessPlan m={m} layer="month" />
      <div className="grid-2">
        <div className="card chart-card">
          <Heading size="small">When customers pay (share of payments by day)</Heading>
          <Text size="small" color="surface.text.gray.muted">{m.sources.month.source === 'own' ? 'Your last cycles' : 'Similar merchants (benchmark)'}</Text>
          <div style={{ height: 230, marginTop: 10 }}>
            <ResponsiveContainer>
              <BarChart data={m.monthly.days} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: MUTED }} tickLine={false} axisLine={{ stroke: GRID }} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: MUTED }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Share of payments']} labelFormatter={(l) => `Day ${l}`} />
                <Bar dataKey="share" isAnimationActive={false} radius={[3, 3, 0, 0]}>
                  {m.monthly.days.map((d) => <Cell key={d.day} fill={d.share >= max * 0.6 ? PRIMARY : 'hsla(218, 89%, 51%, 0.35)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card card-pad" data-tour="month-groups">
          <Heading size="small">Customers grouped by when they pay</Heading>
          <Text size="small" color="surface.text.gray.muted">Each person’s link goes out at their own best time</Text>
          <table className="simple mt-12">
            <thead><tr><th>Group</th><th>People</th><th>Send</th></tr></thead>
            <tbody>
              {m.monthly.groups.map((g) => (
                <tr key={g.name}><td><b style={{ color: 'var(--text)' }}>{g.name}</b><br /><span style={{ fontSize: 12 }}>{g.pattern}</span></td><td>{g.count}</td><td>{g.send}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Facts facts={m.monthly.keyFacts} />
      <div className="section-title"><Heading size="small">This month’s actions</Heading><Text size="small" color="surface.text.gray.muted">Approve, edit or skip each one</Text></div>
      <ActionList layer="month" />
    </div>
  );
}

/* ---------------- Week ---------------- */

export function WeekView() {
  const { merchant: m } = useSeasons();
  return (
    <div className="stack gap-16">
      <Insight>{m.weekly.insight}</Insight>
      <ReadinessPlan m={m} layer="week" />
      <div className="grid-2">
        <div className="card card-pad" data-tour="week-heat">
          <div className="row between"><Heading size="small">Your week</Heading><Badge size="small" color={m.sources.week.source === 'early' ? 'notice' : 'positive'}>{m.sources.week.source === 'early' ? 'Early signal · 3 weeks' : 'Your own data'}</Badge></div>
          <Text size="small" color="surface.text.gray.muted">Darker = more payments</Text>
          <div className="heat mt-12">
            <span />
            {BLOCKS.map((b) => <span key={b} className="hcol">{b}</span>)}
            {DAYS.map((d, di) => (
              <React.Fragment key={d}>
                <span className="hlabel">{d}</span>
                {m.weekly.grid[di].map((v, bi) => (
                  <span key={d + bi} className="cell" title={`${d} ${BLOCKS[bi]}`} style={{ background: `hsla(218, 89%, 51%, ${0.06 + v * 0.9})`, color: v > 0.55 ? '#fff' : 'transparent' }}>
                    {v >= 0.95 ? 'Peak' : v > 0.55 ? 'High' : ''}
                  </span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="stack gap-12"><Facts facts={m.weekly.keyFacts} /></div>
      </div>
      <div className="section-title"><Heading size="small">This week’s actions</Heading><Text size="small" color="surface.text.gray.muted">Individual nudges always need your approval</Text></div>
      <ActionList layer="week" />
    </div>
  );
}

/* ---------------- Review & learn ---------------- */

export function ReviewView() {
  const { merchant: m, lessons, makeLessons, toggleLesson, settings } = useSeasons();
  const r = m.review;
  const [text, setText] = useState('');
  const [thinking, setThinking] = useState(false);
  const [source, setSource] = useState<Record<string, string>>({});
  const mine = lessons[m.id];
  const submit = async () => {
    if (!text.trim()) return;
    setThinking(true);
    const r = await aiLessons(m, text, settings.discountCap);
    makeLessons(text, r.value, r.ok ? 'Gemini' : 'offline rules');
    setSource((x) => ({ ...x, [m.id]: r.ok ? 'gemini' : `fallback:${r.reason}` }));
    setThinking(false);
  };
  const tone = { positive: 'positive', notice: 'notice', negative: 'negative', neutral: 'neutral' } as const;
  return (
    <div className="stack gap-16">
      <div className="row between wrap gap-8">
        <div className="stack gap-4"><Heading size="medium">{r.title}</Heading><Text size="small" color="surface.text.gray.muted">{r.period}</Text></div>
      </div>
      <div className="grid-2">
        <div className="card chart-card">
          <Heading size="small">Forecast vs what actually happened</Heading>
          <div style={{ height: 240, marginTop: 10 }}>
            <ResponsiveContainer>
              <LineChart data={r.series} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: MUTED }} tickLine={false} axisLine={{ stroke: GRID }} />
                <YAxis tick={{ fontSize: 11, fill: MUTED }} tickLine={false} axisLine={false} tickFormatter={formatINR} width={54} />
                <Tooltip formatter={(v: number) => formatINR(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line dataKey="forecast" name="Forecast" stroke="hsl(25,100%,44%)" isAnimationActive={false} strokeDasharray="5 4" strokeWidth={2} dot={{ r: 3 }} />
                <Line dataKey="actual" isAnimationActive={false} name="Actual" stroke={PRIMARY} strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card card-pad">
          <Heading size="small">What the actions did</Heading>
          <div className="mt-8">
            {r.outcomes.map((o) => (
              <div className="outcome" key={o.action}><Text size="medium">{o.action}</Text><Badge size="small" color={tone[o.tone]}>{o.result}</Badge></div>
            ))}
          </div>
        </div>
      </div>

      <div className="card card-pad stack gap-12" data-tour="feedback">
        <div className="stack gap-4">
          <Heading size="small">Tell Seasons what happened</Heading>
          <Text size="small" color="surface.text.gray.muted">Razorpay sees your payments, not your shop floor. Two lines from you help the next plan: {r.prompts.join(' · ')}</Text>
        </div>
        <TextArea label="Your notes" value={text} onChange={({ value }) => setText(value ?? '')} numberOfLines={3} placeholder="e.g. We ran out of stock by day 4…" />
        <div className="row gap-8">
          <Button onClick={submit} isDisabled={!text.trim() || thinking} icon={SparklesIcon}>Turn into changes for next time</Button>
          <Button variant="tertiary" onClick={() => setText(r.sampleFeedback)}>Use example notes</Button>
        </div>
        {thinking && <div className="thinking"><span className="spinner" />Gemini is reading your notes against this season’s numbers…</div>}
        {!thinking && mine && (
          <div className="stack gap-8">
            <div className="row between wrap gap-8">
              <Text size="small" weight="semibold" color="surface.text.gray.muted">PROPOSED CHANGES · YOU DECIDE WHICH TO KEEP</Text>
              {source[m.id] === 'gemini'
                ? <Badge size="small" color="primary" icon={SparklesIcon}>Written by Gemini, checked by Seasons</Badge>
                : source[m.id] ? <Badge size="small" color="neutral">{`Offline example · ${source[m.id].replace('fallback:', '')}`}</Badge> : null}
            </div>
            {mine.map((l, i) => (
              <div className="lesson" key={l.signal}>
                <Text size="small" weight="semibold">{l.signal}</Text>
                <ArrowRightIcon size="small" color="surface.icon.gray.muted" />
                <Text size="small" color="surface.text.gray.subtle">{l.change}</Text>
                <Button size="small" variant={l.applied ? 'secondary' : 'primary'} icon={l.applied ? CheckIcon : undefined} onClick={() => toggleLesson(i)}>
                  {l.applied ? 'Kept' : 'Keep'}
                </Button>
              </div>
            ))}
            <Text size="small" color="surface.text.gray.muted">Kept changes show up on next season’s plan as “Changed after {r.title.replace(' review', '')}”, like the stock-funding card on the Diwali plan.</Text>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Controls ---------------- */

type Pending = { title: string; body: string; confirmLabel: string; apply: () => void } | null;

export function ControlsView() {
  const { settings: s, updateSettings, showToast, addLog } = useSeasons();
  const [pending, setPending] = useState<Pending>(null);

  // Loosening a protection asks for confirmation; tightening applies straight away.
  const change = (label: string, apply: () => void, loosens: boolean, title?: string, body?: string, confirmLabel?: string) => {
    const run = () => { apply(); addLog('You', `Changed preference: ${label}.`); showToast(`Saved · ${label}`); setPending(null); };
    if (loosens) setPending({ title: title ?? 'Are you sure?', body: body ?? '', confirmLabel: confirmLabel ?? 'Yes, change it', apply: run });
    else run();
  };

  return (
    <div className="grid-2">
      <div className="card card-pad">
        <Heading size="small">How Seasons protects you and your customers</Heading>
        <Text size="small" color="surface.text.gray.muted">These are how Seasons works, every time.</Text>
        {[
          ['You approve every customer message', 'Seasons drafts it and shows who gets it. It sends only after you approve.'],
          ['Only customers who opted in hear from you', 'Each message carries a STOP option, and opt-outs are respected straight away.'],
          ['Every step is recorded', 'Suggestions, approvals, edits and changes all appear in your Activity log.'],
        ].map(([t, d]) => (
          <div className="control" key={t}>
            <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
              <span className="promise-icon"><CheckIcon size="small" color="feedback.icon.positive.intense" /></span>
              <div className="stack gap-4"><Text size="medium" weight="semibold">{t}</Text><Text size="small" color="surface.text.gray.muted">{d}</Text></div>
            </div>
          </div>
        ))}
      </div>

      <div className="card card-pad" data-tour="preferences">
        <Heading size="small">Your preferences</Heading>
        <Text size="small" color="surface.text.gray.muted">Changes that loosen a protection ask you to confirm first.</Text>
        <div className="control">
          <div className="stack gap-4"><Text size="medium" weight="semibold">Maximum discount Seasons may suggest</Text><Text size="small" color="surface.text.gray.muted">Recommended: up to 20%</Text></div>
          <div className="seg">{[0, 10, 15, 20, 25].map((v) => (
            <button key={v} className={s.discountCap === v ? 'on' : ''} onClick={() => change(`maximum discount ${v === 0 ? 'none' : v + '%'}`, () => updateSettings({ discountCap: v }), v > 20,
              `Allow discounts up to ${v}%?`, `Above 20%, discounts often cost more margin than the extra orders bring in. Seasons will still show the expected cost before you approve any offer.`, `Allow up to ${v}%`)}>{v === 0 ? 'None' : `${v}%`}</button>
          ))}</div>
        </div>
        <div className="control">
          <div className="stack gap-4"><Text size="medium" weight="semibold">Messages per customer per month</Text><Text size="small" color="surface.text.gray.muted">Recommended: 2</Text></div>
          <div className="seg">{[1, 2, 3].map((v) => (
            <button key={v} className={s.maxNudges === v ? 'on' : ''} onClick={() => change(`up to ${v} message${v > 1 ? 's' : ''} per customer per month`, () => updateSettings({ maxNudges: v }), v > 2,
              'Send up to 3 messages a month?', 'More messages can mean more opt-outs. Seasons will watch STOP replies and tell you if they rise.', 'Allow 3')}>{v}</button>
          ))}</div>
        </div>
        <div className="control">
          <div className="stack gap-4"><Text size="medium" weight="semibold">Quiet hours (9 PM – 9 AM)</Text><Text size="small" color="surface.text.gray.muted">Customers hear from you during the day</Text></div>
          <Switch accessibilityLabel="Quiet hours" isChecked={s.quietHours} onChange={({ isChecked }) => change(isChecked ? 'quiet hours on' : 'quiet hours off', () => updateSettings({ quietHours: isChecked }), !isChecked,
            'Turn off quiet hours?', 'Messages may then reach customers late at night or early in the morning.', 'Turn off')} />
        </div>
        <div className="control">
          <div className="stack gap-4"><Text size="medium" weight="semibold">SMS if WhatsApp doesn’t go through</Text><Text size="small" color="surface.text.gray.muted">For payment reminders only</Text></div>
          <Switch accessibilityLabel="SMS fallback" isChecked={s.smsFallback} onChange={({ isChecked }) => change(isChecked ? 'SMS backup on' : 'SMS backup off', () => updateSettings({ smsFallback: isChecked }), false)} />
        </div>
        {(['week', 'month', 'year'] as Layer[]).map((l) => (
          <div className="control" key={l}>
            <div className="stack gap-4"><Text size="medium" weight="semibold">{layerName[l]} suggestions</Text></div>
            <Switch accessibilityLabel={`${l} layer`} isChecked={s.layers[l]} onChange={({ isChecked }) => change(`${layerName[l].toLowerCase()} suggestions ${isChecked ? 'on' : 'off'}`, () => updateSettings({ layers: { ...s.layers, [l]: isChecked } }), false)} />
          </div>
        ))}
        <div className="control">
          <div className="stack gap-4"><Text size="medium" weight="semibold">{s.paused ? 'Seasons is paused' : 'Pause Seasons'}</Text><Text size="small" color="surface.text.gray.muted">{s.paused ? 'Resume whenever you’re ready' : 'Stops new suggestions and holds anything scheduled'}</Text></div>
          <Button size="small" variant="secondary" color={s.paused ? 'primary' : 'negative'} icon={s.paused ? PlayIcon : PauseIcon}
            onClick={() => change(s.paused ? 'Seasons resumed' : 'Seasons paused', () => updateSettings({ paused: !s.paused }), !s.paused,
              'Pause Seasons?', 'Scheduled messages will be held, and you won’t get new suggestions until you resume.', 'Pause')}>
            {s.paused ? 'Resume' : 'Pause'}
          </Button>
        </div>
      </div>
      <ConfirmDialog open={!!pending} title={pending?.title ?? ''} body={pending?.body ?? ''} confirmLabel={pending?.confirmLabel ?? ''}
        onConfirm={() => pending?.apply()} onCancel={() => setPending(null)} />
    </div>
  );
}

/* ---------------- Activity log ---------------- */

export function ActivityView() {
  const { log, merchantId } = useSeasons();
  const rows = log.filter((l) => l.merchantId === merchantId);
  return (
    <div className="card">
      <table className="simple">
        <thead><tr><th style={{ width: 190 }}>When</th><th style={{ width: 100 }}>Who</th><th>What happened</th></tr></thead>
        <tbody>
          {rows.map((l, i) => (
            <tr className="log-row" key={i}>
              <td>{l.time}</td>
              <td><Badge size="small" color={l.actor === 'You' ? 'primary' : 'neutral'}>{l.actor}</Badge></td>
              <td>{l.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
