# GSC Monitoring Script

Playwright-based script to extract Google Search Console Coverage Report metrics that aren't available via the API.

## Metrics Extracted

### Indexing

- **Indexed count** - Total pages indexed by Google
- **Not indexed count** - Pages not indexed
- **Indexing reasons** - Breakdown of why pages aren't indexed
- **Last update date** - When GSC last updated the data

### Performance

- **Total clicks** - Web search clicks over 90 days

### Experience

- **Core Web Vitals** - Mobile and Desktop status (Good/Needs improvement/Poor or No data)
- **HTTPS status** - Count of HTTPS vs Non-HTTPS pages

### Security

- **Security Issues** - Any detected security problems
- **Manual Actions** - Any penalties applied by Google

## Usage

### First Run (Authentication)

The first run requires manual authentication:

```bash
npm run gsc:auth
```

This opens a browser window. Log in to Google, then navigate to Search Console. The script automatically saves your session for future runs.

### Regular Monitoring

After authentication:

```bash
npm run gsc:monitor
```

Runs headless and appends results to the trends file.

### Re-authentication

If your session expires (~24 hours):

```bash
npm run gsc:auth
```

## Output Files

| File                   | Purpose                                          |
|------------------------|--------------------------------------------------|
| `reports/trends.jsonl` | Append-only log of all runs (for trend analysis) |
| `reports/latest.json`  | Most recent snapshot (for quick access)          |

## Configuration

Edit `config.yaml` to customize:

- `property.resource_id` - Your GSC property ID
- `auth.expiry_hours` - How long before forcing re-auth (default: 20)
- `browser.headless` - Run without visible browser (default: true)

## Output Format

```json
{
  "timestamp": "2026-01-23T07:27:13.755Z",
  "property": "sc-domain:pikeandwest.com",
  "propertyName": "Pike & West",
  "lastUpdate": "1/19/26",
  "indexed": 3,
  "notIndexed": 4,
  "reasons": [
    { "reason": "Page with redirect", "count": 4 }
  ],
  "totalClicks": 588,
  "coreWebVitals": {
    "mobile": { "status": "No data" },
    "desktop": { "status": "No data" }
  },
  "https": {
    "https": 4,
    "nonHttps": 0
  },
  "security": {
    "hasIssues": false,
    "message": "No issues detected"
  },
  "manualActions": {
    "hasActions": false,
    "message": "No manual actions"
  },
  "errors": []
}
```

## Troubleshooting

### "Session expired" error

Run `npm run gsc:auth` to re-authenticate.

### Selectors not finding elements

Google may have updated their UI. Check the selectors in `selectors.js` and update if needed using Playwright MCP to inspect the current page structure.

### Rate limiting or captcha

Google may flag automated access. Tips:

- Don't run too frequently (once daily is fine)
- Use the same browser profile consistently
- Consider running from a consistent IP
