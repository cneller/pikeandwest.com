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
    const countElement = button
      .locator('div')
      .filter({ hasText: /^\d+$/ })
      .first();
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
    const countElement = button
      .locator('div')
      .filter({ hasText: /^\d+$/ })
      .first();
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
