import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge, Button, Heading, Text, Checkbox, TextArea,
  HomeIcon, TransactionsIcon, SettlementsIcon, ReportsIcon, PaymentLinkIcon, PaymentPagesIcon,
  QRCodeIcon, SubscriptionsIcon, InvoicesIcon, OptimizerIcon, EngageIcon, AgentStudioIcon, RayIcon,
  SettingsIcon, CalendarIcon, SparklesIcon, CloseIcon, CheckCircleIcon, LockIcon, ClockIcon,
  ShoppingBagIcon, EducationIcon, AwardIcon, ThermometerIcon, MessageCircleIcon, ArrowRightIcon,
  InfoIcon, SearchIcon, BellIcon, HelpCircleIcon, TrendingUpIcon, HistoryIcon, SlidersIcon,
  RazorpayIcon, SunIcon, PlayCircleIcon, ChevronLeftIcon, ChevronRightIcon, AlertTriangleIcon, TranslateIcon, ChevronDownIcon, CheckIcon,
} from '@razorpay/blade/components';
import { useSeasons, View } from './state';
import { merchants, Action, Merchant, Layer, TODAY } from './data';
import { products, runsOn, readiness, quickInsights, tourSteps, linkAmount } from './extras';
import { createTestLinks } from './razorpay';
import { aiRewrite, RewriteMode } from './ai';

/* ---------------- Shell ---------------- */

