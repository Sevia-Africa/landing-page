SEVIA AFRICA WEBSITE
====================

HOW TO PUBLISH
Upload everything in this folder to any static host (Netlify, Vercel, Cloudflare Pages,
GitHub Pages, or normal web hosting). Keep the folder structure exactly as it is.
To preview on your computer, open index.html in a browser.

FILES
  index.html        the page content
  css/styles.css    all styling
  js/script.js      all behaviour (navigation, forms, map, donate, GitHub feed)
  assets/           images, favicon and the Donor Privacy Policy PDF

SETTINGS  (top of js/script.js, block called SITE_CONFIG)
  formEndpoint       paste your form-service URL (e.g. https://formspree.io/f/xxxxxxxx) so the
                     Contribute, Partnership, Funding and Contact forms are delivered to you.
                     While empty, forms open the visitor's email app with the message ready to send.
  formFallbackEmail  where that email goes
  githubUser         GitHub account listed on the Transparency page
  geyserUrl          paste the Geyser project link to switch the Geyser donate option on
  gyvarEnabled       set to true once startGyvarPayment() (same file) is connected to Gyvar

Until geyserUrl / gyvarEnabled are set, each donate option shows "Coming soon" and does nothing.
