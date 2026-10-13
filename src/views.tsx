import { useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Cell, LineChart, Legend,
} from 'recharts';
import {
  Badge, Button, Heading, Text, Switch, TextArea,
  SparklesIcon, ArrowRightIcon, CalendarIcon, ClockIcon, TrendingUpIcon, LockIcon, PauseIcon, PlayIcon, CheckIcon,
} from '@razorpay/blade/components';
import { useSeasons } from './state';
import { DAYS, BLOCKS, Layer, formatINR } from './data';
import { ActionList, Facts, Insight, RayWhatsApp, layerName } from './components';

const PRIMARY = 'hsl(218, 89%, 51%)';
const PRIMARY_LIGHT = 'hsla(218, 89%, 51%, 0.16)';
const MUTED = 'hsl(204, 9%, 42%)';
const GRID = 'hsl(204, 8%, 92%)';

const sourceText = { own: 'Your own data', benchmark: 'Similar merchants', early: 'Early signal' };

/* ---------------- Overview ---------------- */

export function Overview() {
  const { merchant: m, setView, pendingCount, setWaOpen } = useSeasons();
  const layers: { id: Layer; Icon: typeof CalendarIcon; title: string; text: string }[] = [
    { id: 'week', Icon: ClockIcon, title: 'This week', text: m.weekly.insight },
    { id: 'month', Icon: CalendarIcon, title: 'This month', text: m.monthly.insight },
    { id: 'year', Icon: TrendingUpIcon, title: 'This year', text: m.annual.insight },
  ];
  return (
    <div className="stack gap-20">
      <div className="hero">
        <span className="eyebrow"><SparklesIcon size="small" color="surface.icon.staticWhite.normal" />Next moment · {layerName[m.headline.layer]}</span>
        <h2>{m.headline.title}</h2>
        <p>{m.headline.sub}</p>
        <div className="hero-actions">
          <button className="btn-white" onClick={() => setView(m.headline.layer)}>Review the plan ({pendingCount(m.headline.layer)} actions)</button>
          <button className="btn-ghost" onClick={() => setWaOpen(true)}>See the WhatsApp alert</button>
        </div>
        <div className="hero-count"><div className="big">{m.headline.countdown.split(' ')[0]}</div><div className="small">{m.headline.countdown.split(' ').slice(1).join(' ')}</div></div>
      </div>

      <div>
        <Text size="small" weight="semibold" color="surface.text.gray.muted">WHAT SEASONS IS USING</Text>
        <div className="source-row">
          {(['week', 'month', 'year'] as Layer[]).map((l) => (
            <div className="source" key={l}>
              <span className={`dot ${m.sources[l].source}`} />
              <div className="stack gap-4">
                <Text size="small" weight="semibold">{layerName[l]} · {sourceText[m.sources[l].source]}</Text>
                <Text size="small" color="surface.text.gray.muted">{m.sources[l].label}</Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-main">
        <div className="stack gap-16">
          <div className="grid-3">
            {layers.map(({ id, Icon, title, text }) => (
              <button key={id} className="card card-pad layer-card stack gap-8" onClick={() => setView(id)}>
                <span className="layer-tag"><Icon size="small" color="surface.icon.primary.normal" />{title}</span>
                <Text size="small" color="surface.text.gray.subtle">{text}</Text>
                <span className="row between mt-8">
                  <Badge size="small" color={pendingCount(id) ? 'primary' : 'neutral'}>{pendingCount(id) ? `${pendingCount(id)} to approve` : 'Nothing pending'}</Badge>
                  <ArrowRightIcon size="small" color="surface.icon.gray.muted" />
                </span>
              </button>
            ))}
          </div>

          <div className="card card-pad">
            <div className="row between"><Heading size="small">Coming up</Heading><Text size="small" color="surface.text.gray.muted">Detected from {m.dataDays < 60 ? 'similar merchants + your first weeks' : 'your payments'}</Text></div>
            <div className="timeline mt-12">
              {m.moments.map((mo) => (
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
            <div className="how mt-8">
              {[
                ['1 · Detect', 'Learns your rhythm from payments (or similar merchants if you’re new)'],
                ['2 · Plan', 'Prepares actions 6–8 weeks before a peak, or days before a cycle'],
                ['3 · You approve', 'Nothing reaches a customer or your money without you'],
                ['4 · Act', 'Runs on Razorpay products you already have: Links, Engage, Capital'],
                ['5 · Learn', 'Compares forecast with actual, asks you what happened, improves'],
              ].map(([n, t], i) => (
                <div key={n} className={`how-step ${i === 2 ? 'you' : ''}`}><div className="n">{n}</div><Text size="small" color="surface.text.gray.subtle">{t}</Text></div>
              ))}
            </div>
          </div>
        </div>

        <div className="stack gap-8" style={{ alignItems: 'center' }}>
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
      <div className="card chart-card">
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
        <div className="card card-pad">
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
      <div className="grid-2">
        <div className="card card-pad">
          <div className="row between"><Heading size="small">Your week</Heading><Badge size="small" color={m.sources.week.source === 'early' ? 'notice' : 'positive'}>{m.sources.week.source === 'early' ? 'Early signal · 3 weeks' : 'Your own data'}</Badge></div>
          <Text size="small" color="surface.text.gray.muted">Darker = more payments</Text>
          <div className="heat mt-12">
            <span />
            {BLOCKS.map((b) => <span key={b} className="hcol">{b}</span>)}
            {DAYS.map((d, di) => (
              <>
                <span key={d} className="hlabel">{d}</span>
                {m.weekly.grid[di].map((v, bi) => (
                  <span key={d + bi} className="cell" title={`${d} ${BLOCKS[bi]}`} style={{ background: `hsla(218, 89%, 51%, ${0.06 + v * 0.9})`, color: v > 0.55 ? '#fff' : 'transparent' }}>
                    {v >= 0.95 ? 'Peak' : v > 0.55 ? 'High' : ''}
                  </span>
                ))}
              </>
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
  const { merchant: m, lessons, makeLessons, toggleLesson } = useSeasons();
  const r = m.review;
  const [text, setText] = useState('');
  const [thinking, setThinking] = useState(false);
  const mine = lessons[m.id];
  const submit = () => {
    if (!text.trim()) return;
    setThinking(true);
    window.setTimeout(() => { makeLessons(text); setThinking(false); }, 1300);
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

      <div className="card card-pad stack gap-12">
        <div className="stack gap-4">
          <Heading size="small">Tell Seasons what happened</Heading>
          <Text size="small" color="surface.text.gray.muted">Razorpay sees your payments, not your shop floor. Two lines from you help the next plan: {r.prompts.join(' · ')}</Text>
        </div>
        <TextArea label="Your notes" value={text} onChange={({ value }) => setText(value ?? '')} numberOfLines={3} placeholder="e.g. We ran out of stock by day 4…" />
        <div className="row gap-8">
          <Button onClick={submit} isDisabled={!text.trim() || thinking} icon={SparklesIcon}>Turn into changes for next time</Button>
          <Button variant="tertiary" onClick={() => setText(r.sampleFeedback)}>Use example notes</Button>
        </div>
        {thinking && <div className="thinking"><span className="spinner" />Reading your notes against this season’s numbers…</div>}
        {!thinking && mine && (
          <div className="stack gap-8">
            <Text size="small" weight="semibold" color="surface.text.gray.muted">PROPOSED CHANGES · YOU DECIDE WHICH TO KEEP</Text>
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

export function ControlsView() {
  const { settings: s, updateSettings, showToast } = useSeasons();
  return (
    <div className="grid-2">
      <div className="card card-pad">
        <Heading size="small">Always on · can’t be turned off</Heading>
        {[
          ['Every customer message needs your approval', 'Seasons suggests; you approve; then it sends.'],
          ['Money decisions are always yours', 'Loans, settlements and refunds are prefilled at most, never submitted.'],
          ['Only customers who opted in', 'No WhatsApp opt-in, no message. Every message has STOP.'],
          ['Benchmarks only from 50+ similar merchants', 'Aggregated numbers only. No single business can be identified.'],
        ].map(([t, d]) => (
          <div className="control" key={t}>
            <div className="stack gap-4"><Text size="medium" weight="semibold">{t}</Text><Text size="small" color="surface.text.gray.muted">{d}</Text></div>
            <span className="locked"><LockIcon size="xsmall" color="surface.icon.gray.muted" />Locked</span>
          </div>
        ))}
      </div>
      <div className="card card-pad">
        <Heading size="small">Your preferences</Heading>
        <div className="control">
          <div className="stack gap-4"><Text size="medium" weight="semibold">Maximum discount Seasons may suggest</Text><Text size="small" color="surface.text.gray.muted">Offers above this are never drafted</Text></div>
          <div className="seg">{[0, 10, 15, 20, 25].map((v) => <button key={v} className={s.discountCap === v ? 'on' : ''} onClick={() => updateSettings({ discountCap: v })}>{v === 0 ? 'None' : `${v}%`}</button>)}</div>
        </div>
        <div className="control">
          <div className="stack gap-4"><Text size="medium" weight="semibold">Messages per customer per month</Text><Text size="small" color="surface.text.gray.muted">Across all Seasons messages</Text></div>
          <div className="seg">{[1, 2, 3].map((v) => <button key={v} className={s.maxNudges === v ? 'on' : ''} onClick={() => updateSettings({ maxNudges: v })}>{v}</button>)}</div>
        </div>
        <div className="control">
          <div className="stack gap-4"><Text size="medium" weight="semibold">Quiet hours (9 PM – 9 AM)</Text><Text size="small" color="surface.text.gray.muted">No customer messages at night</Text></div>
          <Switch accessibilityLabel="Quiet hours" isChecked={s.quietHours} onChange={({ isChecked }) => updateSettings({ quietHours: isChecked })} />
        </div>
        <div className="control">
          <div className="stack gap-4"><Text size="medium" weight="semibold">SMS if WhatsApp fails</Text><Text size="small" color="surface.text.gray.muted">Only for payment reminders, not offers</Text></div>
          <Switch accessibilityLabel="SMS fallback" isChecked={s.smsFallback} onChange={({ isChecked }) => updateSettings({ smsFallback: isChecked })} />
        </div>
        {(['week', 'month', 'year'] as Layer[]).map((l) => (
          <div className="control" key={l}>
            <div className="stack gap-4"><Text size="medium" weight="semibold">{layerName[l]} suggestions</Text></div>
            <Switch accessibilityLabel={`${l} layer`} isChecked={s.layers[l]} onChange={({ isChecked }) => updateSettings({ layers: { ...s.layers, [l]: isChecked } })} />
          </div>
        ))}
        <div className="control">
          <div className="stack gap-4"><Text size="medium" weight="semibold">{s.paused ? 'Seasons is paused' : 'Pause Seasons'}</Text><Text size="small" color="surface.text.gray.muted">Stops all suggestions and cancels anything scheduled</Text></div>
          <Button size="small" variant="secondary" color={s.paused ? 'primary' : 'negative'} icon={s.paused ? PlayIcon : PauseIcon}
            onClick={() => { updateSettings({ paused: !s.paused }); showToast(s.paused ? 'Seasons resumed' : 'Seasons paused. Nothing will be sent.'); }}>
            {s.paused ? 'Resume' : 'Pause'}
          </Button>
        </div>
      </div>
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
