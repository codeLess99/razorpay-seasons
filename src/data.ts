// All data in this prototype is synthetic. Merchant names are invented.
// Mithas Foods is modelled on the pattern of a real D2C food merchant's Razorpay account;
// Kata Academy on an interview with a course seller who collects monthly fees via Payment Links.

export type Layer = 'year' | 'month' | 'week';
export type ActionKind = 'message' | 'setting' | 'finance';
export type Confidence = 'High' | 'Medium' | 'Low';
export type DataSource = 'own' | 'benchmark' | 'early';

export interface Recipient {
  name: string;
  detail: string;
  optedIn: boolean;
  excludedReason?: string;
}

export interface Action {
  id: string;
  layer: Layer;
  kind: ActionKind;
  title: string;
  summary: string;
  why: string[];
  impact: string;
  confidence: Confidence;
  executesVia: string;
  when: string;
  recipients?: Recipient[];
  message?: string;
  settingChange?: { label: string; from: string; to: string }[];
  learnedFrom?: string;
  basis?: DataSource;
}

export interface MonthPoint {
  month: string;
  actual?: number;
  forecast?: number;
  low?: number;
  high?: number;
  label?: string;
}

export interface Moment {
  date: string; // display
  title: string;
  layer: Layer;
  status: 'now' | 'soon' | 'later';
  note: string;
}

export interface ReviewData {
  title: string;
  period: string;
  series: { label: string; forecast: number; actual: number }[];
  outcomes: { action: string; result: string; tone: 'positive' | 'notice' | 'negative' | 'neutral' }[];
  prompts: string[];
  sampleFeedback: string;
}

export interface Merchant {
  id: string;
  name: string;
  type: string;
  icon: 'food' | 'education' | 'club' | 'appliance';
  platform: string;
  joined: string;
  dataDays: number;
  sources: Record<Layer, { source: DataSource; label: string }>;
  headline: { layer: Layer; title: string; sub: string; countdown: string };
  annual: {
    insight: string;
    peakTitle: string;
    series: MonthPoint[];
    keyFacts: { label: string; value: string; hint?: string }[];
    nextPeak: string;
  };
  monthly: {
    insight: string;
    current: string;
    proposed: string;
    days: { day: string; share: number }[];
    groups: { name: string; count: number; pattern: string; send: string }[];
    keyFacts: { label: string; value: string; hint?: string }[];
  };
  weekly: {
    insight: string;
    // 7 days x 6 time blocks, relative intensity 0..1
    grid: number[][];
    keyFacts: { label: string; value: string; hint?: string }[];
  };
  actions: Action[];
  moments: Moment[];
  review: ReviewData;
  whatsapp: string;
}

export const TODAY = 'Mon, 7 Sep 2026';
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const BLOCKS = ['6–9 AM', '9–12', '12–3 PM', '3–6 PM', '6–9 PM', '9 PM–12'];

const lapsedBuyers: Recipient[] = [
  { name: 'Ananya R.', detail: 'Bought 3× last Diwali · ₹6,150', optedIn: true },
  { name: 'Vikram S.', detail: 'Corporate gift order · ₹12,400', optedIn: true },
  { name: 'Meera K.', detail: 'Bought 2× (Oct, Dec) · ₹4,120', optedIn: true },
  { name: 'Rohit B.', detail: 'Bought once, Diwali week · ₹2,077', optedIn: true },
  { name: 'Farah A.', detail: 'Bought 2× · ₹3,140 · overseas card', optedIn: true },
  { name: 'Sanjay P.', detail: 'Bought once · ₹1,056', optedIn: false, excludedReason: 'No WhatsApp opt-in' },
  { name: 'Lakshmi N.', detail: 'Bought 4× · ₹8,300', optedIn: true },
  { name: 'Deepak J.', detail: 'Bought once · ₹2,101', optedIn: false, excludedReason: 'Opted out in March' },
];

const fridayRegulars: Recipient[] = [
  { name: 'Arjun M.', detail: '14 Friday bookings · last seen 25 days ago', optedIn: true },
  { name: 'Neha & Kabir', detail: '9 Friday doubles · last seen 22 days ago', optedIn: true },
  { name: 'Ishaan T.', detail: '11 Friday bookings · last seen 31 days ago', optedIn: true },
  { name: 'Priya D.', detail: '8 Friday bookings · last seen 24 days ago', optedIn: true },
  { name: 'Rahul V.', detail: '12 Friday bookings · last seen 21 days ago', optedIn: true },
  { name: 'Zoya H.', detail: '7 Friday bookings · last seen 28 days ago', optedIn: false, excludedReason: 'No WhatsApp opt-in' },
];

const students: Recipient[] = [
  { name: 'Aarav (parent: Sunita G.)', detail: 'Pays on the 2nd, ~9 PM · 11/11 on time', optedIn: true },
  { name: 'Kiara (parent: Manoj R.)', detail: 'Pays on deadline day (5th) · 9/11 on time', optedIn: true },
  { name: 'Vihaan S.', detail: 'Paid late 4 of last 6 months · usually 7th–8th', optedIn: true },
  { name: 'Saanvi (parent: Ritu P.)', detail: 'Pays on the 1st, ~8 PM · 11/11 on time', optedIn: true },
  { name: 'Reyansh K.', detail: 'Link expired twice · paid after reminder', optedIn: true },
  { name: 'Myra (parent: Arjun N.)', detail: 'New this month · no pattern yet', optedIn: false, excludedReason: 'Opt-in pending' },
];

