import React, { useState } from 'react';
import {
  Badge, Button, Text,
  CheckIcon, FlagIcon, SearchIcon, CalendarIcon, ThumbsUpIcon, ZapIcon, RefreshIcon, LockIcon,
} from '@razorpay/blade/components';
import { useSeasons } from './state';
import { Merchant, formatINR } from './data';
import { readinessPlans, playbook, Plan, plansFor } from './extras';

/* ---------------- Readiness score helpers ---------------- */

export function usePlanProgress(m: Merchant, layer?: 'year' | 'month' | 'week') {
  const { status, confirmed } = useSeasons();
  const plan = layer ? plansFor(m.id)[layer] : readinessPlans[m.id];
  const isDone = (it: Plan['items'][number]) =>
    it.kind === 'auto' ? true : it.kind === 'action' ? status[it.actionId!]?.state === 'approved' : !!confirmed[`${m.id}:${plan.layer}:${it.id}`];
  const done = plan.items.filter(isDone).length;
  return { plan, isDone, done, total: plan.items.length };
}

export function Ring({ done, total, size = 64, light }: { done: number; total: number; size?: number; light?: boolean }) {
  const r = size / 2 - 6, c = 2 * Math.PI * r, pct = total ? done / total : 0;
  const full = done === total;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${done} of ${total} ready`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? 'rgba(255,255,255,0.22)' : 'hsla(206,10%,29%,0.12)'} strokeWidth="6" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={full ? 'hsl(150,100%,33%)' : light ? '#fff' : 'hsl(218,89%,51%)'} strokeWidth="6"
        strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dasharray 0.4s' }} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={size * 0.26} fontWeight="700" fill={light ? '#fff' : 'hsl(0,0%,2%)'}>{done}/{total}</text>
    </svg>
  );
}

/* ---------------- Year at a glance (inside the hero) ---------------- */

const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

export function YearStrip({ m }: { m: Merchant }) {
  // Coming 12 months from the simulated date (Sep): forecast where we have one, else last year's same month.
  const vals = MONTHS.map((mon) => {
    const hits = m.annual.series.filter((p) => p.month.startsWith(mon));
    const f = hits.find((p) => p.forecast !== undefined);
    const v = f?.forecast ?? hits[hits.length - 1]?.actual ?? 0;
    const label = (f?.label ?? hits.find((p) => p.label)?.label ?? '').split(' (')[0];
    return { mon, v, label };
  });
  const max = Math.max(...vals.map((x) => x.v));
  const peaks = [...vals].sort((a, b) => b.v - a.v).slice(0, 3).map((x) => x.mon);
  return (
    <div className="ystrip" aria-label="Your year at a glance">
      <div className="ystrip-head">
        <span>Your year at a glance</span>
        <span className="ystrip-key"><i className="k peak" />Peak months<i className="k" />Other months</span>
      </div>
      <div className="ystrip-bars">
        {vals.map((x, i) => (
          <div className="ycol" key={x.mon}>
            {i === 0 && <span className="you-are-here">Today</span>}
            <div className="ybar-wrap"><div className={`ybar ${peaks.includes(x.mon) ? 'peak' : ''}`} style={{ height: `${Math.max(6, (x.v / max) * 100)}%` }} title={x.label || x.mon} /></div>
            <span className="ymon">{x.mon}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlaybookTag({ m }: { m: Merchant }) {
  return <span className="playbook">Playbook · {playbook[m.id]}</span>;
}

/* ---------------- Readiness plan ---------------- */

export function ReadinessPlan({ m, layer }: { m: Merchant; layer: 'year' | 'month' | 'week' }) {
  const { openDrawer, toggleConfirm, setView } = useSeasons();
  const { plan, isDone, done, total } = usePlanProgress(m, layer);
  const next = plan.items.find((it) => !isDone(it));
  const [all, setAll] = useState(false);
  const pending = plan.items.filter((it) => !isDone(it));
  const shown = all ? plan.items : pending.slice(0, 2);
  return (
    <div className="card card-pad rplan" data-tour="readiness-plan">
      <div className="rplan-head">
        <Ring done={done} total={total} />
        <div className="stack gap-4" style={{ flex: 1 }}>
          <Text size="large" weight="semibold">{done === total ? 'You’re ready' : `Am I ready? ${done} of ${total} done`}</Text>
          <Text size="small" color="surface.text.gray.muted">
            {plan.title} · counted back from <b>{plan.goal}, {plan.goalDate}</b>. {next ? `Next: ${next.label} by ${next.date}.` : 'Everything is in place.'}
          </Text>
        </div>
        <span className="rplan-legend"><i className="d done" />Done<i className="d" />To do<i className="d you" />Only you can confirm</span>
      </div>

      <div className="rail" role="list">
        {plan.items.map((it) => (
          <div className="rail-step" role="listitem" key={it.id} title={it.label}>
            <span className={`rail-dot ${isDone(it) ? 'done' : ''} ${it.kind === 'confirm' ? 'you' : ''}`}>{isDone(it) && <CheckIcon size="xsmall" color="surface.icon.staticWhite.normal" />}</span>
            <span className="rail-date">{it.date}</span>
          </div>
        ))}
        <div className="rail-step goal"><span className="rail-dot goal"><FlagIcon size="xsmall" color="surface.icon.staticWhite.normal" /></span><span className="rail-date">{plan.goalDate}</span></div>
      </div>

      <div className="rtasks">
        {shown.map((it) => {
          const d = isDone(it);
          const act = it.actionId ? m.actions.find((x) => x.id === it.actionId) : undefined;
          return (
            <div className={`rtask ${d ? 'done' : ''}`} key={it.id}>
              <span className={`tick ${d ? 'on' : ''} ${it.kind === 'confirm' ? 'you' : ''}`}>{d && <CheckIcon size="xsmall" color="surface.icon.staticWhite.normal" />}</span>
              <span className="rdate">{it.date}</span>
              <span className="rlabel">{it.label}{it.kind === 'confirm' && it.note && <span className="rnote"> · {it.note}</span>}</span>
              <span className="raction">
                {it.kind === 'auto' && <span className="rby">Done by Seasons</span>}
                {it.kind === 'action' && !d && act && <Button size="xsmall" variant="secondary" onClick={() => { setView(act.layer); openDrawer(act); }}>Review</Button>}
                {it.kind === 'action' && d && <span className="rby">Approved</span>}
                {it.kind === 'confirm' && <Button size="xsmall" variant={d ? 'tertiary' : 'secondary'} onClick={() => toggleConfirm(`${m.id}:${plan.layer}:${it.id}`, it.label)}>{d ? 'Undo' : 'Confirm'}</Button>}
              </span>
            </div>
          );
        })}
        <button className="rtoggle" onClick={() => setAll((x) => !x)}>
          {all ? 'Show only what’s next' : `Show all ${total} tasks${pending.length > 2 ? ` (${pending.length - 2} more to do)` : ''}`}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Mini charts for the layer cards ---------------- */

export function MiniWeek({ grid }: { grid: number[][] }) {
  return (
    <div className="mini-heat" aria-hidden="true">
      {grid.map((row, i) => row.map((v, j) => <span key={`${i}-${j}`} style={{ background: `hsla(218,89%,51%,${0.07 + v * 0.88})` }} />))}
    </div>
  );
}

export function MiniMonth({ days }: { days: { day: string; share: number }[] }) {
  const max = Math.max(...days.map((d) => d.share));
  return (
    <div className="mini-bars" aria-hidden="true">
      {days.map((d) => <span key={d.day} style={{ height: `${Math.max(8, (d.share / max) * 100)}%`, opacity: d.share >= max * 0.6 ? 1 : 0.35 }} />)}
    </div>
  );
}

export function MiniYear({ m }: { m: Merchant }) {
  const vals = MONTHS.map((mon) => {
    const hits = m.annual.series.filter((p) => p.month.startsWith(mon));
    return hits.find((p) => p.forecast !== undefined)?.forecast ?? hits[hits.length - 1]?.actual ?? 0;
  });
  const max = Math.max(...vals);
  const pts = vals.map((v, i) => `${(i / 11) * 100},${38 - (v / max) * 34}`).join(' ');
  return (
    <svg className="mini-line" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={`0,40 ${pts} 100,40`} fill="hsla(218,89%,51%,0.12)" stroke="none" />
      <polyline points={pts} fill="none" stroke="hsl(218,89%,51%)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ---------------- How Seasons works (icon flow) ---------------- */

const steps: { t: string; d: string; I: typeof SearchIcon; you?: boolean }[] = [
  { t: 'Detect', d: 'Learns your rhythm', I: SearchIcon },
  { t: 'Plan', d: 'Weeks ahead', I: CalendarIcon },
  { t: 'You approve', d: 'Nothing goes out without you', I: ThumbsUpIcon, you: true },
  { t: 'Act', d: 'On Razorpay products', I: ZapIcon },
  { t: 'Learn', d: 'Improves next time', I: RefreshIcon },
];

export function HowFlow() {
  return (
    <div className="how-flow" data-tour="how">
      {steps.map(({ t, d, I, you }, i) => (
        <React.Fragment key={t}>
          <div className={`hf-step ${you ? 'you' : ''}`}>
            <span className="hf-icon">{you ? <LockIcon size="medium" color="surface.icon.staticWhite.normal" /> : <I size="medium" color="surface.icon.primary.normal" />}</span>
            <span className="hf-t">{t}</span>
            <span className="hf-d">{d}</span>
          </div>
          {i < steps.length - 1 && <span className="hf-arrow" aria-hidden="true">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export const shortFact = (m: Merchant, layer: 'week' | 'month' | 'year') => {
  const f = layer === 'week' ? m.weekly.keyFacts[0] : layer === 'month' ? m.monthly.keyFacts[0] : m.annual.keyFacts[0];
  return f;
};

export { formatINR, Badge };
