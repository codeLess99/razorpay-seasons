import { Layer } from './data';

/* ------------------------------------------------------------------
   Razorpay products each action runs on.
   status:
   - existing:   a Razorpay product we found in the dashboard or public docs
   - seasons:    new, part of Seasons itself
   - unverified: suggested; we looked for it in Razorpay's dashboard and docs and couldn't find it
------------------------------------------------------------------- */
export type ProductStatus = 'existing' | 'seasons' | 'unverified';
export interface Product { name: string; status: ProductStatus; text: string }

export const products: Record<string, Product> = {
  'payment-links': { name: 'Payment Links', status: 'existing', text: 'Create a link and share it to get paid, with no website needed.' },
  'payment-links-batch': { name: 'Payment Links · batch upload', status: 'existing', text: 'Create many links at once from a file. Seasons fills in the file and the schedule for you.' },
  'whatsapp': { name: 'WhatsApp (your Business account)', status: 'existing', text: 'Razorpay supports payment links and reminders on WhatsApp once your WhatsApp Business account is linked through a provider.' },
  'engage': { name: 'Razorpay Engage', status: 'existing', text: 'Razorpay’s marketing suite: offers, gift cards, loyalty, and campaigns on WhatsApp, SMS and email.' },
  'offers': { name: 'Offers', status: 'existing', text: 'Discounts applied at checkout. Seasons keeps them within the limit you set.' },
  'capital': { name: 'Razorpay Capital', status: 'existing', text: 'Working capital loans and cash advances. Seasons only prefills a request; you review and apply yourself.' },
  'checkout-config': { name: 'Checkout payment configuration', status: 'existing', text: 'Choose and reorder the payment methods customers see first (announced at Razorpay Sprint 2026).' },
  'card-upi-retry': { name: 'Offer UPI after a failed card payment', status: 'unverified', text: 'Suggested. We looked for this setting in Razorpay’s dashboard and docs and couldn’t find it. Razorpay’s Intelligent Retry Engine covers AutoPay debits only.' },
  'international': { name: 'International payments', status: 'existing', text: 'Accept cards issued outside India. Needs a quick review by Razorpay before it goes live.' },
  'affordability': { name: 'Affordability (EMI & Pay Later)', status: 'existing', text: 'Card EMI, cardless EMI and Pay Later options at checkout.' },
  'upi-autopay': { name: 'UPI AutoPay', status: 'existing', text: 'Recurring payments through a UPI mandate. ₹1 registration was announced at Razorpay Sprint 2026.' },
  'payment-pages': { name: 'Payment Pages', status: 'existing', text: 'A simple checkout page you can share, with no website or code.' },
  'slot-booking': { name: 'Time slots on Payment Pages', status: 'unverified', text: 'Suggested. We couldn’t find time-slot booking for Payment Pages in Razorpay’s dashboard or docs; today this may need a separate booking tool.' },
  'seasons-timing': { name: 'Seasons send-time', status: 'seasons', text: 'New in Seasons: picks when each message goes out, based on when that customer usually pays.' },
  'seasons-reminder': { name: 'Seasons reminders', status: 'seasons', text: 'New in Seasons: a reminder to you (in the dashboard and on WhatsApp) at the right moment.' },
  'seasons-approval': { name: 'Seasons approval step', status: 'seasons', text: 'New in Seasons: asks you before something happens, and shows the history that matters.' },
};

export const runsOn: Record<string, string[]> = {
  'm-winback': ['payment-links', 'whatsapp'],
  'm-cards': ['checkout-config', 'card-upi-retry'],
  'm-stock': ['capital', 'seasons-reminder'],
  'm-intl': ['international'],
  'm-salary': ['engage', 'seasons-timing'],
  'm-weekend': ['seasons-timing'],
  'k-timing': ['payment-links-batch', 'whatsapp', 'seasons-timing'],
  'k-hold': ['seasons-approval'],
  'k-expiry': ['payment-links-batch'],
  'k-autopay': ['upi-autopay'],
  'k-winter': ['payment-pages', 'whatsapp'],
  'k-trial': ['payment-pages', 'slot-booking'],
  'c-regulars': ['payment-links', 'whatsapp'],
  'c-tuesday': ['offers', 'engage'],
  'c-dues': ['payment-links', 'whatsapp', 'seasons-timing'],
  'c-season': ['payment-pages', 'whatsapp'],
  't-emi': ['affordability'],
  't-stock': ['seasons-reminder', 'capital'],
  't-weekend': ['payment-links', 'whatsapp'],
};

