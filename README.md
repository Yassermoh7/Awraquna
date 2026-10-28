# Awraquna website

One Next.js app serving three things:

| Section | URL (production) | What it is |
|---|---|---|
| Awraquna Group homepage | `awraquna.com/` | "A stronger tomorrow": the two division circles (hover to preview, keep scrolling to enter), plus about, divisions and contact sections |
| Awraquna Plus | `awraquna.com/plus`, `/shop/…`, `/about-us`, `/contactus`, `/blog`, `/jobs` | Business supplies store (thermal paper, labels, ribbons, labelers) |
| Awraquna Legal Services | `legal.awraquna.com` (served from `/legal` in this app) | Trademarks, IP and legal advisory |

English URLs are unprefixed; Arabic lives under `/ar` (`/ar/shop/…`), the same scheme the old Odoo site used. **Every old product, category and page URL keeps working**, so search rankings and bookmarks carry over.

## Getting started

```bash
cp .env.example .env.local    # then edit
npm install
npm run dev                   # http://localhost:3000
```

With the defaults (`COMMERCE_SOURCE=sample`) the site runs on the bundled catalogue (`src/data/catalog.json`, the 42 products captured from the live site). Order requests and form submissions are appended to `data/order-requests.jsonl` and `data/leads.jsonl`, so everything works end to end without Odoo.

## How ordering works

The live site shows no prices and has no online checkout. Customers order on WhatsApp, and the new site keeps that model while making it easier:

1. Customers add products to an **order list**, with quantities in cartons or units.
2. From the order list they either:
   - **Send on WhatsApp**: a pre-filled message listing each SKU, name and quantity opens in WhatsApp, or
   - **Request a quotation**: in Odoo mode this creates a **draft quotation (sale.order)** for the customer. The sales team confirms price, stock, delivery and payment as they do today.

## Connecting Odoo

The live store runs **Odoo 15**. This site talks to it over Odoo's standard external API (JSON-RPC), so nothing needs installing on the Odoo server.

1. In Odoo, create a dedicated user (e.g. "Website API") with Sales and CRM access only.
2. Log in as that user → avatar → **Preferences → Account Security → New API Key**.
3. Set in `.env.local` (or the hosting environment):
   ```
   COMMERCE_SOURCE=odoo
   ODOO_URL=https://erp.awraquna.com
   ODOO_DB=<database name>
   ODOO_USER=<login of the API user>
   ODOO_API_KEY=<the key>
   ```
4. Check `ODOO_INDUSTRY_CATEGORY_IDS`. These are the website categories that are industries (Restaurants, Retail, Logistics, Healthcare) rather than product types; the defaults match the live site.

What the integration does (`src/lib/commerce/odoo.ts`):

| Site | Odoo |
|---|---|
| Product list and pages | Published `product.template` records, Arabic names via the `ar_001` translation |
| Categories and industries | `product.public.category` |
| Product specs (size, core, per carton…) | `Key: Value` lines in the product's **sales description** |
| Product images | `/web/image/product.template/<id>/image_1024` and extra product images |
| "Request a quotation" | Finds or creates the `res.partner` and creates a draft `sale.order` with the lines |
| Contact, bulk-quote and legal forms | `crm.lead`, optionally routed to a sales team (`ODOO_SALES_TEAM_ID`, `ODOO_LEGAL_TEAM_ID`) |

Catalogue data is cached in memory for 5 minutes.

> **Odoo 15 is out of support** (since October 2024). Because this site only uses the stable external API, upgrading Odoo later shouldn't require changes here, apart from the payment-provider model name if online payment is added.

## Going live (DNS plan)

Because `awraquna.com` will point at this site, Odoo needs its own hostname:

