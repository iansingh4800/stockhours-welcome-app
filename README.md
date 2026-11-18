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

## Page (sales layout)

Top to bottom: gold proof bar · hero with Nour's 46-second welcome video (self-hosted, loads on tap) · ticker of member wins · Mohammed S.'s posted-wins statement ($7,100, Jul 6 to Jul 28) · receipts wall (24 profits-chat screenshots) and member testimonials · Nour on Wall Street · on-your-own vs Signals Chat · 3 steps · plan comparison + plan builder (`#join`) · Vanquish NOUR row · FAQ · close with P.S. · footer with the free Discord link and full disclosure.

## Files

- `index.html` — the welcome page
- `thanks.html` — return page after Whop checkout
- `assets/sales.css` — styles for `index.html` (black and gold, Archivo, Caveat for hand-written notes)
- `assets/styles.css` — older styles, still used by `thanks.html`
- `assets/checkout.js` — Whop embedded checkout (plan IDs live here)
- `assets/site.js` — video, receipts "see all", lightbox, plan builder, copy code, sticky bar
- `assets/fonts/caveat-latin.woff2` — hand-written font
- `assets/video/vsl.mp4` — hero video, 1080p web encode (8 MB) of `source/vsl-original.mp4` (4K original, not loaded by the page)
- `assets/img/vsl-poster.webp` — the video's cover frame

To change the hero video, point `data-src` / `data-poster` on the `.video` element at new files (or use `data-video="<YouTube id>"` instead for a YouTube video). Re-encode a new upload with:
`ffmpeg -i in.mp4 -vf scale=1920:-2 -c:v libx264 -preset slow -crf 24 -c:a aac -b:a 128k -movflags +faststart assets/video/vsl.mp4`. Captions on the receipts and the statement rows are typed from the screenshots; update them if you swap images.

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