/* ------------------------------------------------------------------
   Data readiness: how much history Seasons has for each layer.
   Seasons needs ~8 weeks for weekly, ~3 cycles for monthly, one full year for annual.
------------------------------------------------------------------- */
export interface Readiness { layer: Layer; pct: number; status: string; until?: string }
export const readiness: Record<string, { mode: 'own' | 'predictive'; found: string; rows: Readiness[] }> = {
  mithas: {
    mode: 'own',
    found: '11 months of payments, including one full festive season',
    rows: [
      { layer: 'week', pct: 1, status: 'Your own data · 48 weeks' },
      { layer: 'month', pct: 1, status: 'Your own data · 11 cycles' },
      { layer: 'year', pct: 1, status: 'Your own data · Diwali, Christmas & Rakhi seen once' },
    ],
  },
  kata: {
    mode: 'own',
    found: '2.5 years of payments',
    rows: [
      { layer: 'week', pct: 1, status: 'Your own data' },
      { layer: 'month', pct: 1, status: 'Your own data · 32 fee cycles' },
      { layer: 'year', pct: 1, status: 'Your own data · 2 New Year waves seen' },
    ],
  },
  courtside: {
    mode: 'own',
    found: '20 months of payments',
    rows: [
      { layer: 'week', pct: 1, status: 'Your own data · 87 weeks' },
      { layer: 'month', pct: 1, status: 'Your own data · 20 cycles' },
      { layer: 'year', pct: 1, status: 'Your own data · 1 high season seen' },
    ],
  },
  thanda: {
    mode: 'predictive',
    found: '21 days of payments (since 17 Aug)',
    rows: [
      { layer: 'week', pct: 21 / 56, status: 'Early signal from your 3 weeks', until: 'Yours fully in 5 weeks (12 Oct)' },
      { layer: 'month', pct: 21 / 90, status: 'Predicted from 240 similar merchants', until: 'Yours from early December' },
      { layer: 'year', pct: 21 / 365, status: 'Predicted from 240 similar merchants', until: 'Yours from August 2027' },
    ],
  },
};

/* ------------------------------------------------------------------
   Quick insights carousel
------------------------------------------------------------------- */
export interface Slide { tag: 'Done' | 'You could' | 'Heads-up' | 'Pattern'; title: string; text: string; go?: Layer | 'review' }
export const quickInsights: Record<string, Slide[]> = {
  mithas: [
    { tag: 'Done', title: 'Rakhi message brought back 9 buyers', text: '₹18,450 from 41 past buyers you approved on 19 Aug.', go: 'review' },
    { tag: 'You could', title: '64 of last Diwali’s buyers are a message away', text: 'Early access on 1 Oct, before the rush and before marketplace sales.', go: 'year' },
    { tag: 'Heads-up', title: 'Card payments failed 23% of the time last peak', text: 'Putting UPI first at checkout fixes most of it before volumes rise.', go: 'year' },
    { tag: 'Pattern', title: 'Sunday 6–9 PM is your best slot', text: '2.6× your weekly average. Saturday 7 PM is the best time to message.', go: 'week' },
  ],
  kata: [
    { tag: 'Done', title: 'September: 95% of fees in by the 8th', text: '₹4.00L of ₹4.20L collected. 7 students still unpaid.', go: 'review' },
    { tag: 'You could', title: '38 families have paid on time 6 months running', text: 'Offer them UPI AutoPay and stop sending them monthly links.', go: 'month' },
    { tag: 'Heads-up', title: '9 links expired before parents opened them', text: 'Sending on WhatsApp when each family usually pays fixes most of these.', go: 'month' },
    { tag: 'Pattern', title: 'Saturday trial classes were full 5 of the last 8 weeks', text: 'Two more slots between 9 and 12 would fit demand.', go: 'week' },
  ],
  courtside: [
    { tag: 'Done', title: 'Weekend tournament message: 22 bookings', text: '₹26,400 from one message sent on a Thursday at 7 PM.', go: 'review' },
    { tag: 'You could', title: '6 Friday regulars have gone quiet', text: 'A personal check-in on Thursday 7 PM usually brings half of them back.', go: 'week' },
    { tag: 'You could', title: 'Tuesday 6–9 PM runs at 38% of a normal evening', text: 'A members-only offer within your 20% limit could fill it.', go: 'week' },
    { tag: 'Heads-up', title: 'High season starts around 3 Oct', text: '74 members played last winter but not since April. Invite them to the league.', go: 'year' },
  ],
  thanda: [
    { tag: 'Pattern', title: '21 days in: ₹3.1L collected', text: 'Seasons predicts from 240 similar merchants until your own patterns are ready.' },
    { tag: 'You could', title: '9 of 12 big-ticket orders were left at checkout', text: 'Appliance buyers often pay by EMI. Turning it on takes one approval.', go: 'year' },
    { tag: 'Heads-up', title: 'Festive appliance buying usually starts mid-October', text: 'Similar merchants sell 35–40% more in Oct–Nov than in September.', go: 'year' },
    { tag: 'Pattern', title: 'Saturdays 12–6 PM are your busiest so far', text: 'Early signal from 3 weeks. It firms up after 8.', go: 'week' },
  ],
};