export function TopNav() {
  return (
    <header className="topnav">
      <div className="brand">
        <RazorpayIcon size="xlarge" color="surface.icon.primary.normal" />
        Razorpay
      </div>
      <nav className="topnav-tabs">
        <span className="topnav-tab">Home</span>
        <span className="topnav-tab active">Payments</span>
        <span className="topnav-tab">More</span>
      </nav>
      <div className="topnav-right">
        <span className="proto-badge">Prototype</span>
        <LanguageSwitch />
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
  const { merchantId, setMerchantId, view, setView, pendingCount, setTourStep } = useSeasons();
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
        <div className="stack gap-4" data-tour="title">
          <div className="page-title">
            <span className="seasons-logo"><SunIcon size="medium" color="surface.icon.staticWhite.normal" /></span>
            <Heading size="large">Seasons</Heading>
          </div>
          <Text size="medium" color="surface.text.gray.muted">
            Diwali boxes, summer batches, Friday regulars: Seasons knows your rhythm and gets you ready before it hits.
          </Text>
        </div>
        <div className="row gap-8 wrap">
          <span className="today-pill">Simulated date · {TODAY}</span>
          <Button size="small" variant="secondary" icon={PlayCircleIcon} onClick={() => setTourStep(0)}>Take the tour</Button>
        </div>
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
        </div>
        <RunsOn id={a.id} />
        {st === 'approved' && status[a.id]?.linkMode && <CreatedLinks links={status[a.id]?.links} mode={status[a.id]!.linkMode!} />}
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
  return <div className="stack gap-12">{list.map((a, i) => <div key={a.id} data-tour={i === 0 ? 'first-action' : undefined}><ActionCard a={a} /></div>)}</div>;
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
  const [busy, setBusy] = useState<RewriteMode | null>(null);
  const [aiNote, setAiNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [lang, setLang] = useState<'en' | 'hindi' | 'hinglish'>('en');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!a) return;
    const s: Record<string, boolean> = {};
    a.recipients?.forEach((r) => { s[r.name] = r.optedIn; });
    setSelected(s);
    setMsg(a.message ?? '');
    setAiNote(null);
    setBusy(null);
    setLang('en');
  }, [a]);

  const rewrite = async (mode: RewriteMode) => {
    if (!a) return;
    setBusy(mode); setAiNote(null);
    // Translations always start from the original English draft, so switching languages doesn't compound.
    const isLang = mode === 'hindi' || mode === 'hinglish';
    const source = isLang ? (a.message ?? msg) : msg;
    const r = await aiRewrite(merchant.name, source, mode, settings.discountCap);
    if (r.ok) {
      setMsg(r.message);
      if (isLang) setLang(mode);
      setAiNote({ ok: true, text: `${isLang ? 'Translated' : 'Rewritten'} by Gemini · Seasons checked it: name and link kept, STOP kept, no new discounts or amounts.` });
    }
    else setAiNote({ ok: false, text: `${r.reason}. Your message is unchanged.` });
    setBusy(null);
  };

  const firstSelected = useMemo(() => a?.recipients?.find((r) => selected[r.name]), [a, selected]);
  if (!a) return null;

  const chosen = a.recipients?.filter((r) => selected[r.name]).length ?? 0;
  const excluded = a.recipients?.filter((r) => !r.optedIn) ?? [];
  const totalNote = a.id === 'm-winback' ? ` (showing 8 of 86 · ${chosen === 6 ? 64 : chosen} will receive it)` : '';
  const isMsg = a.kind === 'message';

  const doApprove = async () => {
    if (isMsg) {
      const n = a.id === 'm-winback' && chosen === 6 ? 64 : a.id === 'k-timing' && chosen === 5 ? 108 : chosen;
      const note = `${a.when} · ${n} recipient${n === 1 ? '' : 's'}`;
      const detail = `${n} recipients, message ${msg === a.message ? 'as drafted' : 'edited by you'}${lang !== 'en' ? ` (${lang === 'hindi' ? 'Hindi' : 'Hinglish'})` : ''}.`;
      const la = linkAmount[a.id];
      if (la) {
        setCreating(true);
        const names = (a.recipients ?? []).filter((r) => selected[r.name]).map((r) => r.name);
        const r = await createTestLinks(names, la.amount, la.description, merchant.name);
        setCreating(false);
        if (r.ok) approve(a, note, detail, r.links, 'test');
        else approve(a, note, `${detail} (${r.reason}; sample links shown.)`, undefined, 'sample');
      } else approve(a, note, detail);
    } else {
      approve(a, a.when, a.settingChange?.map((c) => `${c.label}: ${c.to}`).join('; ') ?? '');
    }
  };

  return (
    <>
      <div className="scrim" onClick={() => openDrawer(null)} />
      <aside className="drawer" role="dialog" aria-label="Review action" data-tour="drawer">
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
            <Text size="small" color="surface.text.gray.muted">{merchant.name} · {layerName[a.layer]} layer</Text>
            <RunsOn id={a.id} compact />
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
              <div className="stack gap-8">
                <TextArea label="Message (edit freely)" value={msg} onChange={({ value }) => setMsg(value ?? '')} numberOfLines={5}
                  helpText="{first_name} and the payment link are filled in for each customer." />
                <div className="msg-tools">
                  <div className="row gap-8 wrap">
                    <span className="tool-label"><TranslateIcon size="small" color="surface.icon.primary.normal" />Message language</span>
                    <div className="seg lang-seg">
                      <button className={lang === 'en' ? 'on' : ''} disabled={!!busy} onClick={() => { setMsg(a.message ?? ''); setLang('en'); setAiNote(null); }}>English</button>
                      <button className={lang === 'hindi' ? 'on' : ''} disabled={!!busy} onClick={() => rewrite('hindi')}>{busy === 'hindi' ? 'Translating…' : 'हिंदी'}</button>
                      <button className={lang === 'hinglish' ? 'on' : ''} disabled={!!busy} onClick={() => rewrite('hinglish')}>{busy === 'hinglish' ? 'Translating…' : 'Hinglish'}</button>
                    </div>
                    <span className="soon-langs" title="More languages coming soon">
                      {['தமிழ்', 'తెలుగు', 'मराठी', 'বাংলা', 'ಕನ್ನಡ'].map((l) => <span key={l} className="soon-lang">{l}</span>)}
                      <span className="soon-tag">Coming soon</span>
                    </span>
                  </div>
                  <div className="row gap-8 wrap">
                    <span className="tool-label"><SparklesIcon size="small" color="surface.icon.primary.normal" />Adjust with AI</span>
                    {([['shorter', 'Shorter'], ['friendlier', 'Friendlier']] as [RewriteMode, string][]).map(([mode, label]) => (
                      <Button key={mode} size="xsmall" variant="secondary" isLoading={busy === mode} isDisabled={!!busy && busy !== mode} onClick={() => rewrite(mode)}>{label}</Button>
                    ))}
                    {msg !== a.message && <Button size="xsmall" variant="tertiary" onClick={() => { setMsg(a.message ?? ''); setLang('en'); setAiNote(null); }}>Back to original</Button>}
                  </div>
                </div>
                {aiNote && <div className={`ai-note ${aiNote.ok ? 'ok' : 'no'}`}>{aiNote.text}</div>}
              </div>
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
                <RunsOn id={a.id} compact />
                <div className="row gap-8 mt-8"><LockIcon size="small" color="surface.icon.gray.muted" /><Text size="small" color="surface.text.gray.muted">Undo any time from this card or Controls.</Text></div>
              </div>
            )}
          </div>
        </div>

        <div className="drawer-foot">
          <div className="row gap-8"><InfoIcon size="small" color="surface.icon.gray.muted" /><Text size="small" color="surface.text.gray.muted">{creating ? 'Creating Payment Links in Razorpay test mode…' : linkAmount[a.id] ? `On approval, Seasons creates real Razorpay test-mode Payment Links (₹${linkAmount[a.id].amount.toLocaleString('en-IN')}) for the customers shown. Nothing is sent.` : 'Your decision and any edits teach Seasons what to suggest next time.'}</Text></div>
          <div className="row gap-8">
            <Button variant="tertiary" onClick={() => skip(a)}>Skip</Button>
            <Button variant="secondary" onClick={() => openDrawer(null)}>Cancel</Button>
            <Button onClick={doApprove} isLoading={creating} isDisabled={(isMsg && chosen === 0) || creating}>{isMsg ? 'Approve & schedule' : a.kind === 'finance' ? 'Approve & prefill' : 'Approve change'}</Button>
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

