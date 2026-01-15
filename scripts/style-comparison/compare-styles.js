/**
 * Style Comparison Script
 *
 * Compares computed CSS styles between Webflow export and Hugo site
 * using Playwright to extract actual rendered values.
 *
 * Usage:
 *   1. Start Webflow export server: npx serve webflow-export -p 8080
 *   2. Start Hugo server: hugo server (port 1313)
 *   3. Run: node scripts/style-comparison/compare-styles.js
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'yaml';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load mapping configuration
const mappingPath = join(__dirname, 'mapping.yaml');
const mapping = parse(readFileSync(mappingPath, 'utf8'));

// Property sets
const PROPERTY_SETS = mapping.config.property_sets;

// Flatten property sets into array
function getProperties(propertyTypes) {
  return propertyTypes.flatMap((type) => PROPERTY_SETS[type] || []);
}

// Extract computed styles for an element
async function getComputedStyles(page, selector, properties) {
  try {
    const element = await page.$(selector);
    if (!element) {
      return { error: `Element not found: ${selector}` };
    }

    const styles = await page.evaluate(
      ({ sel, props }) => {
        const el = document.querySelector(sel);
        if (!el) return null;

        const computed = window.getComputedStyle(el);
        const result = {};
        for (const prop of props) {
          result[prop] = computed.getPropertyValue(prop);
        }
        return result;
      },
      { sel: selector, props: properties }
    );

    return styles || { error: `Could not get styles for: ${selector}` };
  } catch (e) {
    return { error: e.message };
  }
}

// Compare two style objects
function compareStyles(webflowStyles, hugoStyles, properties) {
  const results = {
    matches: [],
    mismatches: [],
    errors: [],
  };

  if (webflowStyles.error) {
    results.errors.push({ source: 'webflow', message: webflowStyles.error });
    return results;
  }

  if (hugoStyles.error) {
    results.errors.push({ source: 'hugo', message: hugoStyles.error });
    return results;
  }

  for (const prop of properties) {
    const wfValue = webflowStyles[prop];
    const hugoValue = hugoStyles[prop];

    // Normalize values for comparison
    const wfNorm = normalizeValue(prop, wfValue);
    const hugoNorm = normalizeValue(prop, hugoValue);

    if (wfNorm === hugoNorm) {
      results.matches.push({ property: prop, value: wfValue });
    } else {
      results.mismatches.push({
        property: prop,
        webflow: wfValue,
        hugo: hugoValue,
      });
    }
  }

  return results;
}

// Normalize CSS values for comparison
function normalizeValue(property, value) {
  if (!value) return '';

  // Normalize color values to lowercase hex
  if (
    property === 'color' ||
    property === 'background-color' ||
    property.includes('border')
  ) {
    return normalizeColor(value);
  }

  // Normalize font-family (remove quotes, lowercase)
  if (property === 'font-family') {
    return value.toLowerCase().replace(/['"]/g, '').split(',')[0].trim();
  }

  // Normalize pixel values
  if (value.endsWith('px')) {
    return Math.round(parseFloat(value)) + 'px';
  }

  return value.toLowerCase().trim();
}

// Convert any color format to hex
function normalizeColor(color) {
  if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
    return 'transparent';
  }

  // Already hex
  if (color.startsWith('#')) {
    return color.toLowerCase();
  }

  // RGB/RGBA to hex
  const rgbMatch = color.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
  );
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  return color.toLowerCase();
}

// Format results for console output
function formatResults(pageResults) {
  let output = '';

  for (const section of pageResults.sections) {
    output += `\n${'='.repeat(60)}\n`;
    output += `SECTION: ${section.name}\n`;
    output += `${'='.repeat(60)}\n`;

    for (const element of section.elements) {
      const { matches, mismatches, errors } = element.comparison;

      const status =
        errors.length > 0 ? 'ERROR' : mismatches.length > 0 ? 'DIFF' : 'MATCH';
      const statusIcon =
        status === 'MATCH' ? '✓' : status === 'DIFF' ? '✗' : '⚠';

      output += `\n${statusIcon} ${element.role}\n`;
      output += `  Hugo: ${element.hugo}\n`;
      output += `  Webflow: ${element.webflow}\n`;

      if (errors.length > 0) {
        for (const err of errors) {
          output += `  ERROR (${err.source}): ${err.message}\n`;
        }
      }

      if (mismatches.length > 0) {
        output += `  Differences:\n`;
        for (const diff of mismatches) {
          output += `    ${diff.property}:\n`;
          output += `      Webflow: ${diff.webflow}\n`;
          output += `      Hugo:    ${diff.hugo}\n`;
        }
      }

      if (
        matches.length > 0 &&
        mismatches.length === 0 &&
        errors.length === 0
      ) {
        output += `  All ${matches.length} properties match\n`;
      }
    }
  }

  return output;
}

// Generate JSON report
function generateJsonReport(allResults) {
  const summary = {
    timestamp: new Date().toISOString(),
    totalElements: 0,
    matching: 0,
    withDifferences: 0,
    withErrors: 0,
    pages: [],
  };

  for (const page of allResults) {
    const pageData = {
      path: page.path,
      sections: [],
    };

    for (const section of page.sections) {
      const sectionData = {
        name: section.name,
        elements: [],
      };

      for (const element of section.elements) {
        summary.totalElements++;

        const { matches, mismatches, errors } = element.comparison;

        if (errors.length > 0) {
          summary.withErrors++;
        } else if (mismatches.length > 0) {
          summary.withDifferences++;
        } else {
          summary.matching++;
        }

        sectionData.elements.push({
          role: element.role,
          hugo: element.hugo,
          webflow: element.webflow,
          status:
            errors.length > 0
              ? 'error'
              : mismatches.length > 0
                ? 'mismatch'
                : 'match',
          matches: matches.length,
          mismatches,
          errors,
        });
      }

      pageData.sections.push(sectionData);
    }

    summary.pages.push(pageData);
  }

  return summary;
}

// Main execution
async function main() {
  console.log('Style Comparison Tool');
  console.log('=====================\n');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const allResults = [];

  for (const page of mapping.pages) {
    console.log(`\nProcessing: ${page.path}`);

    const webflowUrl = `${mapping.config.webflow_url}${page.webflow_path}`;
    const hugoUrl = `${mapping.config.hugo_url}${page.path}`;

    // Open both pages
    const webflowPage = await context.newPage();
    const hugoPage = await context.newPage();

    try {
      await webflowPage.goto(webflowUrl, { waitUntil: 'networkidle' });
      await hugoPage.goto(hugoUrl, { waitUntil: 'networkidle' });
    } catch (e) {
      console.error(`Failed to load pages: ${e.message}`);
      console.error(`  Webflow: ${webflowUrl}`);
      console.error(`  Hugo: ${hugoUrl}`);
      continue;
    }

    const pageResults = {
      path: page.path,
      sections: [],
    };

    for (const section of page.sections) {
      const sectionResults = {
        name: section.name,
        elements: [],
      };

      for (const element of section.elements) {
        const properties = getProperties(element.properties);

        const webflowStyles = await getComputedStyles(
          webflowPage,
          element.webflow,
          properties
        );
        const hugoStyles = await getComputedStyles(
          hugoPage,
          element.hugo,
          properties
        );

        const comparison = compareStyles(webflowStyles, hugoStyles, properties);

        sectionResults.elements.push({
          role: element.role,
          hugo: element.hugo,
          webflow: element.webflow,
          comparison,
        });
      }

      pageResults.sections.push(sectionResults);
    }

    allResults.push(pageResults);

    await webflowPage.close();
    await hugoPage.close();
  }

  await browser.close();

  // Output results
  console.log('\n' + '='.repeat(60));
  console.log('COMPARISON RESULTS');
  console.log('='.repeat(60));

  for (const page of allResults) {
    console.log(`\nPage: ${page.path}`);
    console.log(formatResults(page));
  }

  // Generate JSON report
  const report = generateJsonReport(allResults);
  const reportPath = join(__dirname, 'comparison-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total elements compared: ${report.totalElements}`);
  console.log(`Matching: ${report.matching}`);
  console.log(`With differences: ${report.withDifferences}`);
  console.log(`With errors: ${report.withErrors}`);
  console.log(`\nDetailed report saved to: ${reportPath}`);
}

main().catch(console.error);
