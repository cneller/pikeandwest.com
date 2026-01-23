# GSC Monitoring Script Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a Playwright-based script to extract Google Search Console Coverage Report metrics (indexed/not-indexed counts, reasons) that aren't available via API.

**Architecture:** ESM Node script using Playwright to navigate to GSC, extract metrics via role-based selectors, and output to JSONL for trend tracking. Auth state persists in `.auth/` directory with 24-hour expiration checking. Follows existing `compare-styles.js` patterns.

**Tech Stack:** Node.js (ESM), Playwright, YAML config, JSONL output

---

## Task 1: Create Directory Structure and Configuration

**Files:**

- Create: `scripts/gsc-monitoring/config.yaml`
- Create: `scripts/gsc-monitoring/config.example.yaml`
- Modify: `.gitignore` (add auth/reports directories)

**Step 1: Create the gsc-monitoring directory**

```bash
mkdir -p scripts/gsc-monitoring
```

**Step 2: Create config.example.yaml with template configuration**

Create `scripts/gsc-monitoring/config.example.yaml`:

```yaml
# GSC Monitoring Configuration
# Copy to config.yaml and customize

# Google Search Console property
property:
  # Resource ID from GSC URL (after resource_id=)
  resource_id: "sc-domain:example.com"
  # Human-readable name for reports
  name: "Example Site"

# Output settings
output:
  # JSONL file for trend tracking (appends each run)
  trends_file: "reports/trends.jsonl"
  # Latest snapshot (overwrites each run)
  latest_file: "reports/latest.json"

# Auth settings
auth:
  # Storage state file location
  state_file: ".auth/gsc-state.json"
  # Session expiry in hours (Google sessions ~24h)
  expiry_hours: 20

# Browser settings
browser:
  # Run headless (false for auth setup)
  headless: true
  # Viewport dimensions
  viewport:
    width: 1440
    height: 900
```

**Step 3: Create the actual config.yaml for pikeandwest.com**

Create `scripts/gsc-monitoring/config.yaml`:

```yaml
# GSC Monitoring Configuration for Pike & West

property:
  resource_id: "sc-domain:pikeandwest.com"
  name: "Pike & West"

output:
  trends_file: "reports/trends.jsonl"
  latest_file: "reports/latest.json"

auth:
  state_file: ".auth/gsc-state.json"
  expiry_hours: 20

browser:
  headless: true
  viewport:
    width: 1440
    height: 900
```

**Step 4: Update .gitignore with auth and reports directories**

Add to `.gitignore`:

```gitignore
# GSC Monitoring
scripts/gsc-monitoring/.auth/
scripts/gsc-monitoring/reports/
```

**Step 5: Create placeholder directories**

```bash
mkdir -p scripts/gsc-monitoring/.auth
mkdir -p scripts/gsc-monitoring/reports
touch scripts/gsc-monitoring/.auth/.gitkeep
touch scripts/gsc-monitoring/reports/.gitkeep
```

**Step 6: Commit the configuration setup**

```bash
git add scripts/gsc-monitoring/config.yaml scripts/gsc-monitoring/config.example.yaml .gitignore scripts/gsc-monitoring/.auth/.gitkeep scripts/gsc-monitoring/reports/.gitkeep
git commit -m "chore: add GSC monitoring script configuration"
```

---

## Task 2: Implement Auth State Management Module

**Files:**

- Create: `scripts/gsc-monitoring/auth.js`

**Step 1: Create auth.js with storage state management**

Create `scripts/gsc-monitoring/auth.js`:

