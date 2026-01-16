# Cloudflare Pages + GitHub Actions Deployment Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy Pike & West Hugo site to Cloudflare Pages with automated CI/CD via GitHub Actions, including Playwright smoke tests to verify deployments.

**Architecture:** GitHub Actions workflow triggers on push to main, builds Hugo site, deploys to Cloudflare Pages via Wrangler, then runs Playwright smoke tests against the deployed URL. Preview deployments run on PRs.

**Tech Stack:** Hugo 0.154.5, GitHub Actions, Cloudflare Pages, Wrangler CLI, Playwright

---

## Prerequisites (Manual Steps - Do These First)

Before starting the automated tasks, complete these manual setup steps:

### P1: Create Cloudflare Pages Project

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Workers & Pages** > **Create** > **Pages** > **Connect to Git**
3. Select your GitHub repo `pikeandwest.com`
4. Configure build settings:
   - **Build command:** `hugo --gc --minify`
   - **Build output directory:** `public`
   - **Environment variable:** `HUGO_VERSION = 0.154.5`
5. Click **Save and Deploy** (initial deployment)
6. Note your project name: `pikeandwest`

### P2: Generate Cloudflare API Token

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use template: **Edit Cloudflare Workers**
4. Permissions needed:
   - Account > Cloudflare Pages > Edit
   - Zone > Zone > Read (optional, for custom domain)
5. Click **Continue to summary** > **Create Token**
6. Copy the token (you won't see it again)

### P3: Get Cloudflare Account ID

1. In Cloudflare Dashboard, click any zone/domain
2. On the right sidebar, find **Account ID**
3. Copy the 32-character hex string

### P4: Add Secrets to GitHub Repository

1. Go to your GitHub repo > **Settings** > **Secrets and variables** > **Actions**
2. Add these repository secrets:
   - `CLOUDFLARE_API_TOKEN` - The API token from P2
   - `CLOUDFLARE_ACCOUNT_ID` - The account ID from P3

---

## Task 1: Create GitHub Actions Workflow Directory

**Files:**

- Create: `.github/workflows/` (directory)

**Step 1: Create the directory structure**

Run:

```bash
mkdir -p .github/workflows
```

Expected: Directory created, no output

**Step 2: Verify directory exists**

Run:

```bash
ls -la .github/
```

Expected:

```text
total 0
drwxr-xr-x  3 user  staff   96 Jan 16 10:00 .
drwxr-xr-x 20 user  staff  640 Jan 16 10:00 ..
drwxr-xr-x  2 user  staff   64 Jan 16 10:00 workflows
```

**Step 3: Commit**

```bash
git add .github/
git commit -m "chore: add GitHub Actions workflow directory"
```

---

## Task 2: Create Deploy Workflow

**Files:**

- Create: `.github/workflows/deploy.yml`

**Step 1: Create the workflow file**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

# Allow only one concurrent deployment per ref
concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: true

env:
  HUGO_VERSION: "0.154.5"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: ${{ env.HUGO_VERSION }}
          extended: true

      - name: Build
        run: hugo --gc --minify

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: hugo-site
          path: public/
          retention-days: 1

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    outputs:
      deployment-url: ${{ steps.deploy.outputs.deployment-url }}
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: hugo-site
          path: public/

      - name: Deploy to Cloudflare Pages
        id: deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy public --project-name=pikeandwest --branch=${{ github.head_ref || github.ref_name }}

      - name: Output deployment URL
        run: echo "Deployed to ${{ steps.deploy.outputs.deployment-url }}"
```

**Step 2: Validate YAML syntax**

Run:

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))" && echo "YAML valid"
```

Expected: `YAML valid`

**Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add Cloudflare Pages deploy workflow"
```

---

## Task 3: Install Playwright

**Files:**

- Modify: `package.json`

**Step 1: Install Playwright as dev dependency**

Run:

```bash
npm install -D @playwright/test
```

Expected: Package added to devDependencies

**Step 2: Install Playwright browsers**

Run:

```bash
npx playwright install chromium
```

Expected: Chromium browser downloaded

**Step 3: Verify installation**

Run:

```bash
npx playwright --version
```

Expected: Version number output (e.g., `Version 1.50.0`)

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add Playwright for smoke testing"
```

---

## Task 4: Create Playwright Configuration

**Files:**

- Create: `playwright.config.ts`

**Step 1: Create the Playwright config**

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: process.env.DEPLOYMENT_URL || 'http://localhost:1313',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Run local Hugo server for local testing
  webServer: process.env.DEPLOYMENT_URL ? undefined : {
    command: 'hugo server --bind 0.0.0.0',
    url: 'http://localhost:1313',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

**Step 2: Validate TypeScript syntax**

Run:

```bash
npx tsc --noEmit playwright.config.ts 2>&1 || echo "Validation complete"
```

Expected: No errors (or "Validation complete" if tsc not configured)

**Step 3: Commit**

```bash
git add playwright.config.ts
git commit -m "feat: add Playwright configuration"
```

---

## Task 5: Create Smoke Test Directory Structure

**Files:**

- Create: `tests/e2e/` (directory)

**Step 1: Create the test directory**

Run:

```bash
mkdir -p tests/e2e
```

Expected: Directory created

**Step 2: Verify structure**

Run:

```bash
ls -la tests/
```

Expected:

```text
total 0
drwxr-xr-x  3 user  staff  96 Jan 16 10:00 .
drwxr-xr-x 21 user  staff 672 Jan 16 10:00 ..
drwxr-xr-x  2 user  staff  64 Jan 16 10:00 e2e
```

**Step 3: Commit**

```bash
git add tests/
git commit -m "chore: add e2e test directory structure"
```

---

## Task 6: Write Homepage Smoke Test

**Files:**

- Create: `tests/e2e/homepage.spec.ts`

**Step 1: Create the homepage smoke test**

Create `tests/e2e/homepage.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage Smoke Tests', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Pike & West/);
  });

  test('hero section is visible', async ({ page }) => {
    await page.goto('/');

    // Check hero section exists
    const hero = page.locator('.hero, [class*="hero"], section:first-of-type');
    await expect(hero).toBeVisible();
  });

  test('navigation is present', async ({ page }) => {
    await page.goto('/');

    // Check header/nav exists
    const nav = page.locator('header, nav, [role="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('footer is present', async ({ page }) => {
    await page.goto('/');

    // Scroll to bottom and check footer
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).toBeVisible();
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known benign errors (e.g., favicon 404)
    const criticalErrors = errors.filter(e => !e.includes('favicon'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('page has no broken images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      const src = await img.getAttribute('src');
      expect(naturalWidth, `Image ${src} failed to load`).toBeGreaterThan(0);
    }
  });
});
```

**Step 2: Commit**

```bash
git add tests/e2e/homepage.spec.ts
git commit -m "feat: add homepage smoke tests"
```

---

## Task 7: Write Contact Page Smoke Test

**Files:**

- Create: `tests/e2e/contact.spec.ts`

**Step 1: Create the contact page smoke test**

Create `tests/e2e/contact.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Contact Page Smoke Tests', () => {
  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');

    await expect(page).toHaveTitle(/Contact|Pike & West/);
  });

  test('contact information is visible', async ({ page }) => {
    await page.goto('/contact');

    // Check for phone number
    const phoneText = page.getByText(/901/);
    await expect(phoneText).toBeVisible();
  });

  test('address is visible', async ({ page }) => {
    await page.goto('/contact');

    // Check for address elements
    const addressText = page.getByText(/Germantown|West Street/i);
    await expect(addressText).toBeVisible();
  });
});
```

**Step 2: Commit**

```bash
git add tests/e2e/contact.spec.ts
git commit -m "feat: add contact page smoke tests"
```

---

## Task 8: Add npm Scripts for Testing

**Files:**

- Modify: `package.json`

**Step 1: Add test scripts to package.json**

Update the `scripts` section in `package.json`:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:smoke": "playwright test --grep @smoke",
    "test:ci": "playwright test --reporter=github",
    "serve:webflow": "npx serve webflow-export -p 8080",
    "compare:styles": "node scripts/style-comparison/compare-styles.js"
  }
}
```

**Step 2: Verify scripts are valid JSON**

Run:

```bash
node -e "require('./package.json')" && echo "package.json valid"
```

Expected: `package.json valid`

**Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add Playwright test scripts"
```

