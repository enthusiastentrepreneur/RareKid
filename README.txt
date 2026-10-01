RARE KID WEBSITE - GO-LIVE CHECKLIST

1) FIND & REPLACE in all files (VS Code: Ctrl+Shift+H, or GitHub's editor):
   YOUR-DOMAIN              -> your site address without https:// or a trailing slash
                               e.g. rarekid.ie  (38 places)
   thefew@rarekid.store   -> your contact email (privacy.html, terms.html)
   YOUR FULL NAME           -> your legal name (privacy.html, terms.html)
   YOUR POSTAL ADDRESS, IRELAND -> a postal address in Ireland (terms.html, required by law)

2) UPLOAD everything in this folder (keep the folders) to your GitHub repository.
   Settings > Pages > Deploy from branch > main / (root).
   Use a custom domain or a <username>.github.io repository so the site sits at the
   root of the address (the 404 page and sitemap expect that).

3) TEST THE FORM ON THE LIVE SITE
   The sign-up forms send to Formspree form xgavbbvg.
   Submit one test sign-up, then check your inbox and the Formspree dashboard.
   In Formspree: Settings > Restrict to domain (add your domain) to block spam.
   Free plan: about 50 sign-ups a month.

4) TEST AN ORDER: add a tee, fill in the checkout, and check WhatsApp opens
   with the order to +353 89 972 1947.

5) GOOGLE: add the site in Google Search Console and submit
   https://YOUR-DOMAIN/sitemap.xml

EDIT LATER
- Price, WhatsApp number, tee measurements: top of js/shop.js
- Adding analytics or ad pixels: only inside RareKidConsent.onAllow(...) in js/consent.js,
  and list them in the cookie table in privacy.html
- New blog post: copy the existing post file, change title, description, canonical,
  headings and text; add a card in blog/index.html and an entry in sitemap.xml

CREDITS
- Fonts: Barlow & Barlow Condensed (SIL Open Font License, fonts/OFL-LICENSE.txt)
- Icons in images/icons: Font Awesome Free (CC BY 4.0)
