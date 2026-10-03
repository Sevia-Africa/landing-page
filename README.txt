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
  lightningAddress   paste a Lightning address (e.g. you@walletofsatoshi.com) to switch on the
                     Lightning QR code / tap-to-pay link on the Donate page
  bitcoinAddress     paste an on-chain BTC receive address to switch on the Bitcoin QR code /
                     tap-to-pay link on the Donate page
  gyvarEnabled       set to true once startGyvarPayment() (same file) is connected to Gyvar

Until lightningAddress / bitcoinAddress / gyvarEnabled are set, each donate option shows
"Coming soon" and does nothing. The Donate page loads a small third-party QR code library
from cdnjs.cloudflare.com to draw the Lightning/Bitcoin QR codes.

ROTATING THE ON-CHAIN BITCOIN ADDRESS (optional, recommended for privacy)
---------------------------------------------------------------------
.github/workflows/rotate-btc-address.yml is a scheduled GitHub Action that pulls a
brand-new on-chain address from the Sevia Blink account once a day and commits it
into js/script.js automatically — no backend to run. To turn it on:

  1. In Blink, on the Sevia Africa account (seviaafrica@blink.sv), go to
     dashboard.blink.sv -> API Keys -> Create API Key. Select ONLY "Read" and
     "Receive" scopes (never give this key spend/write access).
  2. Using that key, call the API once to find your BTC wallet's id:
       curl -s -X POST https://api.blink.sv/graphql \
         -H "X-API-KEY: blink_your_api_key_here" \
         -H "Content-Type: application/json" \
         -d '{"query":"query me { me { defaultAccount { wallets { id walletCurrency } } } }"}'
     Note the id where walletCurrency is BTC.
  3. In the GitHub repo: Settings -> Secrets and variables -> Actions -> New
     repository secret. Add:
       BLINK_API_KEY   = blink_your_api_key_here
       BLINK_WALLET_ID = the wallet id from step 2
  4. That's it — the workflow runs daily at 03:00 UTC, or trigger it on demand
     from the Actions tab ("Rotate Bitcoin donation address" -> Run workflow).

Never put the Blink API key directly in js/script.js or anywhere in the site's
source — it only ever belongs in the GitHub repo secret, which the workflow
reads at run time and the published site never sees.