/* ------------------------------------------------------------------
   Guided tour
------------------------------------------------------------------- */
export interface TourStep {
  merchant: string;
  view: 'overview' | 'year' | 'month' | 'week' | 'review' | 'controls';
  target: string; // data-tour id
  title: string;
  body: string;
  drawer?: string; // action id to open
}
export const tourSteps: TourStep[] = [
  { merchant: 'mithas', view: 'overview', target: 'title', title: 'Meet Seasons', body: 'Seasons lives inside your Razorpay dashboard. It learns when your customers pay (across the year, month and week) and gets you ready before each moment. Four demo merchants show four kinds of business.' },
  { merchant: 'mithas', view: 'overview', target: 'hero', title: 'Your next moment, at a glance', body: 'The countdown to your next peak, your year with peak months in orange and “Today” marked, and how many readiness tasks are done. The playbook tag shows which template this business uses.' },
  { merchant: 'mithas', view: 'overview', target: 'whatsapp', title: 'It comes to you', body: 'You don’t need to go looking. When a moment is coming up, RAY sends a short WhatsApp summary with a link to the plan.' },
  { merchant: 'mithas', view: 'overview', target: 'insights', title: 'Quick insights', body: 'A rotating tile: what Seasons did for you and what you could do next. Use the arrows or dots, or tap “Open” to jump there.' },
  { merchant: 'mithas', view: 'year', target: 'readiness-plan', title: 'Am I ready?', body: 'A dated checklist counted back from the rush. Every tab has one: the season, this month’s cycle and the week ahead. Tasks tick themselves when you approve a suggestion; dashed ones (stock, supplier, courier) only you can confirm, because Razorpay can’t see them.' },
  { merchant: 'mithas', view: 'year', target: 'year-chart', title: 'It finds your season', body: 'Oct–Dec brings 61% of this merchant’s year. Diwali moves to 8 Nov, so Seasons shifts the forecast and shows it as a range, not a single number.' },
  { merchant: 'mithas', view: 'year', target: 'first-action', title: 'Every suggestion shows its evidence', body: 'Why, expected impact, confidence, timing, and the Razorpay product it runs on. Hover ⓘ: blue = existing Razorpay product, orange = suggested but not found in Razorpay’s docs, purple = new in Seasons.' },
  { merchant: 'mithas', view: 'year', target: 'recipients', drawer: 'm-winback', title: 'Who gets it', body: 'Before anything goes out, you see exactly who receives it. Customers without WhatsApp opt-in are greyed out with the reason, and you can’t override that. Untick anyone you’d rather leave out. Below the list, the WhatsApp cost of this send is shown before you approve.' },
  { merchant: 'mithas', view: 'year', target: 'message', drawer: 'm-winback', title: 'The message: edit, translate, preview', body: 'Edit the text, switch it to हिंदी or Hinglish (live, via Gemini), or make it shorter. The phone on the right shows exactly what the customer sees. Approve & schedule then creates real Payment Links in Razorpay test mode. Nothing is sent.' },
  { merchant: 'kata', view: 'month', target: 'readiness-plan', title: 'Monthly: ask at the right time', body: 'For a course seller: fee links go out when each family usually pays, links stay open past the deadline so late payers aren’t cut off, and reliable families are offered AutoPay.' },
  { merchant: 'courtside', view: 'week', target: 'week-heat', title: 'Weekly: regulars and quiet slots', body: 'For a club: regulars who have gone quiet, evenings that run empty, and the best time to message. Every nudge waits for approval.' },
  { merchant: 'thanda', view: 'overview', target: 'readiness', title: 'New on Razorpay? Predictions from day one', body: 'With 3 weeks of data, Seasons predicts from similar merchants (ranges from 50+ businesses, never names) and shows when each layer switches to your own data.' },
  { merchant: 'mithas', view: 'review', target: 'feedback', title: 'It learns after every season', body: 'Seasons compares forecast with what happened, then asks what it couldn’t see. Type a note (or use the example) and Gemini turns it into changes for the next plan. You choose which to keep.' },
  { merchant: 'mithas', view: 'overview', target: 'lang', title: 'Built for India', body: 'Customer messages go out in English, हिंदी or Hinglish, and the dashboard works in English and हिंदी (switch at the top). Tamil, Telugu, Marathi and Bengali are coming soon.' },
  { merchant: 'mithas', view: 'controls', target: 'preferences', title: 'You stay in charge', body: 'Set your discount limit, message cap and quiet hours, switch layers on or off, or pause Seasons. Loosening a protection always asks you to confirm. Everything is in the Activity log.' },
];


