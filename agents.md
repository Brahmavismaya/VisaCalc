# AGENTS.md — Immigration Calculator Site

## SKILL
Before writing ANY frontend code, read and follow:
`/mnt/skills/public/frontend-design/SKILL.md`
This is mandatory. No generic aesthetics. No Inter/Roboto. No purple gradients. Commit to a bold, distinctive visual direction per page.

---

## STACK
- Static: HTML + CSS + Vanilla JS only. No frameworks, no backend.
- Hosting: Cloudflare Pages (free)
- Domain: .eu.org (free)
- Monetization: Google AdSense
- Target: Tier 1 — US, CA, UK, AU, NZ

---

## FILE STRUCTURE
```
/
├── index.html
├── about.html
├── contact.html
├── privacy-policy.html
├── terms-of-use.html
├── disclaimer.html
├── 404.html
├── sitemap.xml
├── robots.txt
├── css/style.css
├── js/main.js
├── tools/
│   ├── uk-spouse-visa-cost-calculator.html   ← BUILD FIRST
│   ├── canada-crs-calculator.html            ← BUILD SECOND
│   ├── australia-pr-points-calculator.html   ← BUILD THIRD
│   ├── us-green-card-wait-time.html
│   └── h1b-visa-timeline-estimator.html
└── blog/
    ├── uk-spouse-visa-guide.html
    ├── what-is-crs-score.html
    ├── canada-express-entry-explained.html
    ├── australia-skilled-migration-guide.html
    └── h1b-vs-green-card.html
```

---

## BUILD ORDER & RATIONALE
| # | Tool | Reason |
|---|------|--------|
| 1 | UK Spouse Visa Cost | Weakest competition, highest cost confusion, simple logic |
| 2 | Canada CRS | Biggest global search volume, mobile UX gap |
| 3 | Australia PR Points | Good demand, official tool has terrible UX |
| 4 | H1B / Green Card | Build after site has traffic and trust |

---

## DESIGN RULES (read SKILL.md first, then apply these)
- Mobile-first. Min width 320px. No horizontal scroll ever.
- Touch targets ≥ 44×44px
- Input font-size ≥ 16px (prevents iOS zoom)
- NEVER wall-of-fields. Use wizard steps (one section at a time).
- Live result update as user fills fields — no "Submit" button needed
- Progress bar on all multi-step tools: "Step 2 of 4"
- Every input: icon + label + `?` tooltip in plain English
- Results: color-coded (green = strong / yellow = borderline / red = low)
- CTA labels = exact action: "Calculate My CRS Score" not "Submit"
- Show "Last Updated" date visibly on every tool
- Show "Your data stays in your browser — never sent to servers" on every tool

## COLORS
```
Primary:    #1a2744
Accent:     #00b4a6
Success:    #22c55e
Warning:    #f59e0b
Danger:     #ef4444
Background: #f8fafc
Card:       #ffffff
Text:       #1e293b
```
Use CSS variables. Skill.md aesthetic direction overrides these where appropriate.

---

## POPULAR FEATURES (implement on all tool pages)

### Must-Have UX
- **Copy Result button** — one tap copies score + breakdown as text
- **Share Result button** — native share API (WhatsApp, Twitter, etc.)
- **Save as PDF** — browser print-to-PDF, pre-styled print stylesheet
- **Score History** — localStorage stores last 3 results with timestamps
- **"How to improve your score"** — dynamic tips that appear based on user's weakest category
- **Draw Cutoff Comparison** — show user's score vs recent actual cutoffs (hardcoded, updated manually)
- **Progress indicator** — "You're in the top X% of applicants" shown after result
- **Related Tools** — card grid linking to other calculators, always visible after result

### Trust Signals (mandatory, immigration niche)
- "Not legal advice" badge on every tool
- "Data never leaves your browser" note
- Last verified date against official source
- Link to official government source (IRCC, Gov.uk, HomeAffairs)

### Navigation
- Sticky top nav with tool links — visible at all times
- Mobile: hamburger → slide-in drawer
- "All Tools" hub on homepage — card grid, icon per tool, one-line description
- Breadcrumbs on tool and blog pages

### Homepage Layout
```
[Hero: headline + subheadline + search bar filtering tools]
[Tool Cards Grid — icon, name, one-line description, "Use Free Tool →"]
[Why Trust Us — 3 trust badges]
[Latest Blog Articles — 3 cards]
[Footer]
```

---

## TOOL SPECS

### 1. UK Spouse Visa Cost Calculator
**Keyword:** `uk spouse visa cost calculator`
**Inputs:** application location (inside/outside UK), dependants count, visa duration (2.5yr/5yr), priority service (yes/no)
**Output:** itemized table — visa fee + IHS surcharge + biometrics + priority (if selected) + TOTAL in £
**Note:** IHS = £1,035/adult/yr, £776/child/yr. Outside UK fee = £1,938. Inside UK = £1,321.

