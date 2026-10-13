import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { merchants, Merchant, Action, Layer, lessonsFromFeedback } from './data';

export type View = 'overview' | 'year' | 'month' | 'week' | 'review' | 'controls' | 'activity';
export type ActionState = { state: 'pending' | 'approved' | 'skipped'; note?: string };
export type LogEntry = { time: string; merchantId: string; actor: 'Seasons' | 'You'; text: string };
export type Lesson = { signal: string; change: string; layer: Layer; applied: boolean };
export type Settings = {
  discountCap: number;
  quietHours: boolean;
  maxNudges: number;
  layers: Record<Layer, boolean>;
  paused: boolean;
  smsFallback: boolean;
};

const defaultSettings = (): Settings => ({
  discountCap: 20,
  quietHours: true,
  maxNudges: 2,
  layers: { year: true, month: true, week: true },
  paused: false,
  smsFallback: true,
});

const seedLog: LogEntry[] = [
  { time: 'Mon 7 Sep · 8:02 AM', merchantId: 'mithas', actor: 'Seasons', text: 'Diwali plan created: 4 actions (Diwali moves to 8 Nov; rush expected ~18 Oct).' },
  { time: 'Mon 7 Sep · 8:02 AM', merchantId: 'mithas', actor: 'Seasons', text: 'Applied lesson from Rakhi review: stock funding moved 2 weeks earlier.' },
  { time: 'Mon 7 Sep · 8:03 AM', merchantId: 'mithas', actor: 'Seasons', text: 'Sent you a summary on WhatsApp (RAY).' },
  { time: 'Mon 7 Sep · 8:04 AM', merchantId: 'kata', actor: 'Seasons', text: 'October fee plan created: 108 students grouped by when they usually pay.' },
  { time: 'Mon 7 Sep · 8:05 AM', merchantId: 'courtside', actor: 'Seasons', text: 'Weekly check: 6 Friday regulars absent 3+ weeks; Tuesday 6–9 PM at 38%.' },
  { time: 'Mon 7 Sep · 8:06 AM', merchantId: 'thanda', actor: 'Seasons', text: 'Starter plan created from 240 similar merchants (21 days of your own data).' },
  { time: 'Mon 31 Aug · 9:10 PM', merchantId: 'mithas', actor: 'You', text: 'Skipped “Line up stock money” for Rakhi.' },
  { time: 'Thu 20 Aug · 7:30 PM', merchantId: 'mithas', actor: 'Seasons', text: 'Rakhi message sent to 41 opted-in past buyers (approved by you on 19 Aug).' },
];

interface Ctx {
  merchant: Merchant;
  merchantId: string;
  setMerchantId: (id: string) => void;
  view: View;
  setView: (v: View) => void;
  status: Record<string, ActionState>;
  approve: (a: Action, note: string, detail: string) => void;
  skip: (a: Action) => void;
  undo: (a: Action) => void;
  log: LogEntry[];
  drawer: Action | null;
  openDrawer: (a: Action | null) => void;
  waOpen: boolean;
  setWaOpen: (b: boolean) => void;
  toast: string | null;
  showToast: (t: string) => void;
  lessons: Record<string, Lesson[]>;
  makeLessons: (text: string) => void;
  toggleLesson: (i: number) => void;
  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;
  pendingCount: (layer?: Layer) => number;
}

const C = createContext<Ctx | null>(null);

const nowStamp = () => 'Mon 7 Sep · ' + new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

export function Provider({ children }: { children: React.ReactNode }) {
  const [merchantId, setMerchantIdRaw] = useState('mithas');
  const [view, setView] = useState<View>('overview');
  const [status, setStatus] = useState<Record<string, ActionState>>({});
  const [log, setLog] = useState<LogEntry[]>(seedLog);
  const [drawer, setDrawer] = useState<Action | null>(null);
  const [waOpen, setWaOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [settingsMap, setSettingsMap] = useState<Record<string, Settings>>({});

  const merchant = useMemo(() => merchants.find((m) => m.id === merchantId)!, [merchantId]);
  const settings = settingsMap[merchantId] ?? defaultSettings();

  const addLog = useCallback((actor: LogEntry['actor'], text: string) => {
    setLog((l) => [{ time: nowStamp(), merchantId, actor, text }, ...l]);
  }, [merchantId]);

  const showToast = useCallback((t: string) => {
    setToast(t);
    window.setTimeout(() => setToast((cur) => (cur === t ? null : cur)), 3200);
  }, []);

  const approve = useCallback((a: Action, note: string, detail: string) => {
    setStatus((s) => ({ ...s, [a.id]: { state: 'approved', note } }));
    addLog('You', `Approved “${a.title}”. ${detail}`);
    if (a.kind === 'message') addLog('Seasons', `Scheduled via ${a.executesVia}: ${note}.`);
    else addLog('Seasons', `Applied via ${a.executesVia}: ${note}.`);
    setDrawer(null);
    showToast(a.kind === 'message' ? `Scheduled · ${note}` : `Done · ${note}`);
  }, [addLog, showToast]);

  const skip = useCallback((a: Action) => {
    setStatus((s) => ({ ...s, [a.id]: { state: 'skipped' } }));
    addLog('You', `Skipped “${a.title}”. Seasons will learn from this.`);
    setDrawer(null);
    showToast('Skipped. Seasons won’t suggest this again this season.');
  }, [addLog, showToast]);

  const undo = useCallback((a: Action) => {
    setStatus((s) => ({ ...s, [a.id]: { state: 'pending' } }));
    addLog('You', `Undid decision on “${a.title}”.`);
  }, [addLog]);

  const makeLessons = useCallback((text: string) => {
    const ls = lessonsFromFeedback(text, merchantId).map((l) => ({ ...l, applied: false }));
    setLessons((m) => ({ ...m, [merchantId]: ls }));
    addLog('You', 'Shared season feedback.');
    addLog('Seasons', `Turned feedback into ${ls.length} proposed change${ls.length === 1 ? '' : 's'} for the next plan.`);
  }, [merchantId, addLog]);

  const toggleLesson = useCallback((i: number) => {
    setLessons((m) => {
      const ls = [...(m[merchantId] ?? [])];
      ls[i] = { ...ls[i], applied: !ls[i].applied };
      return { ...m, [merchantId]: ls };
    });
  }, [merchantId]);

  const updateSettings = useCallback((s: Partial<Settings>) => {
    setSettingsMap((m) => ({ ...m, [merchantId]: { ...(m[merchantId] ?? defaultSettings()), ...s } }));
  }, [merchantId]);

  const pendingCount = useCallback((layer?: Layer) =>
    merchant.actions.filter((a) => (!layer || a.layer === layer) && (status[a.id]?.state ?? 'pending') === 'pending').length,
  [merchant, status]);

  const setMerchantId = (id: string) => { setMerchantIdRaw(id); setDrawer(null); };

  const value: Ctx = {
    merchant, merchantId, setMerchantId, view, setView, status, approve, skip, undo, log,
    drawer, openDrawer: setDrawer, waOpen, setWaOpen, toast, showToast,
    lessons, makeLessons, toggleLesson, settings, updateSettings, pendingCount,
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}

export const useSeasons = () => {
  const c = useContext(C);
  if (!c) throw new Error('no provider');
  return c;
};