```javascript
/**
 * Auth State Management for GSC Monitoring
 *
 * Handles saving/loading Playwright storage state with expiration checking.
 * Google sessions typically expire after ~24 hours.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

/**
 * Check if auth state file exists and is not expired
 * @param {string} stateFile - Path to state file
 * @param {number} expiryHours - Hours until expiration
 * @returns {{ valid: boolean, reason?: string }}
 */
export function checkAuthState(stateFile, expiryHours) {
  if (!existsSync(stateFile)) {
    return { valid: false, reason: 'State file does not exist' };
  }

  try {
    const stats = JSON.parse(readFileSync(stateFile, 'utf8'));

    // Check for metadata we add
    if (!stats._metadata?.savedAt) {
      return { valid: false, reason: 'State file missing metadata' };
    }

    const savedAt = new Date(stats._metadata.savedAt);
    const expiresAt = new Date(savedAt.getTime() + expiryHours * 60 * 60 * 1000);
    const now = new Date();

    if (now > expiresAt) {
      return {
        valid: false,
        reason: `State expired at ${expiresAt.toISOString()}`,
      };
    }

    const hoursRemaining = Math.round((expiresAt - now) / (60 * 60 * 1000));
    return {
      valid: true,
      reason: `State valid for ~${hoursRemaining} more hours`,
    };
  } catch (e) {
    return { valid: false, reason: `Error reading state: ${e.message}` };
  }
}

/**
 * Save storage state with metadata
 * @param {import('playwright').BrowserContext} context - Playwright context
 * @param {string} stateFile - Path to save state
 */
export async function saveAuthState(context, stateFile) {
  // Ensure directory exists
  const dir = dirname(stateFile);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Get storage state
  const state = await context.storageState();

  // Add metadata for expiration tracking
  state._metadata = {
    savedAt: new Date().toISOString(),
    version: 1,
  };

  writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

/**
 * Load storage state if valid
 * @param {string} stateFile - Path to state file
 * @param {number} expiryHours - Hours until expiration
 * @returns {object|null} - Storage state or null if invalid
 */
export function loadAuthState(stateFile, expiryHours) {
  const check = checkAuthState(stateFile, expiryHours);

  if (!check.valid) {
    return null;
  }

  const state = JSON.parse(readFileSync(stateFile, 'utf8'));

  // Remove our metadata before returning (Playwright doesn't expect it)
  delete state._metadata;

  return state;
}
```

**Step 2: Commit the auth module**

```bash
git add scripts/gsc-monitoring/auth.js
git commit -m "feat(gsc): add auth state management module"
```

---

## Task 3: Implement Selectors Module

**Files:**

- Create: `scripts/gsc-monitoring/selectors.js`

**Step 1: Create selectors.js with stable role-based selectors**

Based on the dry run from the notes, GSC uses these patterns. Create `scripts/gsc-monitoring/selectors.js`:

```javascript
/**
 * GSC Selectors Module
 *
 * Stable, role-based selectors for Google Search Console.
 * Avoids ref= values which change on each page load.
 *
 * These selectors were verified via Playwright MCP dry run on 2026-01-22.
 */

/**
 * URL patterns for GSC
 */
export const urls = {
  /**
   * GSC Overview page (entry point)
   * @param {string} resourceId - e.g., "sc-domain:pikeandwest.com"
   */
  overview: (resourceId) =>
    `https://search.google.com/search-console?resource_id=${encodeURIComponent(resourceId)}`,

  /**
   * Page Indexing Report (full details)
   * @param {string} resourceId - e.g., "sc-domain:pikeandwest.com"
   */
  indexingReport: (resourceId) =>
    `https://search.google.com/search-console/index?resource_id=${encodeURIComponent(resourceId)}`,

  /**
   * Login page (for detecting auth required)
   */
  login: 'https://accounts.google.com/',
};

/**
 * Extract indexed count from Overview page
 * @param {import('playwright').Page} page
 * @returns {Promise<number|null>}
 */
export async function getIndexedCount(page) {
  try {
    // Button with "Indexed" in name, find the count in child generic element
    const button = page.getByRole('button', { name: /Indexed/i });
    const countElement = button.locator('div').filter({ hasText: /^\d+$/ }).first();
    const text = await countElement.textContent({ timeout: 5000 });
    return text ? parseInt(text.trim(), 10) : null;
  } catch {
    return null;
  }
}

/**
 * Extract not-indexed count from Overview page
 * @param {import('playwright').Page} page
 * @returns {Promise<number|null>}
 */
export async function getNotIndexedCount(page) {
  try {
    // Button with "Not indexed" in name
    const button = page.getByRole('button', { name: /Not indexed/i });
    const countElement = button.locator('div').filter({ hasText: /^\d+$/ }).first();
    const text = await countElement.textContent({ timeout: 5000 });
    return text ? parseInt(text.trim(), 10) : null;
  } catch {
    return null;
  }
}

/**
 * Extract last update date from page
 * @param {import('playwright').Page} page
 * @returns {Promise<string|null>}
 */
