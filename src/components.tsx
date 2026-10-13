import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge, Button, Heading, Text, Checkbox, TextArea,
  HomeIcon, TransactionsIcon, SettlementsIcon, ReportsIcon, PaymentLinkIcon, PaymentPagesIcon,
  QRCodeIcon, SubscriptionsIcon, InvoicesIcon, OptimizerIcon, EngageIcon, AgentStudioIcon, RayIcon,
  SettingsIcon, CalendarIcon, SparklesIcon, CloseIcon, CheckCircleIcon, LockIcon, ClockIcon,
  ShoppingBagIcon, EducationIcon, AwardIcon, ThermometerIcon, MessageCircleIcon, ArrowRightIcon,
  InfoIcon, SearchIcon, BellIcon, HelpCircleIcon, TrendingUpIcon, HistoryIcon, SlidersIcon,
} from '@razorpay/blade/components';
import { useSeasons, View } from './state';
import { merchants, Action, Merchant, Layer, TODAY } from './data';

/* ---------------- Shell ---------------- */

export function TopNav() {
  return (
    <header className="topnav">
      <div className="brand">
        <span className="brand-mark"><RayIcon size="medium" color="surface.icon.staticWhite.normal" /></span>
        Razorpay
      </div>
      <nav className="topnav-tabs">
        <span className="topnav-tab">Home</span>
        <span className="topnav-tab active">Payments</span>
        <span className="topnav-tab">More</span>
      </nav>
      <div className="topnav-right">
        <span className="proto-badge">Prototype</span>
        <SearchIcon size="medium" color="surface.icon.gray.muted" />
        <HelpCircleIcon size="medium" color="surface.icon.gray.muted" />
        <BellIcon size="medium" color="surface.icon.gray.muted" />
        <div className="avatar">PP</div>
      </div>
    </header>
  );
}

const navItems: { label: string; Icon: typeof HomeIcon }[] = [
  { label: 'Home', Icon: HomeIcon },
  { label: 'Transactions', Icon: TransactionsIcon },
  { label: 'Settlements', Icon: SettlementsIcon },
  { label: 'Reports', Icon: ReportsIcon },
];
const productItems: { label: string; Icon: typeof HomeIcon }[] = [
  { label: 'Payment Links', Icon: PaymentLinkIcon },
  { label: 'Payment Pages', Icon: PaymentPagesIcon },
  { label: 'QR Codes', Icon: QRCodeIcon },
  { label: 'Subscriptions', Icon: SubscriptionsIcon },
  { label: 'Invoices', Icon: InvoicesIcon },
  { label: 'Optimizer', Icon: OptimizerIcon },
  { label: 'Engage', Icon: EngageIcon },
];

export function SideNav() {
  const { showToast, setView } = useSeasons();
  const notHere = () => showToast('Not part of this prototype. Only Seasons is built.');
  return (
    <aside className="sidenav">
      {navItems.map(({ label, Icon }) => (
        <button key={label} className="nav-item dim" onClick={notHere}><Icon size="medium" color="surface.icon.gray.muted" />{label}</button>
      ))}
      <div className="nav-section">AI for your business</div>
      <button className="nav-item active" onClick={() => setView('overview')}>
        <CalendarIcon size="medium" color="surface.icon.primary.normal" />
        <span className="grow">Seasons</span>
        <Badge size="xsmall" color="primary" emphasis="intense">New</Badge>
      </button>
      <button className="nav-item dim" onClick={notHere}><AgentStudioIcon size="medium" color="surface.icon.gray.muted" />Agent Studio</button>
      <div className="nav-section">Payment products</div>
      {productItems.map(({ label, Icon }) => (
        <button key={label} className="nav-item dim" onClick={notHere}><Icon size="medium" color="surface.icon.gray.muted" />{label}</button>
      ))}
      <div className="nav-section">Account</div>
      <button className="nav-item dim" onClick={notHere}><SettingsIcon size="medium" color="surface.icon.gray.muted" />Account & Settings</button>
    </aside>
  );
}

/* ---------------- Page header, merchant switcher, tabs ---------------- */

export function MerchantIcon({ m, size = 'medium' }: { m: Merchant; size?: 'small' | 'medium' | 'large' }) {
  const I = { food: ShoppingBagIcon, education: EducationIcon, club: AwardIcon, appliance: ThermometerIcon }[m.icon];
  return <I size={size} color="surface.icon.primary.normal" />;
}

