# BackstopJS CI Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add async visual regression testing to CI pipeline, running as a peer to Lighthouse after deployment completes.

**Architecture:** BackstopJS workflow triggers on CI completion (like Lighthouse), tests deployed preview URL against reference images stored as GitHub artifacts (not git), and reports results to PR comments. Reference images update automatically when main branch is merged.

**Tech Stack:** BackstopJS, GitHub Actions, Puppeteer, GitHub Artifacts

---

## Design Decisions

### Reference Image Strategy

Store reference images as **GitHub Artifacts** (not a git branch):

- No source control bloat (binary images stay out of git)
- Auto-cleanup via retention policy (30 days for references, 7 days for reports)
- Uses `dawidd6/action-download-artifact@v3` to fetch from previous main runs
- Simpler workflow (no branch switching)

### Core Pages to Test

| Page     | Path        | Rationale                            |
|----------|-------------|--------------------------------------|
| Homepage | `/`         | Primary landing page                 |
| About    | `/about/`   | Key content page                     |
| Contact  | `/contact/` | Conversion page (has HoneyBook form) |
| Blog     | `/blog/`    | Content list page                    |
| Events   | `/events/`  | Service category page                |

### Viewport Coverage

Match site breakpoints for comprehensive coverage:

| Label   | Width  | Breakpoint              |
|---------|--------|-------------------------|
| mobile  | 375px  | Below $breakpoint-sm    |
| tablet  | 768px  | $breakpoint-md boundary |
| desktop | 1280px | $breakpoint-xl          |

### Workflow Trigger

Same pattern as Lighthouse:

- Trigger: `workflow_run` on CI completion
- Non-blocking: `continue-on-error: true`
- Async: Doesn't block deployment

---

## Task 1: Update backstop.json for CI

**Files:**

- Modify: `backstop.json`

**Step 1: Update backstop.json with CI-compatible config**

```json
{
  "id": "pike-west",
  "viewports": [
    { "label": "mobile", "width": 375, "height": 812 },
    { "label": "tablet", "width": 768, "height": 1024 },
    { "label": "desktop", "width": 1280, "height": 800 }
  ],
  "scenarios": [
    {
      "label": "Homepage",
      "url": "__DEPLOY_URL__/",
      "delay": 3000,
      "selectors": ["document"],
      "misMatchThreshold": 1,
      "requireSameDimensions": false,
      "hideSelectors": [".honeybook-embed", "iframe"]
    },
    {
      "label": "About",
      "url": "__DEPLOY_URL__/about/",
      "delay": 2000,
      "selectors": ["document"],
      "misMatchThreshold": 1,
      "requireSameDimensions": false
    },
    {
      "label": "Contact",
      "url": "__DEPLOY_URL__/contact/",
      "delay": 4000,
      "selectors": ["document"],
      "misMatchThreshold": 1,
      "requireSameDimensions": false,
      "hideSelectors": [".honeybook-embed", "iframe", ".contact-form-container"]
    },
    {
      "label": "Blog",
      "url": "__DEPLOY_URL__/blog/",
      "delay": 2000,
      "selectors": ["document"],
      "misMatchThreshold": 1,
      "requireSameDimensions": false
    },
    {
      "label": "Events",
      "url": "__DEPLOY_URL__/events/",
      "delay": 2000,
      "selectors": ["document"],
      "misMatchThreshold": 1,
      "requireSameDimensions": false
    }
  ],
  "paths": {
    "bitmaps_reference": "backstop_data/bitmaps_reference",
    "bitmaps_test": "backstop_data/bitmaps_test",
    "engine_scripts": "backstop_data/engine_scripts",
    "html_report": "backstop_data/html_report",
    "ci_report": "backstop_data/ci_report"
  },
  "report": ["CI"],
  "engine": "puppeteer",
  "engineOptions": {
    "args": ["--no-sandbox", "--disable-setuid-sandbox"]
  },
  "asyncCaptureLimit": 3,
  "asyncCompareLimit": 30,
  "debug": false,
  "debugWindow": false
}
```

**Notes:**

- `__DEPLOY_URL__` placeholder replaced by CI workflow
- `hideSelectors` for dynamic content (HoneyBook form)
- `report: ["CI"]` for machine-readable JSON output
- Increased delay on Contact page for form load
- `misMatchThreshold: 1` (1%) allows minor rendering variance

**Step 2: Verify config is valid JSON**

Run: `cat backstop.json | jq .`
Expected: Valid JSON output with no errors

**Step 3: Commit**

```bash
git add backstop.json
git commit -m "chore(backstop): update config for CI integration"
```

---

## Task 2: Create onReady script to disable animations

**Files:**