export async function getLastUpdate(page) {
  try {
    const element = page.getByText(/Last update:/i);
    const text = await element.textContent({ timeout: 5000 });
    // Extract date from "Last update: 1/19/26"
    const match = text?.match(/Last update:\s*(.+)/i);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

/**
 * Extract indexing reasons table from Page Indexing Report
 * @param {import('playwright').Page} page
 * @returns {Promise<Array<{reason: string, count: number}>>}
 */
export async function getIndexingReasons(page) {
  try {
    // The reasons are in table rows with reason name and count
    const rows = await page.locator('table tbody tr').all();
    const reasons = [];

    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 2) {
        const reason = await cells[0].textContent();
        const countText = await cells[1].textContent();
        if (reason && countText) {
          const count = parseInt(countText.replace(/,/g, '').trim(), 10);
          if (!isNaN(count)) {
            reasons.push({
              reason: reason.trim(),
              count,
            });
          }
        }
      }
    }

    return reasons;
  } catch {
    return [];
  }
}

/**
 * Check if we're on a login page (auth required)
 * @param {import('playwright').Page} page
 * @returns {boolean}
 */
export function isLoginPage(page) {
  const url = page.url();
  return url.includes('accounts.google.com') || url.includes('/signin');
}
```

**Step 2: Commit the selectors module**

```bash
git add scripts/gsc-monitoring/selectors.js
git commit -m "feat(gsc): add stable role-based selectors module"
```

---

## Task 4: Implement Main Monitor Script

**Files:**

- Create: `scripts/gsc-monitoring/monitor.js`

**Step 1: Create monitor.js main script**

Create `scripts/gsc-monitoring/monitor.js`:

```javascript
/**
 * GSC Monitoring Script
 *
 * Extracts Google Search Console Coverage Report metrics using Playwright.
 * Outputs to JSONL for trend tracking.
 *
 * Usage:
 *   node scripts/gsc-monitoring/monitor.js [--auth]
 *
 * Options:
 *   --auth    Force re-authentication (opens headed browser for manual login)
 *
 * Prerequisites:
 *   - Valid config.yaml in script directory
 *   - First run requires --auth flag to authenticate
 */

