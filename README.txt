VANSCHALKWYK LEDGER — private household spend tracker
=====================================================
Personal use. No accounts in the app, no analytics, no adverts.

THESE FILES ARE THE APP. Upload all of them to your GitHub repository
(index.html, manifest.json, sw.js and the three icon PNGs), switch on
GitHub Pages, and the resulting link is your app.

Do NOT upload Code.gs here — that one is pasted into Google Apps Script.

Full instructions, including the shared-sync setup and the iPhone
home-screen step, are in SETUP-GUIDE.md.

WHERE THE DATA LIVES
  Amounts, categories, item lines and fuel data  -> your Google Sheet + each phone
  Slip photos                                    -> only the phone that took them
  Nothing at all                                 -> GitHub (it only serves the code)

UPDATING THE APP LATER
  Replace index.html in the repo and bump the CACHE version in sw.js
  (vanschalkwyk-ledger-v1 -> v2) so the phones pick up the new copy.