export const merchants: Merchant[] = [
  {
    id: 'mithas',
    name: 'Mithas Foods',
    type: 'D2C sweets & snacks',
    icon: 'food',
    platform: 'Wix store · Razorpay Payment Gateway',
    joined: 'Customer since Oct 2025',
    dataDays: 340,
    sources: {
      year: { source: 'own', label: '11 months of your data · Diwali 2025, Christmas, Rakhi' },
      month: { source: 'own', label: '11 months of your data' },
      week: { source: 'own', label: '48 weeks of your data' },
    },
    headline: {
      layer: 'year',
      title: 'Your Diwali peak starts in about 6 weeks',
      sub: 'Diwali is on 8 Nov this year, 19 days later than last year. Last year your orders started rising 21 days before Diwali, so expect the rush from ~18 Oct.',
      countdown: '41 days to your peak',
    },
    annual: {
      insight:
        'Three months (Oct–Dec) brought 61% of your year. Feb–Aug together brought 28%. Because Diwali moves to 8 Nov, your peak shifts from October into November.',
      peakTitle: 'Diwali 2026 · rush expected from ~18 Oct',
      nextPeak: '18 Oct',
      series: [
        { month: 'Sep 25', actual: 31000 },
        { month: 'Oct 25', actual: 152000, label: 'Diwali (20 Oct)' },
        { month: 'Nov 25', actual: 98000 },
        { month: 'Dec 25', actual: 121000, label: 'Christmas & New Year' },
        { month: 'Jan 26', actual: 38000 },
        { month: 'Feb 26', actual: 24000 },
        { month: 'Mar 26', actual: 29000 },
        { month: 'Apr 26', actual: 18000 },
        { month: 'May 26', actual: 16000 },
        { month: 'Jun 26', actual: 11000 },
        { month: 'Jul 26', actual: 14000 },
        { month: 'Aug 26', actual: 61000, label: 'Rakhi (28 Aug)' },
        { month: 'Sep 26', forecast: 34000, low: 29000, high: 40000 },
        { month: 'Oct 26', forecast: 105000, low: 88000, high: 124000 },
        { month: 'Nov 26', forecast: 178000, low: 150000, high: 210000, label: 'Diwali (8 Nov)' },
        { month: 'Dec 26', forecast: 130000, low: 108000, high: 152000 },
      ],
      keyFacts: [
        { label: 'Forecast, Oct–Nov', value: '₹2.83L', hint: 'Range ₹2.38L–₹3.34L · last year ₹2.50L' },
        { label: 'Rush starts', value: '~18 Oct', hint: '21 days before Diwali, from your own 2025 ramp' },
        { label: 'Festive buyers not back', value: '86 of 108', hint: '64 have opted in to WhatsApp' },
        { label: 'Card failure rate last peak', value: '23%', hint: 'UPI was 12%' },
      ],
    },
    monthly: {
      insight:
        'Off-season, 41% of your orders arrive in salary week (1st–7th). Reminders sent mid-month convert at less than half that rate.',
      current: 'No scheduled messages · Razorpay reminders by SMS/email only',
      proposed: 'Send off-season reminders on the 1st, 7:30 PM, on WhatsApp',
      days: Array.from({ length: 31 }, (_, i) => ({
        day: String(i + 1),
        share: [6.8, 7.2, 6.1, 5.4, 5.0, 4.6, 4.2, 3.1, 2.9, 2.8, 2.6, 2.4, 2.5, 2.6, 2.4, 2.3, 2.2, 2.1, 2.3, 2.2, 2.1, 2.0, 2.2, 2.3, 2.4, 2.6, 2.7, 2.6, 2.4, 2.2, 1.0][i],
      })),
      groups: [
        { name: 'Salary-week buyers', count: 38, pattern: 'Order between 1st and 7th', send: '1st · 7:30 PM' },
        { name: 'Weekend buyers', count: 29, pattern: 'Order on Sat/Sun evenings', send: 'Sat · 7:00 PM' },
        { name: 'No clear pattern', count: 41, pattern: 'Mixed', send: 'Keep default' },
      ],
      keyFacts: [
        { label: 'Orders in salary week', value: '41%', hint: 'off-season months, Jan–Aug' },
        { label: 'Best send time', value: '1st · 7:30 PM', hint: 'highest order rate within 48h' },
      ],
    },
    weekly: {
      insight: 'Sunday 6–9 PM is your strongest slot (2.6× your average). Messages sent Saturday evening convert best.',
      grid: [
        [0.1, 0.3, 0.35, 0.3, 0.45, 0.3],
        [0.1, 0.25, 0.3, 0.3, 0.4, 0.25],
        [0.1, 0.3, 0.35, 0.3, 0.45, 0.3],
        [0.1, 0.3, 0.35, 0.35, 0.5, 0.35],
        [0.1, 0.3, 0.4, 0.4, 0.6, 0.45],
        [0.15, 0.45, 0.5, 0.5, 0.75, 0.55],
        [0.2, 0.5, 0.55, 0.6, 1.0, 0.7],
      ],
      keyFacts: [
        { label: 'Strongest slot', value: 'Sun 6–9 PM', hint: '2.6× your weekly average' },
        { label: 'Best time to message', value: 'Sat 7 PM', hint: 'highest orders within 24h' },
      ],
    },
    actions: [
      {
        id: 'm-winback',
        layer: 'year',
        kind: 'message',
        title: 'Bring back last Diwali’s buyers before the rush',
        summary: 'Early-access message with a payment link to 64 buyers from last festive season who haven’t ordered since.',
        why: [
          '86 of 108 festive buyers (Oct–Dec 2025) haven’t ordered again; 64 of them opted in to WhatsApp.',
          'They spent ₹1.62L between them last season.',
          'Sending on 1 Oct reaches them ~2.5 weeks before your rush, before marketplace sales (8–9 Oct) pull them away.',
        ],
        impact: '₹26K–₹39K expected (20–30% of 64 order once at your ₹2,050 average)',
        confidence: 'Medium',
        executesVia: 'Payment Links + WhatsApp',
        when: 'Thu, 1 Oct · 7:30 PM',
        recipients: lapsedBuyers,
        message:
          'Hi {first_name}! 🪔 Diwali is on 8 Nov this year. As one of our festive regulars, you get early access to Mithas Diwali boxes before we open to everyone. Order by 15 Oct for guaranteed delivery: {payment_link}\nReply STOP to opt out.',
      },
      {
        id: 'm-cards',
        layer: 'year',
        kind: 'setting',
        title: 'Fix card failures before peak volume',
        summary: 'Show UPI first at checkout and turn on retry with UPI when a card payment fails.',
        why: [
          '23% of card attempts failed last festive season (31 of 135), vs 12% for UPI.',
          'Most card failures were OTP timeouts and bank declines, which a UPI retry usually recovers.',
          'At peak volume, the same failure rate costs ~₹9K–₹12K.',
        ],
        impact: '₹8K–₹12K of festive orders protected',
        confidence: 'High',
        executesVia: 'Checkout payment configuration',
        when: 'Now · takes effect immediately',
        settingChange: [
          { label: 'Payment method order', from: 'Cards, UPI, Netbanking', to: 'UPI, Cards, Netbanking' },
          { label: 'Retry failed card payment with UPI', from: 'Off', to: 'On' },
        ],
      },
      {
        id: 'm-stock',
        layer: 'year',
        kind: 'finance',
        title: 'Line up stock money before you need to order',
        summary: 'Your supplier needs ~25 days. To be stocked by 18 Oct, you order by 23 Sep. Expect a ₹89K gap.',
        why: [
          'Forecast Oct–Nov revenue: ₹2.83L. At ~45% stock cost, you need ~₹1.27L of stock in hand by 18 Oct.',
          'Expected settled balance + September collections by 23 Sep: ~₹38K.',
          'Learned from Rakhi: you ran out of kaju katli on day 4, so the plan now starts funding 2 weeks earlier.',
        ],
        impact: 'Avoids stock-outs during your highest-revenue weeks',
        confidence: 'Medium',
        executesVia: 'Razorpay Capital (working capital) · optional',
        when: 'Decide by Tue, 15 Sep',
        learnedFrom: 'Rakhi 2026 review',
        settingChange: [
          { label: 'Working capital request', from: 'None', to: '₹90,000 · prefilled, not submitted' },
          { label: 'Reminder to place supplier order', from: 'None', to: 'Wed, 23 Sep · 10:00 AM' },
        ],
      },
      {
        id: 'm-intl',
        layer: 'year',
        kind: 'setting',
        title: 'Accept international cards for overseas gifting',
        summary: 'Turn on international payments before Diwali gifting orders from abroad.',
        why: [
          '2 international payments last season, both in Diwali week (US, UAE).',
          'Small sample, so confidence is low, but turning it on costs nothing until used.',
        ],
        impact: 'Small, uncertain upside · no cost unless used',
        confidence: 'Low',
        executesVia: 'International payments',
        when: 'Before Thu, 1 Oct',
        settingChange: [{ label: 'International cards', from: 'Off', to: 'On (review required by Razorpay)' }],
      },
      {
        id: 'm-salary',
        layer: 'month',
        kind: 'message',
        title: 'Move off-season reminders to salary week',
        summary: 'Send your monthly “new flavours” message on the 1st at 7:30 PM instead of mid-month.',
        why: ['41% of off-season orders land in the 1st–7th.', 'Your mid-month messages in June converted at 2.1%, vs 5.3% for the one sent on 1 July.'],
        impact: '~2× response on off-season messages',
        confidence: 'Medium',
        executesVia: 'WhatsApp via Razorpay Engage',
        when: 'Thu, 1 Oct · 7:30 PM (repeats monthly)',
        recipients: lapsedBuyers.slice(0, 5),
        message: 'Hi {first_name}, new this month at Mithas: {product}. Order here: {payment_link}\nReply STOP to opt out.',
      },
      {
        id: 'm-weekend',
        layer: 'week',
        kind: 'setting',
        title: 'Schedule weekend messages for Saturday 7 PM',
        summary: 'Your customers order most on Sunday evening; Saturday 7 PM messages convert best.',
        why: ['Sun 6–9 PM is 2.6× your weekly average.', 'Saturday-evening sends led to 2.2× more orders within 24h than weekday sends.'],
        impact: 'Better timing for every weekly message',
        confidence: 'High',
        executesVia: 'Send-time default for all Seasons messages',
        when: 'From this Saturday',
        settingChange: [{ label: 'Default send time', from: 'Immediately on approval', to: 'Sat · 7:00 PM' }],
      },
    ],
    moments: [
      { date: '7 Sep', title: 'Diwali plan ready', layer: 'year', status: 'now', note: '4 actions to approve' },
      { date: '15 Sep', title: 'Decide stock funding', layer: 'year', status: 'soon', note: 'Supplier lead time 25 days' },
      { date: '1 Oct', title: 'Festive buyers message', layer: 'year', status: 'soon', note: 'Needs approval' },
      { date: '18 Oct', title: 'Rush begins', layer: 'year', status: 'later', note: 'Forecast ₹2.83L Oct–Nov' },
      { date: '8 Nov', title: 'Diwali', layer: 'year', status: 'later', note: 'Peak day' },
      { date: 'Dec', title: 'Christmas & New Year gifting', layer: 'year', status: 'later', note: 'Plan opens 26 Oct' },
    ],
    review: {
      title: 'Rakhi 2026 review',
      period: '7–31 Aug 2026 · your first season with Seasons',
      series: [
        { label: 'Week 1', forecast: 6000, actual: 6400 },
        { label: 'Week 2', forecast: 11000, actual: 12800 },
        { label: 'Week 3', forecast: 19000, actual: 23100 },
        { label: 'Week 4', forecast: 21000, actual: 18700 },
      ],
      outcomes: [
        { action: 'Rakhi message to 41 past buyers', result: '9 ordered · ₹18,450', tone: 'positive' },
        { action: 'UPI-first checkout', result: 'Approved · card failures 23% → 15%', tone: 'positive' },
        { action: 'Stock funding', result: 'Skipped · sold out of kaju katli on day 4', tone: 'negative' },
        { action: 'Week 4 forecast', result: '11% below forecast', tone: 'notice' },
      ],
      prompts: ['What went well?', 'What ran out or went wrong?', 'Anything unusual this season?'],
      sampleFeedback:
        'The WhatsApp message worked well, many replied. We ran out of kaju katli by day 4 and lost orders in week 4. Courier also delayed some deliveries by 2 days.',
    },
    whatsapp:
      'Seasons · Mithas Foods\n\nDiwali is on 8 Nov this year. Last year your orders started rising 21 days before Diwali, so expect the rush from ~18 Oct.\n\n4 actions are ready for your approval, including a message to 64 of last Diwali’s buyers.',
  },
  {
    id: 'kata',
    name: 'Kata Martial Arts Academy',
    type: 'Monthly course fees',
    icon: 'education',
    platform: 'Wix site + Payment Links (batch upload)',
    joined: 'Customer since 2023',
    dataDays: 980,
    sources: {
      year: { source: 'own', label: '2.5 years of your data' },
      month: { source: 'own', label: '32 collection cycles' },
      week: { source: 'own', label: '2.5 years of your data' },
    },
    headline: {
      layer: 'month',
      title: 'Next fee cycle: 1 Oct · send links when parents pay, not on the 28th',
      sub: '46% of your students pay on the 1st or 2nd, right after salary day. Links sent on the 28th by SMS often expire before they’re opened.',
      countdown: '24 days to next cycle',
    },
    annual: {
      insight:
        'New enrolments come in two waves: January (New Year resolutions, +38%) and May–June (summer vacation batch for kids). October–November is your quietest stretch.',
      peakTitle: 'Winter batch · enrolments from late Dec',
      nextPeak: '28 Dec',
      series: [
        { month: 'Sep 25', actual: 381000 },
        { month: 'Oct 25', actual: 362000 },
        { month: 'Nov 25', actual: 355000 },
        { month: 'Dec 25', actual: 371000 },
        { month: 'Jan 26', actual: 468000, label: 'New Year batch' },
        { month: 'Feb 26', actual: 452000 },
        { month: 'Mar 26', actual: 431000 },
        { month: 'Apr 26', actual: 418000 },
        { month: 'May 26', actual: 489000, label: 'Summer kids batch' },
        { month: 'Jun 26', actual: 502000 },
        { month: 'Jul 26', actual: 436000 },
        { month: 'Aug 26', actual: 420000 },
        { month: 'Sep 26', forecast: 412000, low: 396000, high: 428000 },
        { month: 'Oct 26', forecast: 389000, low: 370000, high: 408000 },
        { month: 'Nov 26', forecast: 381000, low: 360000, high: 402000 },
        { month: 'Dec 26', forecast: 398000, low: 375000, high: 420000 },
      ],
      keyFacts: [
        { label: 'January lift', value: '+38%', hint: 'new enrolments vs average month' },
        { label: 'Summer batch', value: 'May–Jun', hint: 'kids on vacation' },
        { label: 'Winter plan opens', value: '2 Nov', hint: '8 weeks before the January wave' },
      ],
    },
    monthly: {
      insight:
        '46% of students pay on the 1st–2nd, 22% on the deadline day (5th), and 9% after the deadline. Today every link goes out on the 28th by SMS and email.',
      current: 'Links sent 28th · SMS & email · reminders 11 AM–12 PM / 3–5 PM',
      proposed: 'Links timed to each family’s pay pattern · WhatsApp · 7–9 PM',
      days: [
        { day: '28', share: 3 }, { day: '29', share: 2 }, { day: '30', share: 2 }, { day: '31', share: 1 },
        { day: '1', share: 24 }, { day: '2', share: 22 }, { day: '3', share: 8 }, { day: '4', share: 7 },
        { day: '5', share: 22 }, { day: '6', share: 4 }, { day: '7', share: 3 }, { day: '8', share: 2 },
      ],
      groups: [
        { name: 'Salary-day payers', count: 64, pattern: 'Pay on 1st–2nd, evenings', send: 'Link on 1st · 7 PM' },
        { name: 'Deadline payers', count: 31, pattern: 'Pay on the 5th', send: 'Link 1st + reminder 4th · 7 PM' },
        { name: 'Often late', count: 13, pattern: 'Paid late 3+ of last 6 months', send: 'Link 30th + reminder 3rd' },
        { name: 'New or mixed', count: 32, pattern: 'Fewer than 3 cycles', send: 'Keep current default' },
      ],
      keyFacts: [
        { label: 'Paid on 1st–2nd', value: '46%', hint: 'right after salary day' },
        { label: 'Paid after deadline', value: '9%', hint: '~13 students a month' },
        { label: 'Links that expired unopened', value: '7%', hint: 'last 3 cycles' },
        { label: 'Ready for AutoPay', value: '38', hint: 'paid on time 6+ months in a row' },
      ],
    },
    weekly: {
      insight: 'Trial-class bookings peak on Saturday 9–12. Fee payments cluster on weekday evenings, 6–9 PM.',
      grid: [
        [0.05, 0.15, 0.2, 0.3, 0.7, 0.4],
        [0.05, 0.15, 0.2, 0.3, 0.65, 0.35],
        [0.05, 0.15, 0.2, 0.3, 0.7, 0.4],
        [0.05, 0.15, 0.2, 0.3, 0.7, 0.4],
        [0.05, 0.15, 0.2, 0.25, 0.55, 0.3],
        [0.2, 1.0, 0.45, 0.3, 0.3, 0.15],
        [0.1, 0.5, 0.3, 0.2, 0.35, 0.2],
      ],
      keyFacts: [
        { label: 'Trial bookings peak', value: 'Sat 9–12', hint: '31% of all trial bookings' },
        { label: 'Fees paid', value: 'Weekdays 6–9 PM', hint: 'send links before 7 PM' },
      ],
    },
    actions: [
      {
        id: 'k-timing',
        layer: 'month',
        kind: 'message',
        title: 'Send October fee links when each family usually pays',
        summary: '108 students get their link at their own best time on WhatsApp, instead of all at once on the 28th by SMS.',
        why: [
          '46% pay on the 1st–2nd, right after salary day. A link sent on the 28th is buried by then.',
          '7% of links expired unopened in the last 3 cycles; current reminders go only by SMS/email, 11 AM–12 PM and 3–5 PM.',
          'Families who pay on the deadline get a reminder on the 4th at 7 PM, the hour most of them pay.',
        ],
        impact: 'Fewer missed payments: about 5–7 of the ~13 late payers each month',
        confidence: 'Medium',
        executesVia: 'Payment Links (batch) + WhatsApp',
        when: 'Starts Wed, 30 Sep · per-family schedule',
        recipients: students,
        message:
          'Hi {parent_name}, {student_name}’s Kata fees for October (₹3,000) are due by 5 Oct. Pay here: {payment_link}\nReply STOP to opt out.',
      },
      {
        id: 'k-expiry',
        layer: 'month',
        kind: 'setting',
        title: 'Don’t let October links expire before families pay',
        summary: 'Keep the 5 Oct deadline in the message, but let links stay open until 8 Oct so late payers aren’t cut off.',
        why: [
          '9% of families usually pay on the 6th–8th; a link that expires on the 5th cuts them off.',
          '7% of links expired before they were opened in the last 3 cycles.',
          'You told us expiry sometimes closes early, so Seasons adds a buffer after your stated deadline.',
        ],
        impact: 'About 9–13 fewer families locked out each month',
        confidence: 'High',
        executesVia: 'Payment Links (expiry date)',
        when: 'Applies to the October batch (sent from 30 Sep)',
        settingChange: [
          { label: 'Deadline shown in message', from: '5 Oct', to: '5 Oct (unchanged)' },
          { label: 'Link expiry', from: '5 Oct, 11:59 PM', to: '8 Oct, 11:59 PM' },
        ],
      },
      {
        id: 'k-hold',
        layer: 'month',
        kind: 'setting',
        title: 'Ask before removing class access',
        summary: 'When someone hasn’t paid by the deadline, Seasons asks you before their Zoom access is removed.',
        why: [
          'In the last 6 cycles, 4 students whose access was removed paid within 10 days and asked to rejoin.',
          'Families who have paid on time for 6+ months and miss once are more likely to have forgotten than to be leaving.',
        ],
        impact: 'Avoids losing students who meant to stay',
        confidence: 'Medium',
        executesVia: 'Seasons approval step (you remove access yourself)',
        when: 'From October cycle',
        settingChange: [
          { label: 'After deadline', from: 'Remove from class list', to: 'Ask me first · show pay history' },
          { label: 'Grace reminder', from: 'None', to: '6th · 7 PM on WhatsApp' },
        ],
      },
      {
        id: 'k-autopay',
        layer: 'month',
        kind: 'message',
        title: 'Invite 38 reliable families to UPI AutoPay',
        summary: 'Families who have paid on time for 6+ months get a one-tap ₹1 AutoPay set-up. No monthly links for them after this.',
        why: ['38 students have paid on time for 6+ consecutive months.', 'UPI AutoPay registration now costs ₹1, and the family can cancel any time.'],
        impact: '38 fewer links to send and chase every month',
        confidence: 'High',
        executesVia: 'UPI AutoPay (Subscriptions)',
        when: 'Thu, 1 Oct · after the October fee is paid',
        recipients: students.filter((s) => s.detail.includes('11/11')),
        message:
          'Hi {parent_name}, thank you for paying on time every month! Want to skip the monthly link? Set up UPI AutoPay once (₹1 to verify) and fees go automatically on the 1st. Cancel anytime: {autopay_link}',
      },
      {
        id: 'k-winter',
        layer: 'year',
        kind: 'message',
        title: 'Winter batch: referral message to current families',
        summary: 'Plan opens 2 Nov. Preview: a referral invite to current students before the January wave.',
        why: ['January brings 38% more new enrolments than an average month.', 'Last January, 61% of new students came through a friend or sibling.'],
        impact: 'Preview · full plan opens 2 Nov',
        confidence: 'Medium',
        executesVia: 'Payment Pages + WhatsApp',
        when: 'Planned for Mon, 14 Dec',
        recipients: students.slice(0, 4),
        message: 'Hi {parent_name}! Our January batch starts 4 Jan. Bring a friend and you both get the first week free: {page_link}',
      },
      {
        id: 'k-trial',
        layer: 'week',
        kind: 'setting',
        title: 'Open more Saturday morning trial slots',
        summary: 'Trial bookings peak Saturday 9–12; slots were full 5 of the last 8 Saturdays.',
        why: ['31% of trial bookings are for Saturday 9–12.', 'The trial page showed “full” on 5 of the last 8 Saturdays.'],
        impact: '~4–6 more trial classes a month',
        confidence: 'High',
        executesVia: 'Payment Page (trial booking)',
        when: 'From this Saturday',
        settingChange: [{ label: 'Saturday trial slots', from: '9:00, 10:00', to: '9:00, 9:45, 10:30, 11:15' }],
      },
    ],
    moments: [
      { date: '7 Sep', title: 'October fee plan ready', layer: 'month', status: 'now', note: '4 actions to approve' },
      { date: '30 Sep', title: 'First links go out', layer: 'month', status: 'soon', note: 'Per-family schedule' },
      { date: '5 Oct', title: 'Fee deadline', layer: 'month', status: 'soon', note: 'Ask-before-removing on' },
      { date: '2 Nov', title: 'Winter batch plan opens', layer: 'year', status: 'later', note: '8 weeks before January' },
      { date: 'Jan', title: 'New Year enrolments', layer: 'year', status: 'later', note: '+38% new students' },
      { date: 'May', title: 'Summer kids batch', layer: 'year', status: 'later', note: 'Plan opens mid-March' },
    ],
    review: {
      title: 'September fee cycle review',
      period: '28 Aug – 8 Sep 2026',
      series: [
        { label: '28–31 Aug', forecast: 30000, actual: 24000 },
        { label: '1–2 Sep', forecast: 190000, actual: 193000 },
        { label: '3–4 Sep', forecast: 63000, actual: 60000 },
        { label: '5 Sep', forecast: 92000, actual: 93000 },
        { label: '6–8 Sep', forecast: 39000, actual: 30000 },
      ],
      outcomes: [
        { action: 'Collected', result: '₹4.00L of ₹4.20L due (95%)', tone: 'positive' },
        { action: 'Unpaid after deadline', result: '7 students · ₹21,000', tone: 'notice' },
        { action: 'Links expired unopened', result: '9 links', tone: 'negative' },
      ],
      prompts: ['What went well?', 'What went wrong?', 'Anything unusual this cycle?'],
      sampleFeedback:
        'Two parents said the SMS link had expired when they opened it. One family was travelling and paid late. Collections were smooth otherwise.',
    },
    whatsapp:
      'Seasons · Kata Martial Arts Academy\n\nOctober fees are due 1–5 Oct. 46% of your families pay on the 1st–2nd, so Seasons will time each link to when that family usually pays, on WhatsApp.\n\n4 actions are ready for your approval.',
  },
  {
    id: 'courtside',
    name: 'The Courtside Club',
    type: 'Sports & social club',
    icon: 'club',
    platform: 'POS + QR at desk · Payment Links for court bookings',
    joined: 'Customer since 2024',
    dataDays: 610,
    sources: {
      year: { source: 'own', label: '20 months of your data' },
      month: { source: 'own', label: '20 membership cycles' },
      week: { source: 'own', label: '87 weeks of your data' },
    },
    headline: {
      layer: 'week',
      title: '6 of your Friday regulars haven’t been in for 3+ weeks',
      sub: 'And Tuesday evenings run at 38% of your average. Two actions for this week, ready to approve.',
      countdown: 'This week',
    },
    annual: {
      insight: 'October–February is your high season (cooler evenings, outdoor courts). April–June dips 30%; monsoon (Jul–Aug) moves play indoors.',
      peakTitle: 'High season · from early October',
      nextPeak: '3 Oct',
      series: [
        { month: 'Sep 25', actual: 412000 },
        { month: 'Oct 25', actual: 538000, label: 'High season' },
        { month: 'Nov 25', actual: 571000 },
        { month: 'Dec 25', actual: 602000 },
        { month: 'Jan 26', actual: 589000 },
        { month: 'Feb 26', actual: 548000 },
        { month: 'Mar 26', actual: 476000 },
        { month: 'Apr 26', actual: 389000 },
        { month: 'May 26', actual: 352000, label: 'Summer dip' },
        { month: 'Jun 26', actual: 361000 },
        { month: 'Jul 26', actual: 398000, label: 'Monsoon · indoor' },
        { month: 'Aug 26', actual: 405000 },
        { month: 'Sep 26', forecast: 431000, low: 410000, high: 452000 },
        { month: 'Oct 26', forecast: 559000, low: 525000, high: 593000 },
        { month: 'Nov 26', forecast: 590000, low: 552000, high: 628000 },
        { month: 'Dec 26', forecast: 624000, low: 580000, high: 668000 },
      ],
      keyFacts: [
        { label: 'High season', value: 'Oct–Feb', hint: '58% of your year' },
        { label: 'Summer dip', value: '−30%', hint: 'Apr–Jun vs average' },
      ],
    },
    monthly: {
      insight: 'Membership dues are paid 1st–10th. 18% pay after the 10th, mostly people who were sent the link before payday.',
      current: 'Dues link on the 25th · SMS',
      proposed: 'Dues link on the 1st · 8 PM · WhatsApp',
      days: Array.from({ length: 12 }, (_, i) => ({ day: String(i + 1), share: [21, 17, 9, 7, 6, 5, 5, 4, 4, 4, 9, 9][i] })),
      groups: [
        { name: 'Pay on 1st–2nd', count: 144, pattern: 'Right after salary', send: '1st · 8 PM' },
        { name: 'Pay mid-window', count: 168, pattern: '3rd–10th', send: '1st + reminder 7th' },
        { name: 'Pay after 10th', count: 68, pattern: 'Late 3+ times', send: '1st + reminder 5th & 9th' },
      ],
      keyFacts: [
        { label: 'Paid after the 10th', value: '18%', hint: '68 of 380 members' },
        { label: 'Best send time', value: '1st · 8 PM' },
      ],
    },
    weekly: {
      insight: 'Friday 6–9 PM and weekend mornings are full. Tuesday 6–9 PM runs at 38% of an average evening.',
      grid: [
        [0.5, 0.2, 0.15, 0.25, 0.6, 0.3],
        [0.45, 0.15, 0.1, 0.2, 0.3, 0.15],
        [0.5, 0.2, 0.15, 0.25, 0.6, 0.3],
        [0.5, 0.2, 0.15, 0.25, 0.65, 0.35],
        [0.45, 0.2, 0.2, 0.35, 1.0, 0.7],
        [0.95, 0.85, 0.4, 0.5, 0.8, 0.6],
        [1.0, 0.8, 0.35, 0.45, 0.6, 0.3],
      ],
      keyFacts: [
        { label: 'Quietest prime slot', value: 'Tue 6–9 PM', hint: '38% of an average evening' },
        { label: 'Best time to message', value: 'Thu 7 PM', hint: 'most bookings within 48h' },
        { label: 'Regulars slipping', value: '6', hint: 'Friday players, 3+ weeks absent' },
      ],
    },
    actions: [
      {
        id: 'c-regulars',
        layer: 'week',
        kind: 'message',
        title: 'Check in with 6 Friday regulars who’ve gone quiet',
        summary: 'A personal note and a Friday court link to regulars who haven’t booked in 3+ weeks.',
        why: [
          'Each played most Fridays for 2+ months, then stopped 3–4 weeks ago.',
          'Last season, members who skipped 4+ weeks were 3× more likely not to renew.',
          'Thursday 7 PM messages lead to the most bookings within 48 hours.',
        ],
        impact: '3–4 regulars back (~₹4K–₹6K a month each in bookings and café)',
        confidence: 'Medium',
        executesVia: 'Payment Links + WhatsApp',
        when: 'Thu, 10 Sep · 7:00 PM',
        recipients: fridayRegulars,
        message: 'Hey {first_name}, we’ve missed you at Friday doubles! Court 3 is open this Friday 7–8 PM. Book here: {payment_link}\n– Courtside',
      },
      {
        id: 'c-tuesday',
        layer: 'week',
        kind: 'message',
        title: 'Fill Tuesday evenings with a members-only offer',
        summary: '15% off Tuesday 6–9 PM court bookings, sent to 120 members who play weekday evenings.',
        why: [
          'Tuesday 6–9 PM runs at 38% of an average evening.',
          '120 opted-in members already book weekday evenings, mostly Mon/Wed/Thu.',
          '15% is within your 20% discount limit.',
        ],
        impact: '~₹9K–₹14K extra a month from an empty slot',
        confidence: 'Medium',
        executesVia: 'Offers + WhatsApp via Razorpay Engage',
        when: 'Mon, 14 Sep · 7:00 PM',
        recipients: fridayRegulars.slice(0, 3).map((r) => ({ ...r, detail: 'Plays weekday evenings' })),
        message: 'Tuesday nights just got better: 15% off any court, 6–9 PM, members only. Book: {payment_link}',
      },
      {
        id: 'c-dues',
        layer: 'month',
        kind: 'message',
        title: 'Send October dues on the 1st at 8 PM on WhatsApp',
        summary: 'Move the dues link from the 25th (SMS) to the 1st (WhatsApp), with reminders for usual late payers.',
        why: ['18% of members pay after the 10th; most were sent the link before payday.', 'Payments on the 1st–2nd peak between 7 and 10 PM.'],
        impact: 'Fewer late dues: ~30 fewer chases a month',
        confidence: 'Medium',
        executesVia: 'Payment Links + WhatsApp',
        when: 'Thu, 1 Oct · 8:00 PM',
        recipients: fridayRegulars.slice(0, 4),
        message: 'Hi {first_name}, your October Courtside membership (₹2,500) is due by 10 Oct: {payment_link}',
      },
      {
        id: 'c-season',
        layer: 'year',
        kind: 'message',
        title: 'Open high-season leagues to lapsed members',
        summary: 'Invite 74 members who stopped playing in summer to the October league.',
        why: ['High season (Oct–Feb) brings 58% of your year.', '74 members played in Oct–Feb last year but not since April.'],
        impact: '₹35K–₹55K in league fees and bookings',
        confidence: 'Medium',
        executesVia: 'Payment Pages + WhatsApp',
        when: 'Fri, 18 Sep · 7:00 PM',
        recipients: fridayRegulars.slice(2, 6),
        message: 'Courts are cooling down 🎾 Our October league starts 3 Oct, and spots are limited. Sign up: {page_link}',
      },
    ],
    moments: [
      { date: '10 Sep', title: 'Check in with Friday regulars', layer: 'week', status: 'now', note: 'Thu 7 PM' },
      { date: '14 Sep', title: 'Tuesday offer', layer: 'week', status: 'now', note: 'Needs approval' },
      { date: '18 Sep', title: 'League invites', layer: 'year', status: 'soon', note: 'Before high season' },
      { date: '1 Oct', title: 'October dues', layer: 'month', status: 'soon', note: 'WhatsApp, 8 PM' },
      { date: '3 Oct', title: 'High season begins', layer: 'year', status: 'later', note: 'Oct–Feb = 58% of year' },
    ],
    review: {
      title: 'Last 4 weeks review',
      period: '10 Aug – 6 Sep 2026',
      series: [
        { label: 'Week 1', forecast: 96000, actual: 99000 },
        { label: 'Week 2', forecast: 98000, actual: 94000 },
        { label: 'Week 3', forecast: 101000, actual: 104000 },
        { label: 'Week 4', forecast: 102000, actual: 97000 },
      ],
      outcomes: [
        { action: 'Weekend tournament message', result: '22 bookings · ₹26,400', tone: 'positive' },
        { action: 'Tuesday slot', result: 'Still 38% of average', tone: 'notice' },
      ],
      prompts: ['What went well?', 'What went wrong?', 'Anything unusual?'],
      sampleFeedback: 'Rain on two weekends hurt outdoor bookings. The tournament worked. Café sales were down because the coffee machine was broken for a week.',
    },
    whatsapp:
      'Seasons · The Courtside Club\n\n6 of your Friday regulars haven’t played in 3+ weeks, and Tuesday evenings are at 38% of normal.\n\n2 actions are ready for your approval this week.',
  },
  {
    id: 'thanda',
    name: 'Thanda Cool Appliances',
    type: 'ACs, coolers & appliances',
    icon: 'appliance',
    platform: 'Showroom (QR, POS) + online store',
    joined: 'Joined Razorpay 3 weeks ago',
    dataDays: 21,
    sources: {
      year: { source: 'benchmark', label: 'Using 240 similar appliance merchants · your own data from Aug 2027' },
      month: { source: 'benchmark', label: 'Using similar merchants · your own pattern after 3 cycles (Dec)' },
      week: { source: 'early', label: '3 of 8 weeks · early signal from your own data' },
    },
    headline: {
      layer: 'year',
      title: 'New here? Seasons starts with what similar merchants see',
      sub: 'Appliance sellers like you get a festive lift in Oct–Nov and their biggest season in Mar–Jun. Your plan uses their patterns until yours is ready.',
      countdown: 'Festive season in ~6 weeks',
    },
    annual: {
      insight:
        'For ACs, 45–50% of yearly sales happen in March–June (industry estimate). Similar merchants on Razorpay also see an Oct–Nov festive lift for appliances. Your own pattern replaces these benchmarks after your first full year.',
      peakTitle: 'Festive appliance buying · from mid-Oct (benchmark)',
      nextPeak: '15 Oct',
      series: [
        { month: 'Sep', forecast: 100, low: 90, high: 110 },
        { month: 'Oct', forecast: 135, low: 115, high: 155, label: 'Festive' },
        { month: 'Nov', forecast: 140, low: 118, high: 162 },
        { month: 'Dec', forecast: 85, low: 75, high: 95 },
        { month: 'Jan', forecast: 70, low: 60, high: 80 },
        { month: 'Feb', forecast: 95, low: 82, high: 108 },
        { month: 'Mar', forecast: 165, low: 140, high: 190, label: 'Summer' },
        { month: 'Apr', forecast: 230, low: 195, high: 265 },
        { month: 'May', forecast: 255, low: 215, high: 295 },
        { month: 'Jun', forecast: 190, low: 160, high: 220 },
        { month: 'Jul', forecast: 105, low: 90, high: 120 },
        { month: 'Aug', forecast: 90, low: 78, high: 102 },
      ],
      keyFacts: [
        { label: 'Benchmark set', value: '240 merchants', hint: 'aggregated; shown only when 50+ match' },
        { label: 'Summer share (ACs)', value: '45–50%', hint: 'industry estimate, Mar–Jun' },
        { label: 'Your data so far', value: '21 days', hint: '₹3.1L collected' },
      ],
    },
    monthly: {
      insight: 'Similar appliance merchants see 34% of EMI purchases in salary week. Your own monthly pattern unlocks after 3 cycles (December).',
      current: 'Not enough data yet',
      proposed: 'Benchmark: promote EMI options in salary week',
      days: Array.from({ length: 10 }, (_, i) => ({ day: String(i + 1), share: [9, 8, 6, 5, 4, 3.5, 3, 2.5, 2.5, 2.5][i] })),
      groups: [{ name: 'All customers', count: 57, pattern: 'Too early to group', send: 'Benchmark default' }],
      keyFacts: [
        { label: 'Benchmark: EMI in salary week', value: '34%', hint: 'similar merchants, illustrative' },
        { label: 'Your pattern', value: 'Dec', hint: 'after 3 monthly cycles' },
      ],
    },
    weekly: {
      insight: 'Early signal from 3 weeks: Saturdays and Sundays bring 2× a weekday, mostly 12–6 PM. Firms up after 8 weeks.',
      grid: [
        [0.05, 0.2, 0.35, 0.35, 0.3, 0.05],
        [0.05, 0.2, 0.3, 0.35, 0.3, 0.05],
        [0.05, 0.2, 0.35, 0.35, 0.3, 0.05],
        [0.05, 0.2, 0.35, 0.4, 0.3, 0.05],
        [0.05, 0.25, 0.4, 0.45, 0.35, 0.1],
        [0.05, 0.45, 0.85, 1.0, 0.6, 0.1],
        [0.05, 0.4, 0.8, 0.9, 0.5, 0.1],
      ],
      keyFacts: [
        { label: 'Busiest', value: 'Sat 3–6 PM', hint: 'early signal, 3 weeks' },
        { label: 'Confidence', value: 'Low', hint: 'needs 5 more weeks' },
      ],
    },
    actions: [
      {
        id: 't-emi',
        layer: 'year',
        kind: 'setting',
        title: 'Turn on EMI options before festive buying',
        summary: 'Show card and cardless EMI at checkout. Similar merchants sell most ₹25K+ appliances on EMI.',
        why: [
          'Based on 240 similar appliance merchants: most orders above ₹25K are paid by EMI (illustrative benchmark).',
          'Your first 21 days: 12 orders above ₹25K, 9 of them abandoned at checkout.',
        ],
        impact: 'Higher conversion on big-ticket orders',
        confidence: 'Medium',
        basis: 'benchmark',
        executesVia: 'Affordability (EMI options)',
        when: 'Now',
        settingChange: [
          { label: 'Card EMI', from: 'Off', to: 'On' },
          { label: 'Cardless EMI / Pay Later', from: 'Off', to: 'On' },
        ],
      },
      {
        id: 't-stock',
        layer: 'year',
        kind: 'finance',
        title: 'Plan festive stock with a benchmark forecast',
        summary: 'Similar merchants sell ~35–40% more in Oct–Nov than September. Seasons sets reminders; funding is optional.',
        why: [
          'Benchmark: Oct–Nov runs at ~1.35–1.4× September for appliance merchants (illustrative).',
          'You have no history yet, so the range is wide. Seasons shows the range, not a single number.',
        ],
        impact: 'Fewer stock-outs during festive weeks',
        confidence: 'Low',
        basis: 'benchmark',
        executesVia: 'Reminders · Razorpay Capital optional',
        when: 'Decide by Mon, 21 Sep',
        settingChange: [{ label: 'Stock order reminder', from: 'None', to: 'Mon, 21 Sep · 10:00 AM' }],
      },
      {
        id: 't-weekend',
        layer: 'week',
        kind: 'message',
        title: 'Weekend showroom invite to recent enquiries',
        summary: 'Invite 18 people who paid a booking deposit to visit on Saturday afternoon, your busiest time so far.',
        why: ['Early signal (3 weeks): Saturday 12–6 PM is your busiest time.', '18 customers paid a ₹500 deposit but haven’t completed purchase.'],
        impact: '4–6 completed purchases',
        confidence: 'Low',
        basis: 'early',
        executesVia: 'Payment Links + WhatsApp',
        when: 'Fri, 11 Sep · 6:00 PM',
        recipients: [
          { name: 'Karthik R.', detail: '₹500 deposit · 1.5 ton AC', optedIn: true },
          { name: 'Pooja S.', detail: '₹500 deposit · air cooler', optedIn: true },
          { name: 'Imran K.', detail: '₹500 deposit · inverter AC', optedIn: true },
          { name: 'Divya M.', detail: '₹500 deposit · refrigerator', optedIn: false, excludedReason: 'No WhatsApp opt-in' },
        ],
        message: 'Hi {first_name}, your Thanda Cool booking is saved. Visit us this Saturday 12–6 PM to complete your purchase (EMI available): {payment_link}',
      },
    ],
    moments: [
      { date: '7 Sep', title: 'Starter plan (benchmarks)', layer: 'year', status: 'now', note: '3 actions' },
      { date: '21 Sep', title: 'Decide festive stock', layer: 'year', status: 'soon', note: 'Benchmark forecast' },
      { date: '15 Oct', title: 'Festive buying begins', layer: 'year', status: 'later', note: 'Benchmark' },
      { date: 'Dec', title: 'Your own monthly pattern', layer: 'month', status: 'later', note: 'After 3 cycles' },
      { date: 'Jan', title: 'Summer plan opens', layer: 'year', status: 'later', note: '8 weeks before March' },
    ],
    review: {
      title: 'First 3 weeks',
      period: '17 Aug – 6 Sep 2026',
      series: [
        { label: 'Week 1', forecast: 90000, actual: 84000 },
        { label: 'Week 2', forecast: 100000, actual: 112000 },
        { label: 'Week 3', forecast: 105000, actual: 116000 },
      ],
      outcomes: [{ action: 'No actions yet', result: 'Your first review comes after the festive season', tone: 'neutral' }],
      prompts: ['What went well?', 'What went wrong?', 'Anything unusual?'],
      sampleFeedback: 'Lots of people asked about EMI at the showroom. A heatwave in the last week of August brought more AC enquiries.',
    },
    whatsapp:
      'Seasons · Thanda Cool Appliances\n\nWelcome to Razorpay! You’re new, so Seasons will start with what 240 similar appliance merchants see: a festive lift from mid-October.\n\n3 starter actions are ready for your approval.',
  },
];