export function PageHeader() {
  const { merchantId, setMerchantId, view, setView, pendingCount } = useSeasons();
  const tabs: { id: View; label: string; Icon: typeof HomeIcon; count?: number }[] = [
    { id: 'overview', label: 'Overview', Icon: SparklesIcon },
    { id: 'year', label: 'Year', Icon: TrendingUpIcon, count: pendingCount('year') },
    { id: 'month', label: 'Month', Icon: CalendarIcon, count: pendingCount('month') },
    { id: 'week', label: 'Week', Icon: ClockIcon, count: pendingCount('week') },
    { id: 'review', label: 'Review & learn', Icon: HistoryIcon },
    { id: 'controls', label: 'Controls', Icon: SlidersIcon },
    { id: 'activity', label: 'Activity log', Icon: ReportsIcon },
  ];
  return (
    <>
      <div className="page-head">
        <div className="stack gap-4">
          <div className="page-title">
            <Heading size="large">Seasons</Heading>
            <Badge size="small" color="primary">Upgrade of Cashflow Forecaster</Badge>
          </div>
          <Text size="medium" color="surface.text.gray.muted">
            Knows when your customers pay, across the year, month and week, and gets you ready before each moment. Nothing reaches a customer without your approval.
          </Text>
        </div>
        <span className="today-pill">Simulated date · {TODAY}</span>
      </div>
      <div className="merchant-switch" role="tablist" aria-label="Demo merchant">
        {merchants.map((m) => (
          <button key={m.id} className={`merchant-chip ${m.id === merchantId ? 'active' : ''}`} onClick={() => setMerchantId(m.id)}>
            <span className="chip-icon"><MerchantIcon m={m} /></span>
            <span className="stack">
              <span className="mname">{m.name}</span>
              <span className="mtype">{m.type} · {m.dataDays < 60 ? `${m.dataDays} days of data` : m.joined.replace('Customer since ', 'since ')}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="tabs" role="tablist">
        {tabs.map(({ id, label, Icon, count }) => (
          <button key={id} className={`tab ${view === id ? 'active' : ''}`} onClick={() => setView(id)}>
            <Icon size="small" color={view === id ? 'surface.icon.primary.normal' : 'surface.icon.gray.muted'} />
            {label}
            {count ? <span className="count">{count}</span> : null}
          </button>
        ))}
      </div>
    </>
  );
}

/* ---------------- Small pieces ---------------- */

export const layerName: Record<Layer, string> = { year: 'Year', month: 'Month', week: 'Week' };

export function Insight({ children }: { children: React.ReactNode }) {
  return (
    <div className="insight">
      <span className="insight-icon"><SparklesIcon size="small" color="surface.icon.staticWhite.normal" /></span>
      <Text size="medium" color="surface.text.gray.subtle">{children}</Text>
    </div>
  );
}

export function Facts({ facts }: { facts: { label: string; value: string; hint?: string }[] }) {
  return (
    <div className="facts">
      {facts.map((f) => (
        <div className="fact" key={f.label}>
          <div className="l">{f.label}</div>
          <div className="v">{f.value}</div>
          {f.hint && <div className="h">{f.hint}</div>}
        </div>
      ))}
    </div>
  );
}

export function SourceBadge({ source }: { source?: 'own' | 'benchmark' | 'early' }) {
  if (source === 'benchmark') return <Badge size="small" color="information">Based on similar merchants</Badge>;
  if (source === 'early') return <Badge size="small" color="notice">Early signal</Badge>;
  return null;
}

const confColor = { High: 'positive', Medium: 'notice', Low: 'neutral' } as const;

/* ---------------- Action card ---------------- */

export function ActionCard({ a }: { a: Action }) {
  const { status, openDrawer, skip, undo } = useSeasons();
  const st = status[a.id]?.state ?? 'pending';
  const kindLabel = a.kind === 'message' ? 'Messages customers' : a.kind === 'finance' ? 'Money decision' : 'Changes a setting';
  return (
    <div className={`card action ${st === 'approved' ? 'done' : ''} ${st === 'skipped' ? 'skipped' : ''}`}>
      <div>
        <div className="action-meta">
          <Badge size="small" color={a.kind === 'message' ? 'primary' : a.kind === 'finance' ? 'notice' : 'neutral'}>{kindLabel}</Badge>
          <Badge size="small" color={confColor[a.confidence]}>{`${a.confidence} confidence`}</Badge>
          <SourceBadge source={a.basis} />
          {a.learnedFrom && <span className="learned"><HistoryIcon size="xsmall" color="currentColor" />Changed after {a.learnedFrom}</span>}
        </div>
        <div className="action-title">{a.title}</div>
        <p className="action-sum">{a.summary}</p>
        <div className="action-foot">
          <span><b>Impact</b> · {a.impact}</span>
          <span><b>When</b> · {a.when}</span>
          <span><b>Runs on</b> · {a.executesVia}</span>
        </div>
      </div>
      <div className="action-btns">
        {st === 'pending' && (
          <>
            <Button size="medium" onClick={() => openDrawer(a)}>Review & approve</Button>
            <Button size="medium" variant="tertiary" onClick={() => skip(a)}>Skip</Button>
          </>
        )}
        {st === 'approved' && (
          <>
            <span className="status-line"><CheckCircleIcon size="small" color="feedback.icon.positive.intense" />{a.kind === 'message' ? 'Scheduled' : 'Approved'}</span>
            <Text size="small" color="surface.text.gray.muted">{status[a.id]?.note}</Text>
            <Button size="small" variant="tertiary" onClick={() => undo(a)}>Undo</Button>
          </>
        )}
        {st === 'skipped' && (
          <>
            <Text size="small" weight="semibold" color="surface.text.gray.muted">Skipped</Text>
            <Button size="small" variant="tertiary" onClick={() => undo(a)}>Undo</Button>
          </>
        )}
      </div>
    </div>
  );
}

export function ActionList({ layer }: { layer: Layer }) {
  const { merchant, settings } = useSeasons();
  const list = merchant.actions.filter((a) => a.layer === layer);
  if (!settings.layers[layer]) return <div className="empty">The {layerName[layer]} layer is switched off in Controls.</div>;
  if (settings.paused) return <div className="empty">Seasons is paused. No new suggestions until you resume it in Controls.</div>;
  if (!list.length) return <div className="empty">Nothing to do in this layer right now. Seasons will tell you on WhatsApp when something comes up.</div>;
  return <div className="stack gap-12">{list.map((a) => <ActionCard key={a.id} a={a} />)}</div>;
}

/* ---------------- WhatsApp phone ---------------- */

export function fillTemplate(msg: string, name: string) {
  return msg
    .replace(/\{first_name\}/g, name.split(' ')[0])
    .replace(/\{parent_name\}/g, name.includes('parent:') ? name.split('parent: ')[1].replace(')', '').split(' ')[0] : name.split(' ')[0])
    .replace(/\{student_name\}/g, name.split(' ')[0])
    .replace(/\{product\}/g, 'Gur sandesh & millet chikki');
}

export function MessageBody({ text }: { text: string }) {
  const parts = text.split(/(\{payment_link\}|\{page_link\}|\{autopay_link\})/g);
  return (
    <>
      {parts.map((p, i) =>
        /\{(payment_link|page_link|autopay_link)\}/.test(p)
          ? <span key={i} className="link">{p === '{autopay_link}' ? 'rzp.io/m/autopay' : p === '{page_link}' ? 'pages.razorpay.com/' : 'rzp.io/l/'}{['x7Kq2', 'pQ9aV', 'Lm3Td'][i % 3]}</span>
          : <span key={i}>{p}</span>)}
    </>
  );
}

export function Phone({ title, sub, children, short }: { title: string; sub: string; children: React.ReactNode; short?: boolean }) {
  return (
    <div className={`phone ${short ? 'short' : ''}`}>
      <div className="phone-screen">
        <div className="wa-top">
          <div className="wa-avatar"><RayIcon size="small" color="surface.icon.primary.normal" /></div>
          <div><div className="wa-name">{title}</div><div className="wa-sub">{sub}</div></div>
        </div>
        <div className="wa-body">{children}</div>
        <div className="wa-input">Message</div>
      </div>
    </div>
  );
}

/* ---------------- Approval drawer ---------------- */

export function ApprovalDrawer() {
  const { drawer: a, openDrawer, approve, skip, merchant, settings } = useSeasons();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!a) return;
    const s: Record<string, boolean> = {};
    a.recipients?.forEach((r) => { s[r.name] = r.optedIn; });
    setSelected(s);
    setMsg(a.message ?? '');
  }, [a]);

  const firstSelected = useMemo(() => a?.recipients?.find((r) => selected[r.name]), [a, selected]);
  if (!a) return null;

  const chosen = a.recipients?.filter((r) => selected[r.name]).length ?? 0;
  const excluded = a.recipients?.filter((r) => !r.optedIn) ?? [];
  const totalNote = a.id === 'm-winback' ? ` (showing 8 of 86 · ${chosen === 6 ? 64 : chosen} will receive it)` : '';
  const isMsg = a.kind === 'message';

  const doApprove = () => {
    if (isMsg) {
      const n = a.id === 'm-winback' && chosen === 6 ? 64 : a.id === 'k-timing' && chosen === 5 ? 108 : chosen;
      approve(a, `${a.when} · ${n} recipient${n === 1 ? '' : 's'}`, `${n} recipients, message ${msg === a.message ? 'as drafted' : 'edited by you'}.`);
    } else {
      approve(a, a.when, a.settingChange?.map((c) => `${c.label}: ${c.to}`).join('; ') ?? '');
    }
  };

  return (
    <>
      <div className="scrim" onClick={() => openDrawer(null)} />
      <aside className="drawer" role="dialog" aria-label="Review action">
        <div className="drawer-head">
          <div className="stack gap-4">
            <div className="row gap-8 wrap">
              <Badge size="small" color={isMsg ? 'primary' : a.kind === 'finance' ? 'notice' : 'neutral'}>
                {isMsg ? 'Messages customers · needs your approval' : a.kind === 'finance' ? 'Money decision · always yours' : 'Setting change'}
              </Badge>
              <Badge size="small" color={confColor[a.confidence]}>{`${a.confidence} confidence`}</Badge>
              <SourceBadge source={a.basis} />
            </div>
            <Heading size="medium">{a.title}</Heading>
            <Text size="small" color="surface.text.gray.muted">{merchant.name} · {layerName[a.layer]} layer · runs on {a.executesVia}</Text>
          </div>
          <button className="icon-btn" aria-label="Close" onClick={() => openDrawer(null)}><CloseIcon size="large" color="surface.icon.gray.muted" /></button>
        </div>

        <div className="drawer-body">
          <div className="stack gap-20">
            <div className="stack gap-8">
              <Text size="small" weight="semibold" color="surface.text.gray.muted">WHY SEASONS SUGGESTS THIS</Text>
              <ul className="why">{a.why.map((w) => <li key={w}>{w}</li>)}</ul>
              <Text size="small" color="surface.text.gray.muted">Expected: {a.impact}</Text>
            </div>

            {isMsg && a.recipients && (
              <div className="stack gap-8">
                <div className="row between">
                  <Text size="small" weight="semibold" color="surface.text.gray.muted">WHO GETS IT{totalNote}</Text>
                  <Text size="small" color="surface.text.gray.muted">{chosen} selected</Text>
                </div>
                <div className="recips">
                  {a.recipients.map((r) => (
                    <div key={r.name} className={`recip ${r.optedIn ? '' : 'off'}`}>
                      <Checkbox
                        isChecked={!!selected[r.name]}
                        isDisabled={!r.optedIn}
                        onChange={({ isChecked }) => setSelected((s) => ({ ...s, [r.name]: isChecked }))}
                      >{r.name}</Checkbox>
                      <div className="stack" style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <span className="rd">{r.detail}</span>
                        {!r.optedIn && <span className="rd" style={{ color: 'var(--negative)' }}>Excluded · {r.excludedReason}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                {excluded.length > 0 && <Text size="small" color="surface.text.gray.muted">Customers without WhatsApp opt-in are never messaged. You can’t override this.</Text>}
              </div>
            )}

            {isMsg && (
              <TextArea label="Message (edit freely)" value={msg} onChange={({ value }) => setMsg(value ?? '')} numberOfLines={5}
                helpText="{first_name} and the payment link are filled in for each customer." />
            )}

            {!isMsg && a.settingChange && (
              <div className="stack gap-8">
                <Text size="small" weight="semibold" color="surface.text.gray.muted">WHAT CHANGES</Text>
                <div className="change">
                  <div className="h">Setting</div><div className="h">Now</div><div className="h">After approval</div>
                  {a.settingChange.map((c) => (
                    <React.Fragment key={c.label}><div>{c.label}</div><div>{c.from}</div><div className="to">{c.to}</div></React.Fragment>
                  ))}
                </div>
                {a.kind === 'finance' && (
                  <Text size="small" color="surface.text.gray.muted">
                    Seasons never applies for money on its own. Approving only prefills the request and sets the reminder; you review and submit the application yourself.
                  </Text>
                )}
              </div>
            )}

            <div className="guard">
              <Text size="small" weight="semibold" color="surface.text.gray.subtle">Guardrails checked</Text>
              {(isMsg
                ? ['Only customers who opted in to WhatsApp', `No messages between 9 PM and 9 AM${settings.quietHours ? '' : ' (off in Controls)'}`, `Max ${settings.maxNudges} messages per customer per month`, `Any discount within your ${settings.discountCap}% limit`, 'Every message has a STOP opt-out']
                : a.kind === 'finance'
                  ? ['Never submitted without you', 'Shows the full cost before you apply', 'You can cancel any time before submitting']
                  : ['Reversible from Controls at any time', 'Logged in Activity with who approved it']
              ).map((g) => (
                <div key={g}><CheckCircleIcon size="small" color="feedback.icon.positive.intense" />{g}</div>
              ))}
            </div>
          </div>

          <div className="stack gap-12" style={{ alignItems: 'center' }}>
            {isMsg ? (
              <>
                <Text size="small" weight="semibold" color="surface.text.gray.muted">PREVIEW · WHAT {firstSelected ? firstSelected.name.split(' ')[0].toUpperCase() : 'THE CUSTOMER'} SEES</Text>
                <Phone title={merchant.name} sub="Business account" short>
                  <span className="wa-day">{a.when.split('·')[0].trim()}</span>
                  <div className="bubble in"><MessageBody text={fillTemplate(msg, firstSelected?.name ?? 'Customer')} /><span className="time">{(a.when.split('·')[1] ?? ' 7:30 PM').trim()}</span></div>
                </Phone>
              </>
            ) : (
              <div className="card card-pad stack gap-8" style={{ width: '100%' }}>
                <Text size="small" weight="semibold" color="surface.text.gray.muted">WHEN</Text>
                <Text size="medium" weight="semibold">{a.when}</Text>
                <Text size="small" weight="semibold" color="surface.text.gray.muted">RUNS ON</Text>
                <Text size="medium">{a.executesVia}</Text>
                <div className="row gap-8 mt-8"><LockIcon size="small" color="surface.icon.gray.muted" /><Text size="small" color="surface.text.gray.muted">Undo any time from this card or Controls.</Text></div>
              </div>
            )}
          </div>
        </div>

        <div className="drawer-foot">
          <div className="row gap-8"><InfoIcon size="small" color="surface.icon.gray.muted" /><Text size="small" color="surface.text.gray.muted">Your decision and any edits teach Seasons what to suggest next time.</Text></div>
          <div className="row gap-8">
            <Button variant="tertiary" onClick={() => skip(a)}>Skip</Button>
            <Button variant="secondary" onClick={() => openDrawer(null)}>Cancel</Button>
            <Button onClick={doApprove} isDisabled={isMsg && chosen === 0}>{isMsg ? 'Approve & schedule' : a.kind === 'finance' ? 'Approve & prefill' : 'Approve change'}</Button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ---------------- RAY on WhatsApp entry ---------------- */

export function RayWhatsApp({ onOpen }: { onOpen?: () => void }) {
  const { merchant } = useSeasons();
  return (
    <Phone title="RAY by Razorpay" sub="Your AI account manager">
      <span className="wa-day">Today</span>
      <div className="bubble in">
        {merchant.whatsapp}
        <span className="time">8:03 AM</span>
        <button className="wa-btn" onClick={onOpen}>Review in Seasons</button>
      </div>
      <div className="bubble out">Show me what you’ll send first<span className="time">8:05 AM ✓✓</span></div>
      <div className="bubble in">Sure. Every message waits for your approval. Tap “Review in Seasons” to see the drafts and who gets them.<span className="time">8:05 AM</span></div>
    </Phone>
  );
}

export function WhatsAppModal() {
  const { waOpen, setWaOpen, setView, merchant } = useSeasons();
  if (!waOpen) return null;
  const go = () => { setWaOpen(false); setView(merchant.headline.layer); };
  return (
    <div className="modal-wrap" onClick={() => setWaOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <RayWhatsApp onOpen={go} />
        <div className="stack gap-12">
          <Badge size="small" color="primary">How the merchant hears about it</Badge>
          <Heading size="medium">Seasons comes to you on WhatsApp</Heading>
          <Text size="medium" color="surface.text.gray.subtle">
            Merchants don’t have to discover Seasons in a menu. When a moment is coming up, RAY sends a short summary on WhatsApp, and the merchant reviews and approves in the dashboard.
          </Text>
          <div className="row gap-8">
            <Button onClick={go} icon={ArrowRightIcon} iconPosition="right">Open the plan</Button>
            <Button variant="tertiary" onClick={() => setWaOpen(false)}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Toast() {
  const { toast } = useSeasons();
  if (!toast) return null;
  return <div className="toast"><CheckCircleIcon size="small" color="surface.icon.staticWhite.normal" />{toast}</div>;
}

export { MessageCircleIcon };
