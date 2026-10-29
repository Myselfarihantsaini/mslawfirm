# Editorial redesign handoff

Modified: app/layout.js, page.js, sections.js (new shared sections), globals.css, content.js, [page]/page.js, contact/page.js, contact/form.js, api/enquiry/route.js, robots.js, sitemap.js. Added public/architecture.jpg. Existing routes retained; privacy, disclaimer and strategist redirect to their new equivalents. Existing article URLs display draft notices. Original source backup: backups/before-editorial-redesign.tar.gz.

Design: ivory editorial hero, locally hosted architectural image, serif headings, slim gold dividers, row-based practices, framed genuine portrait, compact navigation, structured footer. Native Georgia/Arial fallbacks avoid external font downloads.

Before publication, Adv. Bhavesh Saini must approve the supplied biography and qualifications, each practice area (including CAT expansion), contact details from the supplied card, privacy retention/contact/provider disclosures, visitor acknowledgement and all content against applicable professional rules. No compliance certification is implied. Address, hours, production domain and approved articles remain missing. Existing unverified affiliations and location claims were removed. Logo remains the supplied opaque PNG; transparent-background editing was interrupted earlier.

Enquiries remain disabled until ENQUIRY_WEBHOOK_URL and ENQUIRY_DELIVERY_APPROVED=true are explicitly configured for an approved HTTPS service. Configure deployment-level rate limits, confirm retention/access controls, and verify actual delivery before launch. Honeypot, same-origin checks, input validation and busy state provide basic protection. Delivery has not been tested against an external service. Search indexing is disabled pending review; configure domain and indexing only at launch.

Article drafts remain in content.js as draftArticles. To publish, add reviewed content with title, author, published/reviewed dates, category, references and general-information disclaimer to articles and implement its reviewed article rendering. Draft legal assertions are intentionally not served.