/* ---------------- Runs on (Razorpay products, with info) ---------------- */

const statusLabel = { existing: 'Existing Razorpay product', seasons: 'New in Seasons', unverified: 'Suggested · not found in Razorpay’s dashboard or docs' };

export function RunsOn({ id, compact }: { id: string; compact?: boolean }) {
  const ids = runsOn[id] ?? [];
  return (
    <div className={`runs-on ${compact ? 'compact' : ''}`}>
      {!compact && <span className="runs-label">Runs on</span>}
      {ids.map((pid) => {
        const p = products[pid];
        return (
          <span key={pid} className={`pchip ${p.status}`} tabIndex={0}>
            {p.status === 'unverified' && <AlertTriangleIcon size="xsmall" color="currentColor" />}
            {p.name}
            <InfoIcon size="xsmall" color="currentColor" />
            <span className="pop" role="tooltip">
              <span className={`pop-tag ${p.status}`}>{statusLabel[p.status]}</span>
              <span className="pop-title">{p.name}</span>
              <span className="pop-text">{p.text}</span>
            </span>
          </span>
        );
      })}
    </div>
  );
}

/* ---------------- Quick insights carousel ---------------- */

export function QuickInsights() {
  const { merchant, setView, status } = useSeasons();
  const base = quickInsights[merchant.id] ?? [];
  const approved = merchant.actions.filter((a) => status[a.id]?.state === 'approved');
  const slides = approved.length
    ? [{ tag: 'Done' as const, title: `You approved ${approved.length} action${approved.length > 1 ? 's' : ''} today`, text: approved.map((a) => a.title).slice(0, 2).join(' · ') + (approved.length > 2 ? ' …' : ''), go: undefined }, ...base]
    : base;
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  useEffect(() => { setI(0); }, [merchant.id, approved.length]);
  useEffect(() => {
    if (hover || slides.length < 2) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % slides.length), 5000);
    return () => window.clearInterval(t);
  }, [hover, slides.length]);
  if (!slides.length) return null;
  const s = slides[Math.min(i, slides.length - 1)];
  const tagColor = { Done: 'positive', 'You could': 'primary', 'Heads-up': 'notice', Pattern: 'information' } as const;
  return (
    <div className="card qi" data-tour="insights" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="qi-head">
        <span className="layer-tag"><SparklesIcon size="small" color="surface.icon.primary.normal" />Quick insights</span>
        <div className="row gap-4">
          <button className="icon-btn" aria-label="Previous insight" onClick={() => setI((x) => (x - 1 + slides.length) % slides.length)}><ChevronLeftIcon size="small" color="surface.icon.gray.muted" /></button>
          <button className="icon-btn" aria-label="Next insight" onClick={() => setI((x) => (x + 1) % slides.length)}><ChevronRightIcon size="small" color="surface.icon.gray.muted" /></button>
        </div>
      </div>
      <div className="qi-slide" key={s.title}>
        <Badge size="small" color={tagColor[s.tag]}>{s.tag}</Badge>
        <div className="qi-title">{s.title}</div>
        <Text size="small" color="surface.text.gray.subtle">{s.text}</Text>
        {s.go && <button className="qi-link" onClick={() => setView(s.go!)}>Open <ArrowRightIcon size="xsmall" color="currentColor" /></button>}
      </div>
      <div className="qi-dots">
        {slides.map((x, k) => <button key={x.title} aria-label={`Slide ${k + 1}`} className={`qi-dot ${k === i ? 'on' : ''}`} onClick={() => setI(k)} />)}
      </div>
    </div>
  );
}