/* ------------------------------------------------------------------
   Amount used when Seasons creates a real Razorpay TEST Payment Link on approval
------------------------------------------------------------------- */
export const linkAmount: Record<string, { amount: number; description: string }> = {
  'm-winback': { amount: 2077, description: 'Mithas Diwali box · early access' },
  'm-salary': { amount: 1056, description: 'Mithas · this month’s box' },
  'k-timing': { amount: 3000, description: 'Kata Academy · October fees' },
  'c-regulars': { amount: 600, description: 'Courtside · Friday court, 7–8 PM' },
  'c-dues': { amount: 2500, description: 'Courtside · October membership' },
  't-weekend': { amount: 1000, description: 'Thanda Cool · showroom visit booking' },
};

/* ------------------------------------------------------------------
   Playbooks: one engine, a template per kind of business
------------------------------------------------------------------- */
export const playbook: Record<string, string> = {
  mithas: 'Festive D2C',
  kata: 'Courses & academies',
  courtside: 'Clubs & memberships',
  thanda: 'Seasonal retail',
};

/* ------------------------------------------------------------------
   Readiness plan: dated tasks counted back from the next moment
   kind: auto = Seasons did it · action = done when you approve that suggestion · confirm = only you can confirm it
------------------------------------------------------------------- */
export interface PlanItem { id: string; date: string; label: string; kind: 'auto' | 'action' | 'confirm'; actionId?: string; note?: string }
export interface Plan { layer: 'year' | 'month' | 'week'; title: string; goal: string; goalDate: string; items: PlanItem[] }