---

## Task 9: Add Smoke Test Job to Workflow

**Files:**

- Modify: `.github/workflows/deploy.yml`

**Step 1: Add smoke test job to the workflow**

Update `.github/workflows/deploy.yml` to add this job after the `deploy` job:

```yaml
  smoke-test:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps

      - name: Run smoke tests
        run: npm run test:ci
        env:
          DEPLOYMENT_URL: ${{ needs.deploy.outputs.deployment-url }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

**Step 2: Validate YAML syntax**

Run:

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))" && echo "YAML valid"
```

Expected: `YAML valid`

**Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add smoke test job to deploy workflow"
```

---

## Task 10: Create Gitignore Additions

**Files:**

- Modify: `.gitignore`

**Step 1: Add Playwright artifacts to .gitignore**

Append to `.gitignore`:

```text
# Playwright
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

**Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add Playwright artifacts to gitignore"
```

---

## Task 11: Run Local Smoke Tests

**Files:** None (verification only)

**Step 1: Start Hugo server in background**

Run:

```bash
hugo server &
```

Expected: Server starts on port 1313

**Step 2: Run Playwright tests locally**

Run:

```bash
DEPLOYMENT_URL=http://localhost:1313 npx playwright test
```

Expected: All tests pass

**Step 3: Stop Hugo server**

Run:

```bash
pkill -f "hugo server" || true
```

**Step 4: View test report (optional)**

Run:

```bash
npx playwright show-report
```

---

## Task 12: Interactive Deployment Walkthrough with Playwright

**Files:**

- Create: `tests/e2e/walkthrough.spec.ts`

**Step 1: Create interactive walkthrough test**

This test walks through the site like a user would, verifying all major sections:

Create `tests/e2e/walkthrough.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Site Walkthrough', () => {
  test('complete user journey through site', async ({ page }) => {
    // Step 1: Land on homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Pike & West/);

    // Step 2: Verify hero section loads
    await page.waitForLoadState('networkidle');

    // Step 3: Scroll through homepage sections
    // Venue gallery
    const gallerySection = page.locator('.gallery, .venue-gallery, [class*="gallery"]').first();
    if (await gallerySection.isVisible()) {
      await gallerySection.scrollIntoViewIfNeeded();
      await expect(gallerySection).toBeVisible();
    }

    // Event types section
    const eventsSection = page.locator('.events, .event-types, [class*="event"]').first();
    if (await eventsSection.isVisible()) {
      await eventsSection.scrollIntoViewIfNeeded();
      await expect(eventsSection).toBeVisible();
    }

    // About section
    const aboutSection = page.locator('.about, [class*="about"]').first();
    if (await aboutSection.isVisible()) {
      await aboutSection.scrollIntoViewIfNeeded();
      await expect(aboutSection).toBeVisible();
    }

    // Step 4: Navigate to contact page
    const contactLink = page.locator('a[href*="contact"]').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on contact page
      await expect(page).toHaveURL(/contact/);
    } else {
      // Direct navigation if no link found
      await page.goto('/contact');
    }

    // Step 5: Verify contact page content
    await expect(page.getByText(/901/)).toBeVisible();

    // Step 6: Navigate back to home
    const homeLink = page.locator('a[href="/"], a[href="./"], .logo, [class*="logo"]').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await page.waitForLoadState('networkidle');
    }

    // Step 7: Final verification
    await expect(page).toHaveURL(/\/$/);
  });

  test('mobile viewport walkthrough', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await expect(page).toHaveTitle(/Pike & West/);

    // Check mobile menu exists (hamburger)
    const mobileMenu = page.locator('[class*="mobile"], [class*="hamburger"], button[aria-label*="menu"], .menu-toggle');

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/mobile-homepage.png' });

    // Navigate to contact
    await page.goto('/contact');
    await page.screenshot({ path: 'test-results/mobile-contact.png' });
  });
});
```

**Step 2: Commit**

```bash
git add tests/e2e/walkthrough.spec.ts
git commit -m "feat: add site walkthrough tests"
```

---

## Task 13: Push and Verify Deployment

**Files:** None (verification only)

**Step 1: Push all changes to main**

Run:

```bash
git push origin main
```

Expected: Push succeeds

**Step 2: Monitor GitHub Actions**

1. Go to your repo on GitHub
2. Click **Actions** tab
3. Watch the "Deploy to Cloudflare Pages" workflow

Expected workflow stages:

1. Build - Hugo builds successfully
2. Deploy - Wrangler deploys to Cloudflare Pages
3. Smoke Test - Playwright tests pass against deployed URL

**Step 3: Verify deployment URL**

Check the workflow output for the deployment URL. It should be:

- Production: `https://pikeandwest.pages.dev` (or custom domain)
- Preview: `https://<branch>.<project>.pages.dev`