import { chromium } from 'playwright';
import { readFileSync, appendFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { parse } from 'yaml';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { checkAuthState, saveAuthState, loadAuthState } from './auth.js';
import {
  urls,
  getIndexedCount,
  getNotIndexedCount,
  getLastUpdate,
  getIndexingReasons,
  isLoginPage,
} from './selectors.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load configuration
const configPath = join(__dirname, 'config.yaml');
if (!existsSync(configPath)) {
  console.error('Error: config.yaml not found');
  console.error('Copy config.example.yaml to config.yaml and customize');
  process.exit(1);
}
const config = parse(readFileSync(configPath, 'utf8'));

// Parse CLI arguments
const args = process.argv.slice(2);
const forceAuth = args.includes('--auth');

/**
 * Ensure output directories exist
 */
function ensureOutputDirs() {
  const trendsDir = dirname(join(__dirname, config.output.trends_file));
  const latestDir = dirname(join(__dirname, config.output.latest_file));
  const authDir = dirname(join(__dirname, config.auth.state_file));

  for (const dir of [trendsDir, latestDir, authDir]) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * Run authentication flow (manual login in headed browser)
 * @param {object} browserConfig
 * @returns {Promise<object>} Storage state
 */
async function runAuthFlow(browserConfig) {
  console.log('\n🔐 Authentication required');
  console.log('A browser window will open. Please log in to Google.');
  console.log('After logging in, navigate to Search Console and wait.\n');

  const browser = await chromium.launch({
    headless: false, // Must be headed for manual login
  });

  const context = await browser.newContext({
    viewport: browserConfig.viewport,
  });

  const page = await context.newPage();

  // Navigate to GSC - will redirect to login if needed
  await page.goto(urls.overview(config.property.resource_id));

  // Wait for user to complete login and reach GSC
  console.log('Waiting for you to log in...');
  console.log('(The script will continue once GSC loads)\n');

  // Wait until we're on the GSC domain and not on login
  await page.waitForURL(/search\.google\.com\/search-console/, {
    timeout: 300000, // 5 minutes for manual login
  });

  console.log('✓ Login detected, saving session...\n');

  // Save the auth state
  const stateFile = join(__dirname, config.auth.state_file);
  await saveAuthState(context, stateFile);

  await browser.close();

  return loadAuthState(stateFile, config.auth.expiry_hours);
}

/**
 * Extract GSC metrics
 * @param {import('playwright').Page} page
 * @returns {Promise<object>}
 */
async function extractMetrics(page) {
  const metrics = {
    timestamp: new Date().toISOString(),
    property: config.property.resource_id,
    propertyName: config.property.name,
    lastUpdate: null,
    indexed: null,
    notIndexed: null,
    reasons: [],
    errors: [],
  };

  // Navigate to overview page
  console.log('Navigating to GSC Overview...');
  await page.goto(urls.overview(config.property.resource_id), {
    waitUntil: 'networkidle',
  });

  // Check if we ended up on login page
  if (isLoginPage(page)) {
    metrics.errors.push('Session expired - re-authentication required');
    return metrics;
  }

  // Extract overview metrics
  console.log('Extracting metrics...');

  metrics.indexed = await getIndexedCount(page);
  metrics.notIndexed = await getNotIndexedCount(page);
  metrics.lastUpdate = await getLastUpdate(page);

  // Navigate to full report for reasons breakdown
  console.log('Navigating to Page Indexing Report...');
  await page.goto(urls.indexingReport(config.property.resource_id), {
    waitUntil: 'networkidle',
  });

  if (!isLoginPage(page)) {
    metrics.reasons = await getIndexingReasons(page);
  }

  return metrics;
}

/**
 * Save metrics to output files
 * @param {object} metrics
 */
function saveMetrics(metrics) {
  const trendsPath = join(__dirname, config.output.trends_file);
  const latestPath = join(__dirname, config.output.latest_file);

  // Append to JSONL trends file
  appendFileSync(trendsPath, JSON.stringify(metrics) + '\n');
  console.log(`✓ Appended to ${config.output.trends_file}`);

  // Overwrite latest snapshot
  writeFileSync(latestPath, JSON.stringify(metrics, null, 2));
  console.log(`✓ Updated ${config.output.latest_file}`);
}

/**
 * Print metrics summary to console
 * @param {object} metrics
 */
function printSummary(metrics) {
  console.log('\n' + '='.repeat(50));
  console.log('GSC MONITORING REPORT');
  console.log('='.repeat(50));
  console.log(`Property: ${metrics.propertyName} (${metrics.property})`);
  console.log(`Timestamp: ${metrics.timestamp}`);
  console.log(`Last GSC Update: ${metrics.lastUpdate || 'Unknown'}`);
  console.log('');
  console.log(`Indexed Pages: ${metrics.indexed ?? 'Error'}`);
  console.log(`Not Indexed: ${metrics.notIndexed ?? 'Error'}`);

  if (metrics.reasons.length > 0) {
    console.log('\nNot Indexed Breakdown:');
    for (const r of metrics.reasons) {
      console.log(`  - ${r.reason}: ${r.count}`);
    }
  }

  if (metrics.errors.length > 0) {
    console.log('\nErrors:');
    for (const e of metrics.errors) {
      console.log(`  ⚠ ${e}`);
    }
  }

  console.log('='.repeat(50) + '\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('GSC Monitoring Script');
  console.log('=====================\n');

  ensureOutputDirs();

  const stateFile = join(__dirname, config.auth.state_file);
  let storageState = null;

  // Check auth state
  if (!forceAuth) {
    const authCheck = checkAuthState(stateFile, config.auth.expiry_hours);
    console.log(`Auth state: ${authCheck.reason}`);

    if (authCheck.valid) {
      storageState = loadAuthState(stateFile, config.auth.expiry_hours);
    }
  }

  // Run auth flow if needed
  if (!storageState || forceAuth) {
    storageState = await runAuthFlow(config.browser);
    if (!storageState) {
      console.error('Failed to authenticate');
      process.exit(1);
    }
  }

  // Launch browser with saved state
  const browser = await chromium.launch({
    headless: config.browser.headless,
  });

  const context = await browser.newContext({
    viewport: config.browser.viewport,
    storageState,
  });

  const page = await context.newPage();

  try {
    const metrics = await extractMetrics(page);

    // Check for session expiry during extraction
    if (metrics.errors.some((e) => e.includes('re-authentication'))) {
      console.log('\nSession expired during extraction.');
      console.log('Run with --auth flag to re-authenticate.\n');
      process.exit(1);
    }

    saveMetrics(metrics);
    printSummary(metrics);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
```

**Step 2: Commit the main monitor script**

```bash
git add scripts/gsc-monitoring/monitor.js
git commit -m "feat(gsc): add main monitoring script"
```

---

## Task 5: Add npm Script and Documentation

**Files:**

- Modify: `package.json`
- Create: `scripts/gsc-monitoring/README.md`

**Step 1: Add npm script to package.json**

Add to the `scripts` section in `package.json`:

```json
"gsc:monitor": "node scripts/gsc-monitoring/monitor.js",
"gsc:auth": "node scripts/gsc-monitoring/monitor.js --auth"
```

The scripts section should look like:

```json
"scripts": {
  "test": "echo 'No tests configured'",
  "build": "hugo --gc --minify",
  "serve": "hugo server -D",
  "serve:webflow": "npx serve webflow-export -p 8080",
  "compare:styles": "node scripts/style-comparison/compare-styles.js",
  "backstop:reference": "backstop reference --configPath=backstop.json",
  "backstop:test": "backstop test --configPath=backstop.json",
  "backstop:approve": "backstop approve --configPath=backstop.json",
  "backstop:report": "backstop openReport --configPath=backstop.json",
  "gsc:monitor": "node scripts/gsc-monitoring/monitor.js",
  "gsc:auth": "node scripts/gsc-monitoring/monitor.js --auth"
}
```

**Step 2: Create README.md for the script**

Create `scripts/gsc-monitoring/README.md`:

````markdown
# GSC Monitoring Script

Playwright-based script to extract Google Search Console Coverage Report metrics that aren't available via the API.

## Metrics Extracted

- **Indexed count** - Total pages indexed by Google
- **Not indexed count** - Pages not indexed
- **Indexing reasons** - Breakdown of why pages aren't indexed
- **Last update date** - When GSC last updated the data

## Usage

### First Run (Authentication)

The first run requires manual authentication:

```bash
npm run gsc:auth
````

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
  "timestamp": "2026-01-22T10:30:00Z",
  "property": "sc-domain:pikeandwest.com",
  "propertyName": "Pike & West",
  "lastUpdate": "1/19/26",
  "indexed": 3,
  "notIndexed": 4,
  "reasons": [
    { "reason": "Page with redirect", "count": 4 }
  ],
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

````text

**Step 3: Commit the npm scripts and documentation**

```bash
git add package.json scripts/gsc-monitoring/README.md
git commit -m "docs(gsc): add npm scripts and README"
````

---

## Task 6: Test the Implementation

**Files:**

- None (verification only)

**Step 1: Verify script loads without errors**

```bash
node --check scripts/gsc-monitoring/monitor.js
node --check scripts/gsc-monitoring/auth.js
node --check scripts/gsc-monitoring/selectors.js
```

Expected: No output (no syntax errors)

**Step 2: Run the auth flow to establish session**

```bash
npm run gsc:auth
```

Expected:

- Browser opens
- After manual login, session saves
- Script exits successfully

**Step 3: Run the monitor with saved session**

```bash
npm run gsc:monitor
```

Expected:

- Runs headless
- Outputs metrics to console
- Creates `reports/trends.jsonl` and `reports/latest.json`

**Step 4: Verify output files**

```bash
cat scripts/gsc-monitoring/reports/latest.json
```

Expected: Valid JSON with indexed/notIndexed counts

**Step 5: Final commit with any fixes**

If tests revealed issues, fix and commit:

```bash
git add -A
git commit -m "fix(gsc): address issues found during testing"
```

---

## Summary

| Task | Description                    | Files                                              |
|------|--------------------------------|----------------------------------------------------|
| 1    | Directory structure and config | `config.yaml`, `config.example.yaml`, `.gitignore` |
| 2    | Auth state management          | `auth.js`                                          |
| 3    | Stable selectors               | `selectors.js`                                     |
| 4    | Main monitor script            | `monitor.js`                                       |
| 5    | npm scripts and docs           | `package.json`, `README.md`                        |
| 6    | Testing and verification       | (no new files)                                     |

**Total estimated commits:** 6

**Key patterns followed:**

- ESM imports (project standard)
- YAML configuration (matches `compare-styles.js`)
- JSON/JSONL output (matches project patterns)
- Role-based selectors (per notes research)
- Auth state with expiration checking (per notes architecture)
