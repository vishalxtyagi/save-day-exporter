# Save.day Bookmark Exporter

<p align="center">
	<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"/></a>
	<a href="https://github.com/vishalxtyagi/save-day-exporter/actions"><img src="https://github.com/vishalxtyagi/save-day-exporter/actions/workflows/ci.yml/badge.svg" alt="CI"/></a>
	<a href="https://github.com/vishalxtyagi/save-day-exporter/releases"><img src="https://img.shields.io/github/v/release/vishalxtyagi/save-day-exporter" alt="Release"/></a>
	<a href="https://github.com/vishalxtyagi/save-day-exporter/issues"><img src="https://img.shields.io/github/issues/vishalxtyagi/save-day-exporter" alt="Issues"/></a>
	<a href="https://github.com/vishalxtyagi/save-day-exporter/graphs/contributors"><img src="https://img.shields.io/github/contributors/vishalxtyagi/save-day-exporter" alt="Contributors"/></a>
	<a href="https://github.com/vishalxtyagi/save-day-exporter"><img src="https://img.shields.io/github/languages/top/vishalxtyagi/save-day-exporter" alt="Top language"/></a>
</p>

Export all your Save.day bookmarks as a single JSON file. A small, privacy-focused browser extension that fetches your saved items (paginated) and exports them with metadata.

## What's included

- Extension source (manifest, popup UI, background placeholder)
- Export logic with pagination and a robust anchor-download fallback
- Lightweight dev tooling: ESLint, Prettier and a CI workflow

## Quickstart (developer)

### 1) Clone

```bash
git clone https://github.com/vishalxtyagi/save-day-exporter.git
```

### 2) Install (optional, for lint/format)

```bash
cd save-day-exporter
npm install
```

### 3) Load in your browser

- Firefox (temporary):

  ```
  about:debugging → "This Firefox" → "Load Temporary Add-on" → select manifest.json
  ```

- Chrome/Chromium (dev mode):

  ```
  chrome://extensions/ → enable "Developer mode" → "Load unpacked" → select the project folder
  ```

### 4) Try it

1. Open `https://app.save.day` and log in.
2. Open the extension popup and click **Export**.

## Commands

- `npm run lint` — run ESLint
- `npm run format` — format code with Prettier
- `npm run check-format` — verify Prettier formatting
- `npm run package` — create a zip of the extension (requires `zip`)

## Security & privacy

- The extension reads the `app.save.day` cookie to obtain an auth token and then calls the Save.day API to fetch bookmarks. All export logic runs locally in the browser; exported files are downloaded to the user's machine.