### 2. Canada CRS Score Calculator
**Keyword:** `canada crs score calculator`
**Inputs:** age, marital status, education (CA/foreign), CLB language scores (R/W/S/L), spouse scores, CA work exp, foreign work exp, provincial nomination, job offer, CA education, sibling in CA
**Output:** score/1200 + breakdown by category + color rating + recent draw cutoff comparison
**Note:** Job offer points removed March 2025 per IRCC update. Reflect this.

### 3. Australia PR Points Calculator
**Keyword:** `australia pr points calculator`
**Inputs:** age, English level, overseas work exp, Australian work exp, education, partner skills, state nomination, regional nomination
**Output:** points total + pass/fail vs 65-point threshold + category breakdown + competitive range context (65 = min, 80–95 = competitive)

### 4. US Green Card Wait Time
**Keyword:** `green card wait time by country`
**Inputs:** country of birth, category (EB1/EB2/EB3/FB1/FB2A/FB2B/FB3/FB4), priority date
**Output:** estimated wait range + retrogression explanation

### 5. H-1B Timeline Estimator
**Keyword:** `h1b visa processing time 2025`
**Inputs:** filing type (regular/premium), service center, fiscal year
**Output:** timeline ranges + visual step tracker

---

## SEO (every page)
```html
<title>[Tool Name] | Free [Year] Calculator</title>
<meta name="description" content="[150–160 chars, keyword natural]">
<meta name="robots" content="index, follow">
<link rel="canonical" href="FULL_URL">
<meta property="og:title|description|url|type">
<meta name="twitter:card" content="summary">
```
- H1: exact keyword ("UK Spouse Visa Cost Calculator 2025")
- H2s: related questions users actually Google
- JSON-LD: `WebApplication` + `FAQPage` schema on every tool page
- Each tool links to 2 related tools + 1 blog article
- Lighthouse mobile ≥ 90

## robots.txt
```
User-agent: *
Allow: /
Sitemap: https://DOMAIN/sitemap.xml
```

---

## ADSENSE PLACEMENT
```
[Nav]
[H1 + 2-line intro]
[TOOL INPUT + RESULT]          ← zero ads until result shown
[AD 1 — leaderboard 728×90]   ← immediately after result
[Score explanation content]
[AD 2 — rectangle 300×250]    ← mid content
[Tips / How to improve]
[AD 3 — leaderboard]          ← before FAQ
[FAQ — 5 to 8 Qs]
[Related Tools cards]
[AD 4 — mobile only, above footer]
[Footer]
```

### Ad Placeholder HTML (use in every tool)
```html
<div class="ad-slot ad-slot--lead" id="ad-post-result"></div>
<div class="ad-slot ad-slot--rect" id="ad-mid"></div>
<div class="ad-slot ad-slot--lead" id="ad-pre-faq"></div>
```
```css
.ad-slot{width:100%;margin:24px 0;text-align:center;min-height:90px}
.ad-slot--rect{min-height:250px;max-width:336px;margin:24px auto}
```

---

## REQUIRED PAGES (AdSense approval)
| Page | Content |
|------|---------|
| about.html | Site purpose, "not legal advice", who runs it |
| contact.html | Real email or working contact form |
| privacy-policy.html | GDPR + AdSense/cookie disclosure |
| terms-of-use.html | Calculator use terms |
| disclaimer.html | "Not legal advice, verify with official sources" |

---

## BLOG (min 5 before AdSense apply)
| File | Keyword | Words |
|------|---------|-------|
| uk-spouse-visa-guide.html | uk spouse visa cost 2025 | 1200 |
| what-is-crs-score.html | what is crs score canada | 1200 |
| canada-express-entry-explained.html | canada express entry guide | 1500 |
| australia-skilled-migration-guide.html | australia skilled migration points | 1200 |
| h1b-vs-green-card.html | h1b visa processing time | 1000 |
Each: links to tool + FAQPage schema + "Use our free calculator →" CTA

---

## PERFORMANCE
- No jQuery, no Bootstrap, no external JS
- Minify CSS + JS before deploy
- WebP images, lazy loaded
- Preload chosen display font
- Favicon: 32×32 + 180×180 apple-touch-icon
- Target: FCP < 1.5s, TBT < 200ms

---

## LAUNCH CHECKLIST
- [ ] All calculations verified vs official gov sources
- [ ] Tested at 320 / 375 / 768 / 1280px
- [ ] Unique title + meta on every page
- [ ] sitemap.xml complete + submitted to Search Console
- [ ] robots.txt live
- [ ] 5 required pages live
- [ ] 404.html with nav back to homepage
- [ ] Favicon set
- [ ] GA4 on all pages
- [ ] Ad placeholder divs in place
- [ ] No console errors
- [ ] HTTPS live on Cloudflare
- [ ] AdSense applied
