# Razorpay Seasons (prototype)

Prototype for the Razorpay AI PM Build Challenge (ISB, 2026). **Not a live Razorpay product.**

Seasons learns when each merchant's customers pay (across the year, month and week) and prepares the merchant before each moment. It suggests; the merchant approves; then it acts through existing Razorpay products (Payment Links, Engage, Capital, checkout settings). Nothing reaches a customer or the merchant's money without approval.

- Built with React, TypeScript, Vite and Razorpay's open-source Blade design system (MIT).
- All merchants and numbers are synthetic, shaped on interviews with nine merchants and one merchant's real payment pattern; names are fictional.
- Gemini runs live: it translates customer messages (Hindi, Hinglish), rewrites them, and turns season notes into lessons. Its output is checked before the merchant sees it. Razorpay Payment Links are created live in test mode on approval. See [AI_BUILD_LOG.md](AI_BUILD_LOG.md).

```
npm install
npm run dev
```

See [USER_JOURNEY.md](USER_JOURNEY.md) for the step-by-step merchant journey, or use **Take the tour** in the app.
