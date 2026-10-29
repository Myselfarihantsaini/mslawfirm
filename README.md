# MS Advocates & Solicitors

An editorial, high-performance website for **MS Advocates & Solicitors** (Adv. Bhavesh Saini), Hisar, Haryana. Built in compliance with Bar Council of India (BCI) Rule 36 regulations on legal publicity and informational transparency.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.
3. Test enquiry endpoint validation:
   ```bash
   npm test
   ```
4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Architecture & SEO Features

* **Technical SEO & Crawlability**:
  * Dynamic `app/robots.js` generating standard-compliant `robots.txt` with sitemap directives.
  * Dynamic `app/sitemap.js` auto-indexing all static pages, 8 practice areas, and knowledge articles.
  * Open Graph and Twitter Card tags configured in `app/layout.js`.
  * `generateStaticParams` in `app/[page]/page.js` prerendering all 22 static pages (`● SSG`) for fast indexation and core web vitals.
* **Schema.org Structured Data**:
  * Injected JSON-LD for `LegalService` & `Attorney` (local Hisar geo-coordinates, address, bar affiliation, opening hours).
  * Dynamic `Article` schema for each Knowledge Centre guide.
* **BCI Rule 36 Compliance**:
  * Mandatory visitor disclaimer modal (`app/welcome.js`) preventing solicitation claims.
  * Dedicated statutory disclaimer and privacy notice routes.
  * Educational focus on statutory frameworks (CPC, BNS, BNSS, BSA, HMA, CPA 2019) rather than promotional touting.
* **Content Management**:
  * Edit `app/content.js` to modify chambers details, advocate biography, practice areas, or educational articles.
* **Contact & Enquiry Delivery**:
  * Configured via `ENQUIRY_WEBHOOK_URL` and `ENQUIRY_WEBHOOK_TOKEN` in `.env.local`.
  * Origin validation, anti-spam honeypot, character bounds, and timeout handling.