- Create: `backstop_data/engine_scripts/puppet/onReady.js`

**Step 1: Create the onReady script**

```javascript
module.exports = async (page) => {
  // Disable all animations and transitions for consistent screenshots
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });

  // Wait for web fonts to load
  await page.evaluateHandle('document.fonts.ready');

  // Additional wait for lazy-loaded images
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img[loading="lazy"]'));
    await Promise.all(images.map(img => {
      if (img.complete) return;
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));
  });
};
```

**Step 2: Verify file exists**

Run: `ls -la backstop_data/engine_scripts/puppet/onReady.js`
Expected: File exists with correct permissions

**Step 3: Commit**

```bash
git add backstop_data/engine_scripts/puppet/onReady.js
git commit -m "chore(backstop): add onReady script for consistent screenshots"
```

---

## Task 3: Create GitHub Actions workflow

**Files:**

- Create: `.github/workflows/visual-regression.yml`

**Step 1: Create the workflow file**

```yaml
name: Visual Regression

on:
  workflow_run:
    workflows: [CI]
    types: [completed]
  workflow_dispatch:
    inputs:
      url:
        description: 'URL to test (e.g., https://pikeandwest.com)'
        required: true
        type: string

concurrency:
  group: visual-regression-${{ github.event.workflow_run.head_branch || github.ref }}
  cancel-in-progress: true

jobs:
  prepare:
    name: Prepare
    if: github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    permissions:
      actions: read
    outputs:
      url: ${{ steps.get-url.outputs.url }}
      is-main: ${{ steps.get-url.outputs.is-main }}
    steps:
      - name: Get deployment URL
        id: get-url
        uses: actions/github-script@v7
        with:
          script: |
            if (context.eventName === 'workflow_dispatch') {
              const url = '${{ inputs.url }}';
              core.setOutput('url', url);
              core.setOutput('is-main', url.includes('pikeandwest.com') && !url.includes('pages.dev') ? 'true' : 'false');
              return;
            }

            const branch = context.payload.workflow_run.head_branch;
            const isMain = branch === 'main';
            const url = isMain
              ? 'https://pikeandwest.com'
              : `https://${branch.replace(/[^a-z0-9-]/gi, '-').substring(0, 28)}.pikeandwest.pages.dev`;

            core.setOutput('url', url);
            core.setOutput('is-main', isMain ? 'true' : 'false');

  test:
    name: BackstopJS Test
    needs: prepare
    runs-on: ubuntu-latest
    timeout-minutes: 10
    continue-on-error: true
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Download reference images from previous main run
        id: download-refs
        uses: dawidd6/action-download-artifact@v3
        with:
          workflow: visual-regression.yml
          branch: main
          name: backstop-references
          path: backstop_data/bitmaps_reference
          search_artifacts: true
          if_no_artifact_found: warn
        continue-on-error: true

      - name: Check for references
        id: check-refs
        run: |
          if [ -d "backstop_data/bitmaps_reference" ] && [ "$(ls -A backstop_data/bitmaps_reference 2>/dev/null)" ]; then
            echo "Reference images found"
            ls -la backstop_data/bitmaps_reference/ | head -10
            echo "has-refs=true" >> $GITHUB_OUTPUT
          else
            echo "No reference images found - will create baseline"
            echo "has-refs=false" >> $GITHUB_OUTPUT
          fi

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Update config with deploy URL
        run: |
          URL="${{ needs.prepare.outputs.url }}"
          sed -i "s|__DEPLOY_URL__|${URL}|g" backstop.json
          echo "Testing against: ${URL}"
          cat backstop.json | jq '.scenarios[].url'

      - name: Run BackstopJS test
        id: backstop
        run: |
          if [ "${{ steps.check-refs.outputs.has-refs }}" != "true" ]; then
            echo "Creating baseline reference images..."
            npx backstop reference
            echo "result=baseline" >> $GITHUB_OUTPUT
          else
            set +e
            npx backstop test --config=backstop.json
            EXIT_CODE=$?
            set -e
            if [ $EXIT_CODE -eq 0 ]; then
              echo "result=pass" >> $GITHUB_OUTPUT
            else
              echo "result=fail" >> $GITHUB_OUTPUT
            fi
          fi

      - name: Parse results
        id: results
        if: steps.backstop.outputs.result != 'baseline'
        run: |
          if [ -f "backstop_data/ci_report/xunit.xml" ]; then
            TOTAL=$(grep -oP 'tests="\K\d+' backstop_data/ci_report/xunit.xml || echo "0")
            FAILURES=$(grep -oP 'failures="\K\d+' backstop_data/ci_report/xunit.xml || echo "0")
            PASSED=$((TOTAL - FAILURES))
            echo "total=${TOTAL}" >> $GITHUB_OUTPUT
            echo "passed=${PASSED}" >> $GITHUB_OUTPUT
            echo "failed=${FAILURES}" >> $GITHUB_OUTPUT
          else
            echo "total=0" >> $GITHUB_OUTPUT
            echo "passed=0" >> $GITHUB_OUTPUT
            echo "failed=0" >> $GITHUB_OUTPUT
          fi

      - name: Generate summary
        run: |
          echo "## Visual Regression Report" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY

          if [ "${{ steps.backstop.outputs.result }}" = "baseline" ]; then
            echo "📸 **Baseline Created** - Reference images captured for future comparisons." >> $GITHUB_STEP_SUMMARY
          elif [ "${{ steps.backstop.outputs.result }}" = "pass" ]; then
            echo "✅ **All visual tests passed**" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "| Metric | Value |" >> $GITHUB_STEP_SUMMARY
            echo "|--------|-------|" >> $GITHUB_STEP_SUMMARY
            echo "| Total | ${{ steps.results.outputs.total }} |" >> $GITHUB_STEP_SUMMARY
            echo "| Passed | ${{ steps.results.outputs.passed }} |" >> $GITHUB_STEP_SUMMARY
          else
            echo "⚠️ **Visual differences detected**" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "| Metric | Value |" >> $GITHUB_STEP_SUMMARY
            echo "|--------|-------|" >> $GITHUB_STEP_SUMMARY
            echo "| Total | ${{ steps.results.outputs.total }} |" >> $GITHUB_STEP_SUMMARY
            echo "| Passed | ${{ steps.results.outputs.passed }} |" >> $GITHUB_STEP_SUMMARY
            echo "| Failed | ${{ steps.results.outputs.failed }} |" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "Download the report artifact to review visual differences." >> $GITHUB_STEP_SUMMARY
          fi

          echo "" >> $GITHUB_STEP_SUMMARY
          echo "**URL tested:** ${{ needs.prepare.outputs.url }}" >> $GITHUB_STEP_SUMMARY

      - name: Upload HTML report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: backstop-report
          path: backstop_data/html_report/
          retention-days: 7

      - name: Upload reference images (for main branch)
        if: needs.prepare.outputs.is-main == 'true'
        uses: actions/upload-artifact@v4
        with:
          name: backstop-references
          path: backstop_data/bitmaps_reference/
          retention-days: 30
          overwrite: true

    outputs:
      result: ${{ steps.backstop.outputs.result }}
      total: ${{ steps.results.outputs.total }}
      passed: ${{ steps.results.outputs.passed }}
      failed: ${{ steps.results.outputs.failed }}

  comment:
    name: Comment on PR
    needs: [prepare, test]
    if: always() && needs.prepare.result == 'success' && github.event.workflow_run.event == 'pull_request'
    runs-on: ubuntu-latest
    timeout-minutes: 2
    permissions:
      pull-requests: write
    steps:
      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            const result = '${{ needs.test.outputs.result }}';
            const total = '${{ needs.test.outputs.total }}';
            const passed = '${{ needs.test.outputs.passed }}';
            const failed = '${{ needs.test.outputs.failed }}';
            const url = '${{ needs.prepare.outputs.url }}';

            let body;
            if (result === 'baseline') {
              body = `## 📸 Visual Regression - Baseline Created

            Reference images have been captured. Future runs will compare against these.

            **URL:** ${url}`;
            } else if (result === 'pass') {
              body = `## ✅ Visual Regression - Passed

            All ${total} visual tests passed.

            **URL:** ${url}`;
            } else {
              body = `## ⚠️ Visual Regression - Differences Detected

            | Metric | Value     |
            |--------|-----------|
            | Total  | ${total}  |
            | Passed | ${passed} |
            | Failed | ${failed} |

            Download the \`backstop-report\` artifact to review visual differences.

            **URL:** ${url}`;
            }

            // Get PR number from the workflow run
            const runId = context.payload.workflow_run.id;
            const run = await github.rest.actions.getWorkflowRun({
              owner: context.repo.owner,
              repo: context.repo.repo,
              run_id: runId,
            });

            const prs = await github.rest.pulls.list({
              owner: context.repo.owner,
              repo: context.repo.repo,
              head: `${context.repo.owner}:${run.data.head_branch}`,
              state: 'open',
            });

            if (prs.data.length === 0) {
              console.log('No open PR found');
              return;
            }

            const prNumber = prs.data[0].number;

            const { data: comments } = await github.rest.issues.listComments({
              issue_number: prNumber,
              owner: context.repo.owner,
              repo: context.repo.repo,
            });

            const botComment = comments.find(comment =>
              comment.user.type === 'Bot' && comment.body.includes('Visual Regression')
            );

            if (botComment) {
              await github.rest.issues.updateComment({
                comment_id: botComment.id,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: body
              });
            } else {
              await github.rest.issues.createComment({
                issue_number: prNumber,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: body
              });
            }