/* ---------------- Data readiness ---------------- */

export function ReadinessPanel() {
  const { merchant } = useSeasons();
  const r = readiness[merchant.id];
  const predictive = r.mode === 'predictive';
  return (
    <div className={`card card-pad readiness ${predictive ? 'predictive' : ''}`} data-tour="readiness">
      <div className="row between wrap gap-8">
        <div className="stack gap-4">
          <div className="row gap-8">
            <span style={{ flexShrink: 0 }}><Badge size="small" color={predictive ? 'information' : 'positive'}>{predictive ? 'Predictive mode' : 'Your own data'}</Badge></span>
            <Text size="small" color="surface.text.gray.muted">Seasons checked your account: {r.found}</Text>
          </div>
          {predictive && (
            <Text size="medium" weight="semibold">New on Razorpay? Seasons starts predicting from day one, and switches to your own patterns as they appear.</Text>
          )}
        </div>
      </div>
      <div className="ready-rows">
        {r.rows.map((row) => (
          <div className="ready-row" key={row.layer}>
            <Text size="small" weight="semibold">{layerName[row.layer]}</Text>
            <div className="bar"><span style={{ width: `${Math.max(4, Math.round(row.pct * 100))}%` }} className={row.pct >= 1 ? 'full' : ''} /></div>
            <div className="stack">
              <Text size="small" color="surface.text.gray.subtle">{row.status}</Text>
              {row.until && <Text size="xsmall" color="surface.text.gray.muted">{row.until}</Text>}
            </div>
          </div>
        ))}
      </div>
      <div className="row gap-8 mt-12">
        <InfoIcon size="small" color="surface.icon.gray.muted" />
        <Text size="xsmall" color="surface.text.gray.muted">
          Predictions use combined numbers from at least 50 similar merchants, so no single business can be identified. Needs about 8 weeks for weekly patterns, 3 cycles for monthly, and one full year for annual.
        </Text>
      </div>
    </div>
  );
}

/* ---------------- Confirm dialog ---------------- */