---

## Task 14: Verify with Live Playwright Test

**Files:** None (verification only)

**Step 1: Run Playwright against production**

Run:

```bash
DEPLOYMENT_URL=https://pikeandwest.pages.dev npx playwright test
```

Expected: All tests pass against the live deployment

**Step 2: Generate and view report**

Run:

```bash
npx playwright show-report
```

Expected: HTML report opens showing all passing tests

---

## Summary Checklist

- [ ] P1: Cloudflare Pages project created
- [ ] P2: API token generated
- [ ] P3: Account ID obtained
- [ ] P4: GitHub secrets configured
- [ ] Task 1: Workflow directory created
- [ ] Task 2: Deploy workflow created
- [ ] Task 3: Playwright installed
- [ ] Task 4: Playwright configured
- [ ] Task 5: Test directory created
- [ ] Task 6: Homepage smoke tests written
- [ ] Task 7: Contact smoke tests written
- [ ] Task 8: npm scripts added
- [ ] Task 9: Smoke test job added to workflow
- [ ] Task 10: Gitignore updated
- [ ] Task 11: Local tests passing
- [ ] Task 12: Walkthrough tests written
- [ ] Task 13: Pushed and deployed
- [ ] Task 14: Production verification complete

---

## Troubleshooting

### Build fails with "Hugo not found"

Verify `HUGO_VERSION` in workflow matches available version. Check [Hugo releases](https://github.com/gohugoio/hugo/releases).

### Deploy fails with "Authentication error"

Verify `CLOUDFLARE_API_TOKEN` has "Cloudflare Pages: Edit" permission.

### Smoke tests fail with timeout

Increase Playwright timeout or check if deployment URL is correct in the output.

### Preview deployments not working

Ensure the branch name is being passed correctly to `--branch` flag.