```

**Step 2: Verify workflow YAML is valid**

Run: `cat .github/workflows/visual-regression.yml | head -50`
Expected: Valid YAML with correct structure

**Step 3: Commit**

```bash
git add .github/workflows/visual-regression.yml
git commit -m "feat(ci): add visual regression workflow with BackstopJS"
```

---

## Task 4: Update .gitignore for BackstopJS artifacts

**Files:**

- Modify: `.gitignore`

**Step 1: Verify current .gitignore entries**

Check that these lines exist:

```text
backstop_data/bitmaps_test/
backstop_data/html_report/
```

**Step 2: Add ci_report and bitmaps_reference if missing**

Add these lines if not present:

```text
backstop_data/ci_report/
backstop_data/bitmaps_reference/
```

Note: `bitmaps_reference/` is now gitignored since references are stored as artifacts, not in git.

**Step 3: Commit if changes made**

```bash
git add .gitignore
git commit -m "chore: update gitignore for backstop ci artifacts"
```

---

## Task 5: Verify package.json scripts

**Files:**

- Modify: `package.json`

**Step 1: Read current package.json**

Verify current backstop scripts exist.

**Step 2: No changes needed**

The existing scripts are sufficient:

- `backstop:capture-baseline` - Capture reference images
- `backstop:run-comparison` - Run comparison test
- `backstop:approve-changes` - Approve changes
- `backstop:view-report` - Open HTML report

**Step 3: Skip commit (no changes)**

---

## Task 6: Test workflow locally

**Files:**

- None (manual testing)

**Step 1: Start Hugo server**

```bash
npm run serve
```

**Step 2: In another terminal, create reference images**

```bash
# Update backstop.json URLs to localhost temporarily
sed -i '' 's|__DEPLOY_URL__|http://localhost:1313|g' backstop.json