export function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onCancel }:
  { open: boolean; title: string; body: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className="modal-wrap" onClick={onCancel}>
      <div className="confirm" role="alertdialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="row gap-8"><AlertTriangleIcon size="medium" color="feedback.icon.notice.intense" /><Heading size="small">{title}</Heading></div>
        <Text size="medium" color="surface.text.gray.subtle">{body}</Text>
        <div className="row gap-8" style={{ justifyContent: 'flex-end' }}>
          <Button variant="tertiary" onClick={onCancel}>Keep as it is</Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Guided tour ---------------- */

export function Tour() {
  const { tourStep, setTourStep, setMerchantId, setView, openDrawer } = useSeasons();
  useEffect(() => {
    document.querySelectorAll('.tour-focus').forEach((el) => el.classList.remove('tour-focus'));
    if (tourStep === null) return;
    const st = tourSteps[tourStep];
    setMerchantId(st.merchant);
    setView(st.view);
    const t1 = window.setTimeout(() => {
      if (st.drawer) {
        const m = merchants.find((x) => x.id === st.merchant)!;
        openDrawer(m.actions.find((a) => a.id === st.drawer) ?? null);
      }
    }, 60);
    const t2 = window.setTimeout(() => {
      const el = document.querySelector(`[data-tour="${st.target}"]`);
      if (el) {
        el.classList.add('tour-focus');
        if (st.target !== 'drawer' && st.target !== 'lang') el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 260);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [tourStep]); // eslint-disable-line react-hooks/exhaustive-deps

  if (tourStep === null) return null;
  const st = tourSteps[tourStep];
  const last = tourStep === tourSteps.length - 1;
  const end = () => { openDrawer(null); setTourStep(null); setMerchantId('mithas'); setView('overview'); };
  const go = (n: number) => { if (st.drawer) openDrawer(null); setTourStep(n); };
  return (
    <div className={`tour-card ${st.drawer ? 'left' : ''}`} role="dialog" aria-label="Product tour">
      <div className="row between">
        <Text size="xsmall" weight="semibold" color="surface.text.primary.normal">STEP {tourStep + 1} OF {tourSteps.length}</Text>
        <button className="icon-btn" aria-label="Close tour" onClick={end}><CloseIcon size="small" color="surface.icon.gray.muted" /></button>
      </div>
      <Heading size="small">{st.title}</Heading>
      <Text size="small" color="surface.text.gray.subtle">{st.body}</Text>
      <div className="tour-progress"><span style={{ width: `${((tourStep + 1) / tourSteps.length) * 100}%` }} /></div>
      <div className="row between">
        <Button size="small" variant="tertiary" onClick={end}>Skip tour</Button>
        <div className="row gap-8">
          {tourStep > 0 && <Button size="small" variant="secondary" onClick={() => go(tourStep - 1)}>Back</Button>}
          <Button size="small" onClick={() => (last ? end() : go(tourStep + 1))}>{last ? 'Finish' : 'Next'}</Button>
        </div>
      </div>
    </div>
  );
}


/* ---------------- Dashboard language switch ---------------- */

const dashLangs = [
  { code: 'en', label: 'English', native: 'English', live: true },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', live: false },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', live: false },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', live: false },
  { code: 'mr', label: 'Marathi', native: 'मराठी', live: false },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', live: false },
];

export function LanguageSwitch() {
  const { showToast } = useSeasons();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [open]);
  return (
    <div className="lang-switch" data-tour="lang" onClick={(e) => e.stopPropagation()}>
      <button className="lang-btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <TranslateIcon size="small" color="surface.icon.gray.subtle" />EN<ChevronDownIcon size="xsmall" color="surface.icon.gray.muted" />
      </button>
      {open && (
        <div className="lang-menu" role="menu">
          <div className="lang-head">Dashboard language</div>
          {dashLangs.map((l) => (
            <button key={l.code} role="menuitem" className={`lang-item ${l.live ? '' : 'soon'}`}
              onClick={() => { setOpen(false); if (!l.live) showToast(`${l.label} dashboard coming soon. Customer messages can already go out in Hindi.`); }}>
              <span>{l.native}{l.native !== l.label && <span className="lang-en"> · {l.label}</span>}</span>
              {l.live ? <CheckIcon size="small" color="surface.icon.primary.normal" /> : <span className="soon-tag">Coming soon</span>}
            </button>
          ))}
          <div className="lang-foot">Customer messages: English, हिंदी and Hinglish available now</div>
        </div>
      )}
    </div>
  );
}


/* ---------------- Payment Links created on approval ---------------- */

export function CreatedLinks({ links, mode }: { links?: { name: string; url?: string; ok: boolean }[]; mode: 'test' | 'sample' }) {
  if (mode === 'sample' || !links?.length) {
    return <div className="links-box sample"><Text size="xsmall" color="surface.text.gray.muted">Sample links shown · Razorpay test keys weren’t available, so nothing was created.</Text></div>;
  }
  const ok = links.filter((l) => l.ok && l.url);
  return (
    <div className="links-box">
      <div className="row gap-8 wrap">
        <Badge size="xsmall" color="positive" icon={CheckCircleIcon}>{`${ok.length} Payment Link${ok.length === 1 ? '' : 's'} created in Razorpay`}</Badge>
        <span className="test-tag">Test mode · nothing sent</span>
      </div>
      <div className="links-list">
        {ok.slice(0, 4).map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="plink">{l.name.split(' (')[0]} <span>{l.url!.replace('https://', '')}</span></a>
        ))}
        {ok.length > 4 && <span className="plink more">+{ok.length - 4} more</span>}
      </div>
    </div>
  );
}