1. Give Odoo a subdomain, e.g. **`erp.awraquna.com`**, and confirm the back office and customer portal work there.
2. Deploy this app (Vercel or any Node host: `npm run build && npm start`) with the production env vars, including `NEXT_PUBLIC_SITE_URL=https://awraquna.com`.
3. Point **`awraquna.com`** and **`legal.awraquna.com`** at the app. Set `LEGAL_HOST=legal.awraquna.com` and `NEXT_PUBLIC_LEGAL_URL=https://legal.awraquna.com`.
4. Submit `https://awraquna.com/sitemap.xml` in Google Search Console, and update Google Business Profile and ads that point at the old homepage.

Old URLs with no direct equivalent (`/shop/page/N`, individual blog posts, `/web/login`…) are redirected in `next.config.ts`.

## Project structure

```
src/
  proxy.ts                    locale routing (/ar), legal subdomain mapping
  app/
    actions.ts                server actions: order requests and enquiries (validation, honeypot)
    [lang]/page.tsx           Awraquna Group homepage (two division circles)
    [lang]/(plus)/…           Awraquna Plus: /plus, /shop, /shop/category/[slug], /shop/[slug], /shop/cart, …
    [lang]/legal/…            Awraquna Legal Services
  components/{group,plus,legal,shared}/
  content/{plus,legal}.ts     all page copy, English and Arabic
  data/catalog.json           sample catalogue (used when COMMERCE_SOURCE=sample)
  lib/
    commerce/                 provider interface + sample and Odoo implementations
    i18n.ts, links.ts, site.ts
public/
  brand/ images/ products/ previews/   (previews = screenshots shown inside the gateway circles)
```

**Editing copy:** all wording lives in `src/content/plus.ts` and `src/content/legal.ts`, with English and Arabic side by side.

**Homepage hero scene:** `public/images/group/hero-scene.jpg` is the photo; `hero-fg.webp` is a cut-out of the steps, book stack and scales from the same photo, layered above the circles so they sit *behind* those objects. Circle positions are in the photo's own coordinates (`DivisionCircles.module.css`). If the photo changes, the cut-out and positions must be redone together.

**Circle previews:** the circles show screenshots of `/plus` and `/legal` in the visitor's language (`public/previews/`). After any design change run `python scripts/capture-previews.py http://localhost:3000` with the dev server running; it regenerates every preview and `src/data/previews.json`.

**Motion:** add `data-reveal`, `data-stagger` or `data-parallax` attributes in markup; `src/components/shared/Motion.tsx` handles the rest (see the comment there).

**Categories and industries** are filters on `/shop` (`?category=` / `?industry=`); the old `/shop/category/...` URLs redirect there.

## Open items for the client

Search the code for `TODO(client)`. Main items:

- **Legal Services contact details:** email, phone, WhatsApp, office addresses, licence information.
- **Payment methods** offered today (shown as a preference on the quotation form).
- **Arabic copy review:** all Arabic was drafted for launch and should be reviewed by a native copywriter. Product names in Arabic are generated from type and size.
- **Legal articles** are marked `draft` and need review by counsel before publishing.
- **Privacy policy and terms** are placeholders for counsel.
- **Catalogue data issues** found while importing:
  - SKU **R60300PW** is used by two different products (wax ribbon 60×300 and wax/resin ribbon 60×300 "out").
  - SKU **TR807070** is used by both cashier roll 80×70 and the "Plus" variant.
  - 12 products have no *Type* in their description.
- **Group logo:** `public/brand/group-logo-*.png` is a placeholder lockup (the supplied logo with "Group" in place of "Legal Services"). Replace it with official artwork.
- **Homepage stats:** "Trusted by businesses", "Nationwide coverage", "Premium quality" and "15+ years" need client sign-off.
- **Photography:** the homepage hero and "One vision" images (`public/images/group/`) were AI-generated to match the mockup. The Legal Services photos (`public/images/legal/`) were regenerated at high resolution from the mockup images, with no text or logos; replace them with commissioned photography if preferred.
- **Fonts:** the brand's Acumin needs an Adobe Fonts web licence. Libre Franklin is used as a stand-in.