const mainPlans: Record<string, Plan> = {
  mithas: {
    layer: 'year', title: 'Diwali readiness', goal: 'Rush begins', goalDate: '18 Oct',
    items: [
      { id: 'f', date: '7 Sep', label: 'Peak forecast and plan', kind: 'auto' },
      { id: 'card', date: '10 Sep', label: 'UPI-first checkout', kind: 'action', actionId: 'm-cards' },
      { id: 'fund', date: '15 Sep', label: 'Decide stock funding', kind: 'action', actionId: 'm-stock' },
      { id: 'lead', date: '18 Sep', label: 'Confirm supplier lead time (25 days)', kind: 'confirm', note: 'Razorpay can’t see your supplier' },
      { id: 'order', date: '23 Sep', label: 'Place supplier order', kind: 'confirm', note: 'Only you can confirm stock' },
      { id: 'intl', date: '30 Sep', label: 'International cards on', kind: 'action', actionId: 'm-intl' },
      { id: 'msg', date: '1 Oct', label: 'Message last Diwali’s buyers', kind: 'action', actionId: 'm-winback' },
      { id: 'pack', date: '10 Oct', label: 'Packing staff and courier booked', kind: 'confirm', note: 'Courier delays hit Rakhi' },
    ],
  },
  kata: {
    layer: 'month', title: 'October fee cycle readiness', goal: 'Fees due', goalDate: '5 Oct',
    items: [
      { id: 'g', date: '7 Sep', label: 'Families grouped by when they pay', kind: 'auto' },
      { id: 'fee', date: '25 Sep', label: 'Confirm October fee (₹3,000)', kind: 'confirm', note: 'Fee changes live outside Razorpay' },
      { id: 'exp', date: '28 Sep', label: 'Link expiry set to 8 Oct', kind: 'action', actionId: 'k-expiry' },
      { id: 'links', date: '30 Sep', label: 'Per-family link schedule', kind: 'action', actionId: 'k-timing' },
      { id: 'auto', date: '1 Oct', label: 'AutoPay invite to 38 families', kind: 'action', actionId: 'k-autopay' },
      { id: 'hold', date: '5 Oct', label: 'Ask me before removing access', kind: 'action', actionId: 'k-hold' },
    ],
  },
  courtside: {
    layer: 'year', title: 'High-season readiness', goal: 'High season', goalDate: '3 Oct',
    items: [
      { id: 'f', date: '7 Sep', label: 'Season forecast', kind: 'auto' },
      { id: 'reg', date: '10 Sep', label: 'Check in with quiet regulars', kind: 'action', actionId: 'c-regulars' },
      { id: 'tue', date: '14 Sep', label: 'Tuesday members’ offer', kind: 'action', actionId: 'c-tuesday' },
      { id: 'league', date: '18 Sep', label: 'League invites to 74 members', kind: 'action', actionId: 'c-season' },
      { id: 'courts', date: '25 Sep', label: 'Outdoor courts and coaches ready', kind: 'confirm', note: 'Only you can confirm this' },
      { id: 'dues', date: '1 Oct', label: 'October dues on WhatsApp', kind: 'action', actionId: 'c-dues' },
    ],
  },
  thanda: {
    layer: 'year', title: 'Festive readiness (predicted)', goal: 'Festive buying', goalDate: '15 Oct',
    items: [
      { id: 'f', date: '7 Sep', label: 'Starter plan from similar merchants', kind: 'auto' },
      { id: 'emi', date: '10 Sep', label: 'EMI options on', kind: 'action', actionId: 't-emi' },
      { id: 'visit', date: '11 Sep', label: 'Weekend invite to deposit holders', kind: 'action', actionId: 't-weekend' },
      { id: 'stock', date: '21 Sep', label: 'Decide festive stock', kind: 'action', actionId: 't-stock' },
      { id: 'lead', date: '24 Sep', label: 'Confirm supplier lead time', kind: 'confirm', note: 'Razorpay can’t see your supplier' },
    ],
  },
};

