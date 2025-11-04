# Save.day Bookmark Exporter

Export all your Save.day bookmarks as a single JSON file. Minimal, privacy-focused browser extension that fetches all your Save.day saved items (with pagination) and exports them with metadata.

## What's included

- Extension source (manifest, popup UI, background placeholder)
- Export logic that iterates through pages of bookmarks
- Anchor-based download fallback (no extra permissions required)
- ESLint and Prettier configs plus a CI workflow for lint/format checks

## Quickstart (Developer)

1. Clone the repository:

```bash
git clone https://github.com/vishalxtyagi/save-day-exporter.git
cd save-day-exporter
```

2. Install dev dependencies (optional, for lint/format):

```bash
npm install
```

3. Load in Firefox (temporary) or Chrome (developer mode):

- Firefox: go to `about:debugging` → "This Firefox" → "Load Temporary Add-on" → select `manifest.json`.
- Chrome/Chromium: go to `chrome://extensions/` → enable "Developer mode" → "Load unpacked" → select the project folder.

4. Open `https://app.save.day`, log in, then open the extension popup and click "Export All Bookmarks".

## Commands

- npm run lint — run ESLint
- npm run format — format code with Prettier
- npm run check-format — verify Prettier formatting
- npm run package — create a zip (requires `zip` on PATH)

## Publishing to GitHub

1. Add your repository URL and author in `package.json` and update `manifest.json` homepage/author fields.
2. Push the repo to GitHub and create a release. Attach the packaged zip if you like (created with `npm run package`).
3. If publishing to Mozilla Add-ons or Chrome Web Store, review their policies and follow their packaging/signing steps.

## Contributing

PRs are welcome. Keep changes small and include a brief description. The CI checks lint/format on PRs.

## Security & Privacy

- This extension reads cookies for `app.save.day` (to obtain the token) and uses the site API to fetch bookmarks only. No data is sent to third-party servers.
- The exported JSON is generated locally in the browser and downloaded to the user's machine.

## License

MIT — see `LICENSE`.
