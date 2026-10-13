// Content for the "Product thinking" tab: how Seasons answers the questions a product reviewer asks.
// Each item links to the exact place in the prototype where the answer can be seen.

export type Jump = { label: string; merchant: string; view: 'overview' | 'year' | 'month' | 'week' | 'review' | 'controls' | 'activity'; drawer?: string };
export type Block = { p: string } | { list: string[] } | { table: { head: string[]; rows: string[][] } };
export interface ThinkingItem { id: string; q: string; tag: string; short: string; body: Block[]; jumps: Jump[] }

export const thinking: ThinkingItem[] = [
  {
    id: 'problem', tag: 'Problem', q: 'Is this an important problem?',
    short: 'Many small merchants earn most of their year in a few weeks, and nothing tells them when those weeks are coming or what to do before them.',
    body: [
      { p: 'Seasonality is extreme at the level of a single business, even when the market as a whole looks smooth.' },
      { list: [
        'Our D2C food merchant (real Razorpay data): 68% of 12 months’ collections in 3 months; Feb–Aug together brought 21%.',
        'ACs: 45–50% of yearly sales happen in March–June (Business Today).',
        'Festive trade from Navratri to Diwali 2025: about ₹6.05 lakh crore (CAIT, via Zoutons).',
        'On Razorpay, orders rose 37% in the three weeks before Diwali (Razorpay festive report, 2021 data), so preparation has to start earlier still.',
        '70% of MSMEs struggle to keep enough stock and face 22–28 day shipping delays (BW Businessworld), so the useful window is 6–8 weeks ahead.',
      ] },
      { p: 'Sizing: there is no public count of seasonal merchants. Razorpay can measure it directly: the share of active merchants whose top 3 months bring 40% or more of their year. We would size the opportunity with that query before building.' },
    ],
    jumps: [{ label: 'See a merchant’s year at a glance', merchant: 'mithas', view: 'overview' }, { label: 'See the season forecast', merchant: 'mithas', view: 'year' }],
  },
  {
    id: 'merchant', tag: 'Merchant', q: 'Do we understand the merchant and how they work today?',
    short: 'Built from one merchant’s real Razorpay data and one in-depth merchant interview; each demo merchant traces back to that evidence.',
    body: [
      { table: { head: ['Evidence', 'What it showed', 'Where it shows up'], rows: [
        ['D2C food brand: real dashboard data (11 months)', '68% of the year in 3 months; 86 of 108 festive buyers didn’t return; card failures 23% at peak vs 13% UPI', 'Mithas Foods: Diwali plan, win-back message, UPI-first checkout'],
        ['Course seller, ₹10L/month: interview', 'Sends fee links in bulk by SMS on a fixed date; links expire early; “nobody uses SMS”; wants WhatsApp; checks payments by downloading reports; asked “is it more on a Wednesday or a Sunday?”', 'Kata Academy: per-family timing, expiry check, WhatsApp; weekly view'],
        ['Same interview', '“I don’t actively see AI features”: Razorpay’s AI wasn’t reaching this merchant', 'RAY on WhatsApp brings Seasons to the merchant'],
      ] } },
      { p: 'Honest gap: the course seller didn’t talk about yearly seasonality, so their evidence supports the monthly and weekly parts, not the annual one.' },
    ],
    jumps: [{ label: 'See the course seller’s fee cycle', merchant: 'kata', view: 'month' }, { label: 'See the D2C season plan', merchant: 'mithas', view: 'year' }],
  },
  {
    id: 'ai', tag: 'Why AI', q: 'Why AI, and what does it do better than a fixed rule?',
    short: 'A fixed rule needs a fixed calendar and enough history. Real merchants have neither: festivals move, every customer pays on a different day, and new merchants have no past.',
    body: [
      { table: { head: ['A fixed rule would…', 'Seasons instead…'], rows: [
        ['Start the Diwali push on the same date as last year', 'Learns this merchant’s own ramp (orders rise 21 days before Diwali) and shifts it because Diwali moves 19 days later in 2026'],
        ['Send every fee link on the 28th', 'Times each family’s link to when they usually pay, and checks that link expiry doesn’t cut off late payers'],
        ['Remind everyone every week', 'Spots the 6 regulars whose own pattern broke, and the slot that runs empty'],
        ['Need a year of history before saying anything', 'Predicts from similar merchants (ranges from 50+ businesses) and switches to the merchant’s own data as it arrives'],
        ['Ignore what the merchant knows', 'Reads the merchant’s notes after a season (live Gemini) and turns them into specific changes for next time'],
        ['Send one English template', 'Rewrites the message in Hindi or Hinglish (live Gemini) while checks keep the name, link, amounts and STOP intact'],
      ] } },
    ],
    jumps: [{ label: 'See the moving-Diwali forecast', merchant: 'mithas', view: 'year' }, { label: 'See predictive mode', merchant: 'thanda', view: 'overview' }, { label: 'Try the live notes → lessons', merchant: 'mithas', view: 'review' }],
  },
  {
    id: 'control', tag: 'Control', q: 'What can the merchant review, change, approve or stop?',
    short: 'Everything that touches a customer or money waits for approval; everything else can be undone or paused.',
    body: [
      { list: [
        'Review who gets each message (no opt-in, no message), edit it, translate it, preview it on WhatsApp, then approve, skip or undo.',
        'Settings show a before/after table; money decisions are only prefilled, never submitted.',
        'Preferences: discount limit, messages per customer per month, quiet hours, SMS backup, which layers run, and pause. Loosening a protection asks for confirmation.',
        'Every suggestion, approval, edit and change is in the Activity log.',
      ] },
    ],
    jumps: [{ label: 'Open an approval', merchant: 'mithas', view: 'year', drawer: 'm-winback' }, { label: 'See Controls', merchant: 'mithas', view: 'controls' }],
  },
  {
    id: 'learn', tag: 'Learning', q: 'How does the system learn from the outcome?',
    short: 'After every season or cycle it compares forecast with actual, shows what each action did, asks the merchant what it couldn’t see, and proposes changes the merchant chooses to keep.',
    body: [
      { list: [
        'Forecast vs actual, per week of the season.',
        'Outcome of each approved action (e.g. Rakhi message: 9 of 41 ordered, ₹18,450).',
        'Merchant notes → changes for next time (live Gemini), checked for invented figures and anything that skips approval.',
        'Kept changes appear on the next plan (“Changed after Rakhi 2026 review” on the stock-funding card).',
        'Skipped suggestions aren’t repeated that season; one-off events (weather, outages, travel) are flagged so they don’t distort next year.',
      ] },
    ],
    jumps: [{ label: 'See Review & learn', merchant: 'mithas', view: 'review' }],
  },
  {
    id: 'trust', tag: 'Trust', q: 'How are accuracy, permissions, trust and failures handled?',
    short: 'Ranges not single numbers, visible confidence and evidence, opt-in only, approval for anything customer-facing, and safe fallbacks when anything fails.',
    body: [
      { list: [
        'Accuracy: forecasts are ranges; every suggestion shows confidence and the evidence behind it; predictive mode is labelled.',
        'Permissions: customers without WhatsApp opt-in are excluded automatically; every message has STOP; quiet hours and message caps.',
        'Privacy: similar-merchant data is aggregated from 50+ businesses, shown as ranges, never names or exact figures.',
        'AI safety: every Gemini output is checked; a rewrite that drops the link or STOP, or adds a discount, is rejected.',
        'Failures: if Gemini or Razorpay is unavailable, the app falls back and says so. Razorpay calls refuse live keys.',
        'Cost: WhatsApp messages are charged by the merchant’s provider; the approval panel shows the message type and an estimate before approval.',
      ] },
    ],
    jumps: [{ label: 'See the guardrails in an approval', merchant: 'mithas', view: 'year', drawer: 'm-winback' }],
  },
  {
    id: 'left', tag: 'Priorities', q: 'What did we choose to build, and what did we leave out?',
    short: 'We built one planning engine for three time horizons and left out anything that was crowded, needed data Razorpay doesn’t have, or removed the merchant’s control.',
    body: [
      { table: { head: ['Left out', 'Why'], rows: [
        ['A failed-payment recovery agent', 'Razorpay already has Cart Recovery, Subscription Recovery and its retry engine; in our data 31 of 50 failed payments were paid within 3 days anyway; most competing entries built this'],
        ['Chasing overdue payers', 'Same pattern as debt collection; Seasons focuses on asking at the right time instead'],
        ['Order and refund reconciliation', 'Needs Wix order data Razorpay doesn’t hold; faking it would be dishonest'],
        ['Stock forecasting in units', 'Razorpay sees rupees, not products; the merchant confirms stock instead'],
        ['Fully automatic sending', 'Merchants approve every customer message; that is the baseline'],
        ['A translated dashboard', 'Customer messages in Hindi first, where the value is; the dashboard languages are marked coming soon'],
      ] } },
    ],
    jumps: [],
  },
  {
    id: 'risks', tag: 'Risks', q: 'What are we assuming, and what could go wrong?',
    short: 'The biggest assumptions are that merchants act on a plan weeks ahead, and that timing changes customer behaviour. Both are testable in one pilot.',
    body: [
      { table: { head: ['Assumption', 'If it’s wrong', 'How we’d test or reduce it'], rows: [
        ['Merchants act on a plan 6–8 weeks ahead', 'Plans are ignored', 'Readiness completion rate before the peak; WhatsApp nudges via RAY'],
        ['Sending when customers usually pay improves response', 'No lift from timing', 'Split send times in the pilot (salary week vs mid-month)'],
        ['Peaks repeat year to year', 'Forecast misses', 'Ranges, similar-merchant data, and checking actuals fall inside the range'],
        ['Enough customers have opted in', 'Too few reachable', 'Show reach before approval; add opt-in at checkout'],
        ['WhatsApp costs are acceptable', 'Merchants won’t pay', 'Show the cost before approval; prefer cheaper utility messages for reminders'],
        ['Razorpay knows who the customer is', 'In-person QR payments are often anonymous', 'Individual nudges only for identified, opted-in customers'],
        ['Merchants see it as help, not upselling', 'Trust drops', 'Merchant-first actions lead; Capital is always optional'],
      ] } },
    ],
    jumps: [],
  },
  {
    id: 'value', tag: 'Value', q: 'Will merchants value it?',
    short: 'The problems are validated with real merchant evidence; the solution itself hasn’t been put in front of merchants yet, so the next step is a concept test and a pilot.',
    body: [
      { list: [
        'Validated: the course seller’s manual fee cycle, SMS that “nobody uses”, link expiry problems, wanting WhatsApp, wanting to see when customers pay; the D2C brand’s 3-month peak and lapsed festive buyers.',
        'Not yet validated: whether merchants approve plans weeks ahead, and whether timing lifts response.',
        'Next: show the prototype to 5 merchants (2 festive D2C, 2 course sellers, 1 club), then a pilot before the next festive season.',
      ] },
    ],
    jumps: [],
  },
  {
    id: 'business', tag: 'Business', q: 'Why is this good for Razorpay?',
    short: 'Merchants who are ready for their peaks collect more through Razorpay, stay longer, and use more of what Razorpay already sells.',
    body: [
      { list: [
        'More payments through Razorpay during peaks (better checkout, more returning buyers, fewer missed fees).',
        'Stickiness: a plan that knows the merchant’s year is hard to replace.',
        'Adoption of existing products at the moment they’re needed: UPI AutoPay, Engage, Offers, EMI, International payments, Capital.',
        'Builds on Razorpay’s direction: Agent Studio, RAY on WhatsApp, and forecasting.',
        'Timing: competing payment companies announced merchant agent suites in September 2026; planning ahead for peaks is a gap none of them claims.',
        'Pricing: free inside the dashboard; revenue comes from the payments and products it drives. WhatsApp costs are paid by the merchant to their provider.',
      ] },
    ],
    jumps: [{ label: 'See which Razorpay products each action uses', merchant: 'mithas', view: 'year' }],
  },
  {
    id: 'metrics', tag: 'Metrics', q: 'What business outcome would we measure?',
    short: 'Main outcome: collections in the peak window compared with a matched group of similar merchants without Seasons.',
    body: [
      { table: { head: ['Type', 'Metric'], rows: [
        ['Main outcome', 'Peak-window collections vs a matched control group (and vs the merchant’s own last season)'],
        ['Leading signals', 'Readiness tasks done before the peak; past buyers reached before the rush; payment success during the peak; on-time share for monthly payers'],
        ['Forecast quality', 'Share of actual weeks that fall inside the forecast range'],
        ['Trust & adoption', 'Approve / edit / skip rates; merchants who keep Seasons on after one season'],
        ['Guardrails', 'STOP / opt-out rate; complaints; discount cost; merchants who pause Seasons'],
      ] } },
      { p: 'Pilot: merchants with a clear peak split into Seasons and control groups before the next festive season; monthly-collection merchants first, because results show within one cycle.' },
    ],
    jumps: [{ label: 'See forecast vs actual', merchant: 'mithas', view: 'review' }],
  },
  {
    id: 'real', tag: 'Honesty', q: 'What is real in this prototype, and what is simulated?',
    short: 'Razorpay test-mode Payment Links and Gemini calls are real; merchants, customers and numbers are synthetic.',
    body: [
      { list: [
        'Real: Payment Links created in Razorpay test mode on approval (nothing sent, live keys refused); Gemini for Hindi/Hinglish rewrites and for turning notes into lessons.',
        'Synthetic: all merchants, customers and figures (two modelled on real evidence); similar-merchant benchmarks are illustrative.',
        'Pre-written: forecasts, insights and drafted messages.',
        'Not built: actual WhatsApp sending, Engage/Capital integrations.',
      ] },
    ],
    jumps: [],
  },
];
