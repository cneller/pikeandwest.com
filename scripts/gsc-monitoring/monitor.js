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
import {
  readFileSync,
  appendFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from 'fs';
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
  console.log('\nAuthentication required');
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

  console.log('Login detected, saving session...\n');

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
  console.log(`Appended to ${config.output.trends_file}`);

  // Overwrite latest snapshot
  writeFileSync(latestPath, JSON.stringify(metrics, null, 2));
  console.log(`Updated ${config.output.latest_file}`);
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
      console.log(`  Warning: ${e}`);
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
