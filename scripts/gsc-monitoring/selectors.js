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

  /**
   * Security & Manual Actions report
   * @param {string} resourceId - e.g., "sc-domain:pikeandwest.com"
   */
  securityActions: (resourceId) =>
    `https://search.google.com/search-console/security-issues?resource_id=${encodeURIComponent(resourceId)}`,

  /**
   * Manual Actions report
   * @param {string} resourceId - e.g., "sc-domain:pikeandwest.com"
   */
  manualActions: (resourceId) =>
    `https://search.google.com/search-console/manual-actions?resource_id=${encodeURIComponent(resourceId)}`,

  /**
   * Sitemaps report
   * @param {string} resourceId - e.g., "sc-domain:pikeandwest.com"
   */
  sitemaps: (resourceId) =>
    `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(resourceId)}`,
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

/**
 * Extract total web search clicks from Overview page
 * @param {import('playwright').Page} page
 * @returns {Promise<number|null>}
 */
export async function getTotalClicks(page) {
  try {
    // Look for text like "588 total web search clicks"
    const bodyText = await page.textContent('body', { timeout: 5000 });
    const match = bodyText?.match(/([\d,]+)\s+total web search clicks/i);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''), 10);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Extract Core Web Vitals status from Overview page
 * @param {import('playwright').Page} page
 * @returns {Promise<{mobile: object, desktop: object}|null>}
 */
export async function getCoreWebVitals(page) {
  try {
    // Find the Experience table and extract CWV row
    const bodyText = await page.textContent('body', { timeout: 5000 });

    // Check if we have CWV data or "No data"
    const hasNoData = /Core Web Vitals.*No data/is.test(bodyText);

    if (hasNoData) {
      return {
        mobile: {
          good: null,
          needsImprovement: null,
          poor: null,
          status: 'No data',
        },
        desktop: {
          good: null,
          needsImprovement: null,
          poor: null,
          status: 'No data',
        },
      };
    }

    // Try to extract actual values if available
    // The table structure shows Good/Needs improvement/Poor columns
    // For now, return status based on presence of data
    return {
      mobile: { status: 'Available' },
      desktop: { status: 'Available' },
    };
  } catch {
    return null;
  }
}

/**
 * Extract HTTPS status from Overview page
 * @param {import('playwright').Page} page
 * @returns {Promise<{https: number, nonHttps: number}|null>}
 */
export async function getHttpsStatus(page) {
  try {
    // Look for HTTPS row in Experience table
    // Table structure: HTTPS | (empty) | count | (empty) | count | trend | Open report
    const rows = await page.locator('table tbody tr').all();

    for (const row of rows) {
      const rowText = await row.textContent();
      // Find the row that starts with "HTTPS" (not header row with "Non HTTPS")
      if (rowText?.match(/^HTTPS\s*\d/)) {
        // Extract all numbers from the row
        const numbers = rowText.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
          return {
            https: parseInt(numbers[0], 10),
            nonHttps: parseInt(numbers[1], 10),
          };
        }
      }
    }

    // Fallback: search body text for pattern like "HTTPS4 0Open report"
    const bodyText = await page.textContent('body', { timeout: 5000 });
    // Look for HTTPS followed by two numbers
    const match = bodyText?.match(/HTTPS\s*(\d+)\s*(\d+)/);
    if (match) {
      return {
        https: parseInt(match[1], 10),
        nonHttps: parseInt(match[2], 10),
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Check Security Issues status
 * @param {import('playwright').Page} page
 * @returns {Promise<{hasIssues: boolean, message: string}>}
 */
export async function getSecurityStatus(page) {
  try {
    const bodyText = await page.textContent('body', { timeout: 5000 });

    // Look for "No issues detected" or similar
    if (/no (security )?issues detected/i.test(bodyText)) {
      return { hasIssues: false, message: 'No issues detected' };
    }

    // Look for issue indicators
    if (/security issues? (detected|found)/i.test(bodyText)) {
      return { hasIssues: true, message: 'Security issues detected' };
    }

    // Default - check page title/heading
    const heading = await page
      .locator('h1')
      .first()
      .textContent({ timeout: 3000 });
    return { hasIssues: false, message: heading?.trim() || 'Unknown' };
  } catch {
    return { hasIssues: false, message: 'Unable to check' };
  }
}

/**
 * Check Manual Actions status
 * @param {import('playwright').Page} page
 * @returns {Promise<{hasActions: boolean, message: string}>}
 */
export async function getManualActionsStatus(page) {
  try {
    const bodyText = await page.textContent('body', { timeout: 5000 });

    // Look for "No issues detected" or "No manual actions"
    if (/no (manual actions?|issues?) detected/i.test(bodyText)) {
      return { hasActions: false, message: 'No manual actions' };
    }

    // Look for manual action indicators
    if (
      /manual action/i.test(bodyText) &&
      /detected|found|applied/i.test(bodyText)
    ) {
      return { hasActions: true, message: 'Manual actions detected' };
    }

    return { hasActions: false, message: 'No manual actions' };
  } catch {
    return { hasActions: false, message: 'Unable to check' };
  }
}

/**
 * Extract sitemaps data from Sitemaps report
 * @param {import('playwright').Page} page
 * @returns {Promise<{sitemaps: Array, totalDiscovered: number}>}
 */
export async function getSitemapsStatus(page) {
  try {
    // Table structure: Sitemap | Type | Submitted | Last read | Status | Discovered pages | Discovered videos
    const rows = await page.locator('table tbody tr').all();
    const sitemaps = [];
    let totalDiscovered = 0;

    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 7) {
        const url = (await cells[0].textContent())?.trim();
        const type = (await cells[1].textContent())?.trim();
        const submitted = (await cells[2].textContent())?.trim();
        const lastRead = (await cells[3].textContent())?.trim();
        const status = (await cells[4].textContent())?.trim();
        const discoveredPages = parseInt(
          (await cells[5].textContent())?.replace(/,/g, '') || '0',
          10
        );
        const discoveredVideos = parseInt(
          (await cells[6].textContent())?.replace(/,/g, '') || '0',
          10
        );

        if (url) {
          sitemaps.push({
            url,
            type,
            submitted,
            lastRead,
            status,
            discoveredPages,
            discoveredVideos,
          });
          totalDiscovered += discoveredPages;
        }
      }
    }

    return { sitemaps, totalDiscovered };
  } catch {
    return { sitemaps: [], totalDiscovered: 0 };
  }
}
