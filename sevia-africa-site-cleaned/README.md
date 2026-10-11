# Sevia Africa Website — Deployment & Maintenance Guide

This website is a static site. Upload the project files to your chosen hosting
provider (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or normal web hosting)
while preserving the folder structure exactly as it is. To preview locally, open
`index.html` in a browser.

## Files

| Path | Contents |
|---|---|
| `index.html` | Page content |
| `thank-you.html` | Post-donation thank-you page |
| `css/styles.css` | All styling |
| `js/script.js` | All behaviour (navigation, forms, map, donate, GitHub feed) |
| `assets/` | Images, favicon, and the Donor Privacy Policy PDF |

## Site configuration

All editable settings live in one block, `SITE_CONFIG`, at the top of `js/script.js`.
It covers:

- Form submission endpoint
- Fallback contact email
- GitHub transparency account
- Lightning donation configuration
- Bitcoin donation configuration
- Payment provider (Gyvar) configuration

See the inline comments next to each setting in that file for what each one does
and how to turn it on.

## Donation infrastructure

- **Lightning** — configured via `SITE_CONFIG.lightningAddress`. When set, the
  Donate page shows a live QR code and tap-to-pay link.
- **On-chain Bitcoin** — configured via `SITE_CONFIG.bitcoinAddress`. Currently
  left blank ("Coming soon") pending a privacy-friendly way to rotate the address
  automatically; see the private maintainer notes for the full reasoning.
- **Address rotation** — an automated rotation approach was explored but is not
  currently active. See the private maintainer notes for what was tried and why.
- **Required GitHub repository secrets** — none currently in use.
- **Payment provider (Gyvar)** — configured via `SITE_CONFIG.gyvarLink`. See the
  private maintainer notes for how the link itself is set up.

## Security

- API credentials must never be placed in client-side code (`js/script.js`, or
  any other file in this repository).
- Secrets must remain in the hosting provider's or GitHub's own secret store,
  never committed to source control.
- Any API key should be granted only the minimum permissions/scopes it needs.

For exact setup steps, account-specific details, and anything resembling a
credential, see the private maintainer document kept outside this repository —
not this file.
