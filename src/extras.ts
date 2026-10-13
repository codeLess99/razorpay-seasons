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
  { merchant: 'mithas', view: 'overview', target: 'title', title: 'Meet Seasons', body: 'Seasons lives inside your Razorpay dashboard. It learns when your customers pay, across the year, month and week, and gets you ready before each moment.' },
  { merchant: 'mithas', view: 'overview', target: 'whatsapp', title: 'It comes to you', body: 'You don’t need to go looking. When a moment is coming up, RAY sends you a short WhatsApp summary with a link to the plan.' },
  { merchant: 'mithas', view: 'overview', target: 'insights', title: 'Quick insights', body: 'A rotating tile with what Seasons did for you and what you could do next. Tap any slide to jump to it.' },
  { merchant: 'mithas', view: 'overview', target: 'readiness', title: 'What Seasons is using', body: 'Each layer shows whether it’s using your own payments or, if you’re new, predictions from similar merchants.' },
  { merchant: 'mithas', view: 'year', target: 'year-chart', title: 'It finds your season', body: 'Mithas Foods earns 61% of its year in Oct–Dec. Diwali moves to 8 Nov this year, so Seasons shifts the forecast, not a fixed calendar.' },
  { merchant: 'mithas', view: 'year', target: 'first-action', title: 'A plan, 6 weeks ahead', body: 'Each suggestion shows why, the expected impact, how confident Seasons is, and which Razorpay product it runs on. Tap ⓘ to see what each product is.' },
  { merchant: 'mithas', view: 'year', target: 'drawer', drawer: 'm-winback', title: 'You approve, then it acts', body: 'See exactly who gets the message (customers without opt-in are left out), edit the text, and preview it on WhatsApp. Nothing is sent until you approve.' },
  { merchant: 'kata', view: 'month', target: 'month-groups', title: 'Monthly: ask at the right time', body: 'For a course seller, fee links go out when each family usually pays (right after salary day for most), on WhatsApp instead of SMS.' },
  { merchant: 'courtside', view: 'week', target: 'week-heat', title: 'Weekly: your regulars and your quiet slots', body: 'For a club, Seasons spots regulars who have gone quiet and evenings that run empty, then drafts a personal note or an offer for you to approve.' },
  { merchant: 'thanda', view: 'overview', target: 'readiness', title: 'New on Razorpay? Predictions from day one', body: 'With only 3 weeks of data, Seasons predicts from 240 similar merchants. Each layer switches to your own data as soon as there’s enough.' },
  { merchant: 'mithas', view: 'review', target: 'feedback', title: 'It learns after every season', body: 'Seasons compares forecast with what happened, then asks you what it couldn’t see. Your notes turn into changes for the next plan, and you choose which to keep.' },
  { merchant: 'mithas', view: 'controls', target: 'preferences', title: 'You stay in charge', body: 'Set your discount limit, quiet hours and message cap, switch layers on or off, or pause Seasons any time. Loosening a protection always asks you to confirm.' },
];
