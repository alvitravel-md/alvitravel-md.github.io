# AlviTravel custom-domain migration checklist

Current production URL: https://alvitravel.md/

When a custom domain is purchased, do not change files one-by-one manually. Complete the migration in this order:

1. Add the custom domain in GitHub Pages and create the required DNS records at the domain registrar.
2. Wait until GitHub Pages confirms DNS and HTTPS.
3. Add a CNAME file containing only the final domain.
4. Replace the production origin in canonical URLs, Open Graph URLs, structured data, sitemap.xml, sitemap.txt and robots.txt.
5. Add the new domain as a property in Google Search Console and submit the new sitemap.
6. Update the Website field in Google Business Profile, Instagram and other official profiles.
7. Update Google Analytics web-stream URL if needed; keep the same GA4 measurement ID unless there is a specific reason to create a new property.
8. Keep redirects/old GitHub Pages access working during the transition and verify every important URL.
9. Request re-indexing of the homepage and destination pages after the new domain is live.

Do not create the CNAME file until the exact final domain is known.