const extraPlans: Record<string, Partial<Record<'year' | 'month' | 'week', Plan>>> = {
  mithas: {
    month: { layer: 'month', title: 'October salary-week readiness', goal: 'Salary week', goalDate: '1 Oct', items: [
      { id: 'p', date: '7 Sep', label: 'Salary-week buying pattern found', kind: 'auto' },
      { id: 'pick', date: '25 Sep', label: 'Choose this month’s featured box', kind: 'confirm', note: 'Your menu isn’t in Razorpay' },
      { id: 'msg', date: '1 Oct', label: 'Salary-week message to past buyers', kind: 'action', actionId: 'm-salary' },
    ] },
    week: { layer: 'week', title: 'This weekend’s readiness', goal: 'Sunday peak', goalDate: 'Sun 13 Sep', items: [
      { id: 'p', date: '7 Sep', label: 'Weekly pattern found (Sun 6–9 PM)', kind: 'auto' },
      { id: 'time', date: '12 Sep', label: 'Send messages Saturday 7 PM', kind: 'action', actionId: 'm-weekend' },
      { id: 'pack', date: '12 Sep', label: 'Weekend orders packed by Saturday', kind: 'confirm', note: 'Only you can confirm this' },
    ] },
  },
  kata: {
    year: { layer: 'year', title: 'January batch readiness', goal: 'New batch', goalDate: '4 Jan', items: [
      { id: 'p', date: '7 Sep', label: 'January enrolment wave found (+38%)', kind: 'auto' },
      { id: 'coach', date: '30 Nov', label: 'Coach availability for January', kind: 'confirm', note: 'Only you can confirm this' },
      { id: 'ref', date: '14 Dec', label: 'Referral message to current families', kind: 'action', actionId: 'k-winter' },
    ] },
    week: { layer: 'week', title: 'This Saturday’s readiness', goal: 'Trial classes', goalDate: 'Sat 12 Sep', items: [
      { id: 'p', date: '7 Sep', label: 'Saturday 9–12 trial peak found', kind: 'auto' },
      { id: 'slots', date: '10 Sep', label: 'Open two more trial slots', kind: 'action', actionId: 'k-trial' },
      { id: 'inst', date: '11 Sep', label: 'Instructor for the extra slots', kind: 'confirm', note: 'Only you can confirm this' },
    ] },
  },
  courtside: {
    month: { layer: 'month', title: 'October dues readiness', goal: 'Dues window', goalDate: '1–10 Oct', items: [
      { id: 'p', date: '7 Sep', label: 'Members grouped by when they pay', kind: 'auto' },
      { id: 'fee', date: '25 Sep', label: 'Confirm October fee (₹2,500)', kind: 'confirm', note: 'Fee changes live outside Razorpay' },
      { id: 'dues', date: '1 Oct', label: 'Dues link on WhatsApp, 8 PM', kind: 'action', actionId: 'c-dues' },
    ] },
    week: { layer: 'week', title: 'Week-ahead readiness', goal: 'Tuesday evening', goalDate: 'Tue 15 Sep', items: [
      { id: 'p', date: '7 Sep', label: 'Quiet regulars and empty slots found', kind: 'auto' },
      { id: 'reg', date: '10 Sep', label: 'Check in with 6 Friday regulars', kind: 'action', actionId: 'c-regulars' },
      { id: 'coach', date: '11 Sep', label: 'Friday coach confirmed', kind: 'confirm', note: 'Only you can confirm this' },
      { id: 'tue', date: '14 Sep', label: 'Tuesday members’ offer', kind: 'action', actionId: 'c-tuesday' },
    ] },
  },
  thanda: {
    month: { layer: 'month', title: 'Salary-week readiness (predicted)', goal: 'Salary week', goalDate: '1 Oct', items: [
      { id: 'p', date: '7 Sep', label: 'Salary-week pattern from similar merchants', kind: 'auto' },
      { id: 'emi', date: '25 Sep', label: 'EMI options on before salary week', kind: 'action', actionId: 't-emi' },
      { id: 'store', date: '30 Sep', label: 'EMI offer shown in the showroom', kind: 'confirm', note: 'Only you can confirm this' },
    ] },
    week: { layer: 'week', title: 'This Saturday’s readiness', goal: 'Saturday rush', goalDate: 'Sat 12 Sep', items: [
      { id: 'p', date: '7 Sep', label: 'Early signal: Saturday 12–6 PM busiest', kind: 'auto' },
      { id: 'visit', date: '11 Sep', label: 'Invite deposit holders', kind: 'action', actionId: 't-weekend' },
      { id: 'staff', date: '12 Sep', label: 'Extra staff for Saturday afternoon', kind: 'confirm', note: 'Only you can confirm this' },
    ] },
  },
};

// Every merchant gets a readiness check on every tab. `main` is the plan for their next big moment (shown in the banner).
export const readinessPlans: Record<string, Plan> = mainPlans;
export const plansFor = (merchantId: string): Record<'year' | 'month' | 'week', Plan> => {
  const main = mainPlans[merchantId];
  return { ...extraPlans[merchantId], [main.layer]: main } as Record<'year' | 'month' | 'week', Plan>;
};


/* ---------- WhatsApp cost shown before approval ----------
   Meta charges per message by category; the merchant pays via their WhatsApp provider, not Razorpay.
   Rates vary by provider, so these are clearly labelled example rates, not quotes. */
export const waCategory: Record<string, 'marketing' | 'utility'> = {
  'm-winback': 'marketing', 'm-salary': 'marketing',
  'k-timing': 'utility', 'k-autopay': 'marketing', 'k-winter': 'marketing',
  'c-regulars': 'marketing', 'c-tuesday': 'marketing', 'c-dues': 'utility', 'c-season': 'marketing',
  't-weekend': 'marketing',
};
export const waExampleRate = { marketing: 1, utility: 0.15 };
