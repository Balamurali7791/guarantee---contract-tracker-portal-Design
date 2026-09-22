<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Guarantee & Contract Tracker Portal

Vite + React portal for managing bank guarantees, contract data, validity dates, issuing banks, and physical custody tracking. Records are stored in the browser's local storage, so this project can run as a static GitHub Pages site without a backend.

## Run Locally

**Prerequisites:** Node.js

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The app is available at `http://localhost:3000`.

## Deploy to GitHub Pages

Push to the `main` branch. The workflow in `.github/workflows/deploy-pages.yml` builds the app and deploys the `dist` folder to GitHub Pages.

In the repository on GitHub, open **Settings > Pages** and set **Source** to **GitHub Actions**. After the workflow completes, the site is available at:

`https://Balamurali7791.github.io/guarantee---contract-tracker-portal-Design/`

The GitHub Actions build sets the repository base path automatically. Local development uses `/` so Vite assets resolve correctly from `localhost`.
