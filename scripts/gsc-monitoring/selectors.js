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
    // Look for text like "3 indexed pages" in the Indexing section
    const element = page.getByText(/\d+ indexed pages?/i);
    const text = await element.textContent({ timeout: 5000 });
    const match = text?.match(/(\d+)\s+indexed/i);
    return match ? parseInt(match[1], 10) : null;
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
    // Look for text like "4 not indexed pages" in the Indexing section
    const element = page.getByText(/\d+ not indexed pages?/i);
    const text = await element.textContent({ timeout: 5000 });
    const match = text?.match(/(\d+)\s+not indexed/i);
    return match ? parseInt(match[1], 10) : null;
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
    // Look for text containing "Last update:" anywhere on the page
    const bodyText = await page.textContent('body', { timeout: 5000 });
    const match = bodyText?.match(/Last update:\s*([\d/]+)/i);
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
    // Table structure: Reason | Source | Validation | Trend | Pages
    // We want first column (reason) and last column (pages count)
    const rows = await page.locator('table tbody tr').all();
    const reasons = [];

    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 5) {
        const reason = await cells[0].textContent();
        const countText = await cells[4].textContent(); // Pages column is last (index 4)
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
