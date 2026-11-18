# StockHours welcome app (Whop)

Static welcome page for the StockHours Whop app, built in the same format as the All In Abe welcome app, with the content and plans from nourtrades.com.

## Plans (same as nourtrades.com)

| Plan | Price | Whop plan |
| --- | --- | --- |
| Signals Chat · Monthly | $249/mo | `plan_mNqOeTtQdUwdI` |
| Signals Chat · 3 months | $499.99 one payment | `plan_rJGyBGGeKU3xL` |
| VIP Bundle (Signals + Algo) · Monthly | $275/mo | `plan_gSHcTOO8Tepwk` |
| VIP Bundle · 3 months | $549.99 one payment | `plan_ZRJSPKXw7ttxY` |
| Free Discord | $0 | `plan_WafKE7MWvAvTm` |

Upsells in the plan builder (`#join`), as on nourtrades.com:
- **Add the Algo** → upgrades Signals to the VIP Bundle (+$26/mo, or +$50 on the 3-month plan)
- **Make it 3 months** → switches to the one-payment quarterly plan (save $247 on Signals, $275 on VIP)

Partner section: Vanquish Trader (https://www.vanquishtrader.co/nour/) with code `NOUR`.

## Files

- `index.html` — the welcome page
- `thanks.html` — return page after Whop checkout
- `assets/checkout.js` — Whop embedded checkout (plan IDs live here)
- `assets/site.js` — plan builder, results reel, lightbox, copy code, sticky CTA
- `assets/styles.css` — styles

## Deploy

Plain static files, no build step.

1. Import this repo in Vercel (framework preset: **Other**, no build command, output = repo root) and deploy.
2. In the Whop developer dashboard → your app → **Hosting**: set **Base URL** to the Vercel URL (e.g. `https://stockhours-welcome.vercel.app`) and **Experience path** to `/experiences/[experienceId]`.
3. Reload the app in your Whop.

`vercel.json` rewrites `/experiences/<id>` to `index.html`, which is the path Whop loads inside the app frame.

Preview locally:

```bash
python3 -m http.server 8000
```