# Capture reference images
npm run backstop:capture-baseline
```

**Step 3: Run test to verify setup**

```bash
npm run backstop:run-comparison
```

Expected: All tests pass (comparing against self)

**Step 4: Restore backstop.json**

```bash
git checkout backstop.json
```

**Step 5: Verify test artifacts exist**

```bash
ls -la backstop_data/bitmaps_reference/
ls -la backstop_data/bitmaps_test/
```

---

## Task 7: Update documentation

**Files:**

- Modify: `docs/next-steps.md`

**Step 1: Add visual regression to Current Status table**

Add row:

```markdown
| Visual Regression  | Active    | BackstopJS in CI, async like Lighthouse          |
```

**Step 2: Add to Pre-Launch Checklist if not present**

Under Performance section, add:

```markdown
- [ ] Verify visual regression baseline images captured
```

**Step 3: Add to Recently Completed section**

```markdown
### BackstopJS CI Integration (2026-01-29)

**Goal:** Add async visual regression testing to CI pipeline.

**Implementation:**

- Workflow triggers after CI completes (like Lighthouse)
- Tests core pages: Homepage, About, Contact, Blog, Events
- Reference images stored as GitHub artifacts (30-day retention)
- Reports to PR comments with pass/fail status
- Updates references automatically on main branch merges

**Files Created:**

- `.github/workflows/visual-regression.yml`
- `backstop_data/engine_scripts/puppet/onReady.js`

**Files Modified:**

- `backstop.json` - CI-compatible config with URL placeholder
- `.gitignore` - Exclude backstop artifacts
```

**Step 4: Commit**

```bash
git add docs/next-steps.md
git commit -m "docs: add visual regression to next-steps"
```

---

## Summary

After completing all tasks:

1. **backstop.json** - Updated with CI-compatible config, URL placeholder, hide selectors
2. **onReady.js** - Disables animations, waits for fonts and images
3. **visual-regression.yml** - Async workflow triggered after CI
4. **.gitignore** - Excludes all backstop artifacts (including references)
5. **Documentation** - Updated with new capability

**Workflow behavior:**

- **PRs:** Download references from last main run → compare → report differences
- **Main:** Capture screenshots → upload as `backstop-references` artifact (30-day retention)
- **Manual:** Can trigger with custom URL via workflow_dispatch

**Key simplification vs git branch approach:**

- No `backstop-references` git branch needed
- References stored as GitHub artifacts with auto-cleanup
- Uses `dawidd6/action-download-artifact@v3` to fetch from previous runs