// Turn free-text merchant feedback into lessons for next season.
// In production this is an LLM call constrained to this output format; the prototype uses rules.
export function lessonsFromFeedback(text: string, merchantId: string) {
  const t = text.toLowerCase();
  const lessons: { signal: string; change: string; layer: Layer }[] = [];
  if (/ran out|sold out|stock|out of/.test(t))
    lessons.push({ signal: 'Stock ran out during the peak', change: 'Start the stock-funding step 2 weeks earlier and raise the stock estimate by 15%.', layer: 'year' });
  if (/courier|deliver|shipping|late deliver/.test(t))
    lessons.push({ signal: 'Courier delays', change: 'Move the “order by” date in customer messages 2 days earlier.', layer: 'year' });
  if (/expired|link/.test(t))
    lessons.push({ signal: 'Links expired before customers opened them', change: 'Send links closer to when each customer pays, and extend expiry to 7 days.', layer: 'month' });
  if (/whatsapp|replied|message worked|worked well/.test(t))
    lessons.push({ signal: 'WhatsApp messages worked', change: 'Keep WhatsApp as the default channel; reuse this message style next season.', layer: 'year' });
  if (/rain|weather|heat/.test(t))
    lessons.push({ signal: 'Weather affected demand', change: 'Flag weather as a one-off so it doesn’t distort next year’s forecast.', layer: 'year' });
  if (/emi/.test(t))
    lessons.push({ signal: 'Customers asking for EMI', change: 'Raise priority of EMI options in the next plan.', layer: 'year' });
  if (/travel|late/.test(t) && merchantId === 'kata')
    lessons.push({ signal: 'One-off late payment (travel)', change: 'Don’t move this family to “often late”; one late cycle is ignored.', layer: 'month' });
  if (/broken|machine/.test(t))
    lessons.push({ signal: 'Operational issue (not demand)', change: 'Exclude that week from café trends.', layer: 'week' });
  if (lessons.length === 0)
    lessons.push({ signal: 'Noted', change: 'Saved to this season’s notes. Seasons will ask about it again before the next plan.', layer: 'year' });
  return lessons;
}

export const formatINR = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 2)}L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}K`;
  return `₹${n}`;
};
