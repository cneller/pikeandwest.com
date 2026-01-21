# GitHub Actions Consolidation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate 4 workflow files into 2, eliminating duplicate builds and making Lighthouse async/non-blocking.

**Architecture:** Single `deploy.yml` handles Build → Validate → Deploy sequentially. Separate `lighthouse.yml` triggers via `workflow_run` after deploy completes, runs performance checks without blocking PRs.

**Tech Stack:** GitHub Actions, Hugo, htmltest, Lighthouse CI, Cloudflare Pages

---

## Current State

```text
.github/workflows/
├── build.yml      # Reusable workflow (workflow_call only)
├── ci.yml         # Calls build.yml → htmltest validation
├── deploy.yml     # Calls build.yml → Cloudflare deploy → calls perf.yml
└── perf.yml       # Reusable workflow (workflow_call + workflow_dispatch)
```

**Problems:**

- Every push triggers 2 builds (CI + Deploy both call build.yml)
- 4 workflows in GitHub UI, only 2 ever run standalone
- Lighthouse blocks deploy completion

## Target State

```text
.github/workflows/
├── deploy.yml     # Build → Validate → Deploy (all inline)
└── lighthouse.yml # Async perf checks via workflow_run
```

**Benefits:**

- 50% fewer workflow runs (single build per push)
- Faster PR feedback (deploy doesn't wait for Lighthouse)
- Clearer GitHub UI (2 workflows, both meaningful)

---

## Task 1: Create New deploy.yml

**Files:**

- Rewrite: `.github/workflows/deploy.yml`

**Step 1: Write the new deploy.yml with inlined build and validation**

```yaml
name: Deploy

on:
  push:
    branches: [main]
    paths-ignore:
      - '*.md'
      - 'docs/**'
      - 'LICENSE'
      - '.editorconfig'
      - '.vscode/**'
      - 'backstop_data/**'
  pull_request:
    types: [opened, synchronize]
    paths-ignore:
      - '*.md'
      - 'docs/**'
      - 'LICENSE'
      - '.editorconfig'
      - '.vscode/**'
      - 'backstop_data/**'

concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: true

env:
  HUGO_VERSION: '0.154.5'

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    timeout-minutes: 10
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

      - name: Cache Hugo modules
        uses: actions/cache@v4
        with:
          path: /tmp/hugo_cache
          key: ${{ runner.os }}-hugomod-${{ hashFiles('**/go.sum') }}
          restore-keys: |
            ${{ runner.os }}-hugomod-

      - name: Build site
        env:
          HUGO_CACHEDIR: /tmp/hugo_cache
        run: hugo --gc --minify

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: hugo-site
          path: public/
          retention-days: 1

  validate:
    name: Validate
    needs: build
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: hugo-site
          path: public/

      - name: Run htmltest
        uses: wjdp/htmltest-action@master
        with:
          path: public
          config: .htmltest.yml

  deploy:
    name: Deploy
    needs: validate
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: read
      deployments: write
      pull-requests: write
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: hugo-site
          path: public/

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Cache npm
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-npm-wrangler
          restore-keys: |
            ${{ runner.os }}-npm-

      - name: Install Wrangler
        run: npm install -g wrangler

      - name: Deploy to Cloudflare
        id: deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: |
          set +e
          OUTPUT=$(wrangler pages deploy public --project-name=pikeandwest --branch=${{ github.head_ref || github.ref_name }} 2>&1)
          EXIT_CODE=$?
          echo "$OUTPUT"
          if [ $EXIT_CODE -ne 0 ]; then
            echo "::error::Wrangler deployment failed with exit code $EXIT_CODE"
            exit $EXIT_CODE
          fi
          URL=$(echo "$OUTPUT" | grep -oE 'https://[a-z0-9-]+\.pikeandwest\.pages\.dev' | head -1)
          echo "url=$URL" >> $GITHUB_OUTPUT

      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const url = '${{ steps.deploy.outputs.url }}';
            const body = `🚀 **Preview deployed!**\n\n${url}`;

            const { data: comments } = await github.rest.issues.listComments({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
            });

            const botComment = comments.find(comment =>
              comment.user.type === 'Bot' && comment.body.includes('Preview deployed')
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
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: body
              });
            }

      - name: Log deployment URL
        run: echo "Deployed to ${{ steps.deploy.outputs.url }}"

    outputs:
      url: ${{ steps.deploy.outputs.url }}
```

**Step 2: Verify YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))"`
Expected: No output (valid YAML)

**Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "refactor(ci): consolidate build and validation into deploy workflow"
```

---

## Task 2: Create New lighthouse.yml

**Files:**

- Create: `.github/workflows/lighthouse.yml`

**Step 1: Write the async Lighthouse workflow**

```yaml
name: Lighthouse

on:
  workflow_run:
    workflows: [Deploy]
    types: [completed]
  workflow_dispatch:
    inputs:
      url:
        description: 'URL to test (e.g., https://pikeandwest.com)'
        required: true
        type: string

concurrency:
  group: lighthouse-${{ github.event.workflow_run.head_branch || github.ref }}
  cancel-in-progress: true

jobs:
  prepare:
    name: Prepare
    if: github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    outputs:
      url: ${{ steps.get-url.outputs.url }}
      is-preview: ${{ steps.get-url.outputs.is-preview }}
      run-count: ${{ steps.get-url.outputs.run-count }}
    steps:
      - name: Get deployment URL
        id: get-url
        uses: actions/github-script@v7
        with:
          script: |
            if (context.eventName === 'workflow_dispatch') {
              core.setOutput('url', '${{ inputs.url }}');
              core.setOutput('is-preview', 'false');
              core.setOutput('run-count', '3');
              return;
            }

            // Get the deployment URL from the triggering workflow
            const runId = context.payload.workflow_run.id;
            const jobs = await github.rest.actions.listJobsForWorkflowRun({
              owner: context.repo.owner,
              repo: context.repo.repo,
              run_id: runId,
            });

            // Find the deploy job and extract URL from logs
            const deployJob = jobs.data.jobs.find(j => j.name === 'Deploy');
            if (!deployJob) {
              core.setFailed('Could not find Deploy job');
              return;
            }

            // Get artifacts from the workflow run
            const artifacts = await github.rest.actions.listWorkflowRunArtifacts({
              owner: context.repo.owner,
              repo: context.repo.repo,
              run_id: runId,
            });

            // For now, construct URL from branch name
            const branch = context.payload.workflow_run.head_branch;
            const isMain = branch === 'main';
            const url = isMain
              ? 'https://pikeandwest.com'
              : `https://${branch.replace(/[^a-z0-9-]/gi, '-')}.pikeandwest.pages.dev`;

            core.setOutput('url', url);
            core.setOutput('is-preview', isMain ? 'false' : 'true');
            core.setOutput('run-count', isMain ? '3' : '1');

  health-check:
    name: Health Check
    needs: prepare
    runs-on: ubuntu-latest
    timeout-minutes: 2
    steps:
      - name: Wait for site
        run: |
          URL="${{ needs.prepare.outputs.url }}"
          echo "Checking $URL..."
          for i in {1..12}; do
            if curl -sf "$URL" > /dev/null; then
              echo "Site is up!"
              exit 0
            fi
            echo "Attempt $i/12 failed, waiting 5s..."
            sleep 5
          done
          echo "Site failed to respond after 60s"
          exit 1

  audit:
    name: ${{ matrix.page.name }}
    needs: [prepare, health-check]
    runs-on: ubuntu-latest
    timeout-minutes: 5
    continue-on-error: true
    strategy:
      fail-fast: false
      matrix:
        page:
          - { name: 'Home', path: '/' }
          - { name: 'About', path: '/about/' }
          - { name: 'Blog', path: '/blog/' }
          - { name: 'Contact', path: '/contact/' }
          - { name: 'Gallery', path: '/gallery-application/' }
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          sparse-checkout: lighthouserc.json

      - name: Run Lighthouse
        id: lighthouse
        uses: treosh/lighthouse-ci-action@v12
        env:
          LHCI_BUILD_CONTEXT__CURRENT_HASH: ${{ github.event.workflow_run.head_sha || github.sha }}
          LHCI_ASSERT__ASSERTIONS__IS_CRAWLABLE: ${{ needs.prepare.outputs.is-preview == 'true' && 'off' || '' }}
        with:
          urls: ${{ needs.prepare.outputs.url }}${{ matrix.page.path }}
          configPath: ./lighthouserc.json
          uploadArtifacts: true
          temporaryPublicStorage: true
          runs: ${{ needs.prepare.outputs.run-count }}
          artifactName: lighthouse-${{ matrix.page.name }}

      - name: Save results
        run: |
          mkdir -p results
          echo '${{ steps.lighthouse.outputs.manifest }}' > results/${{ matrix.page.name }}.json
          echo '${{ steps.lighthouse.outputs.links }}' > results/${{ matrix.page.name }}-links.json

      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: lighthouse-${{ matrix.page.name }}
          path: results/
          retention-days: 30

  summary:
    name: Summary
    needs: [prepare, audit]
    if: always() && needs.prepare.result == 'success'
    runs-on: ubuntu-latest
    timeout-minutes: 2
    permissions:
      contents: write
      pull-requests: write
    steps:
      - name: Download results
        uses: actions/download-artifact@v4
        with:
          pattern: lighthouse-*
          path: results/
          merge-multiple: true

      - name: Generate summary
        id: analyze
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const path = require('path');

            const resultsDir = 'results';
            if (!fs.existsSync(resultsDir)) {
              console.log('No results directory found');
              return;
            }

            const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('.json') && !f.includes('-links'));

            let rows = [];
            let totalPerf = 0;
            let pageCount = 0;

            for (const file of files) {
              const pageName = file.replace('.json', '');
              const content = fs.readFileSync(path.join(resultsDir, file), 'utf8');

              if (!content || content.trim() === '' || content.trim() === 'undefined') {
                rows.push(`| ${pageName} | N/A | N/A | N/A | N/A |`);
                continue;
              }

              let manifest;
              try {
                manifest = JSON.parse(content);
              } catch (e) {
                rows.push(`| ${pageName} | Error | Error | Error | Error |`);
                continue;
              }

              const linksFile = path.join(resultsDir, `${pageName}-links.json`);
              let reportLink = '';

              if (fs.existsSync(linksFile)) {
                try {
                  const linksContent = fs.readFileSync(linksFile, 'utf8');
                  if (linksContent && linksContent.trim() !== '' && linksContent.trim() !== 'undefined') {
                    const links = JSON.parse(linksContent);
                    reportLink = Object.values(links)[0] || '';
                  }
                } catch (e) {}
              }

              if (manifest && manifest.length > 0) {
                const summary = manifest[0].summary || {};

                const getScore = (key) => {
                  const score = summary[key];
                  if (score === undefined || score === null) return 'N/A';
                  const pct = Math.round(score * 100);
                  const emoji = pct >= 90 ? '🟢' : pct >= 50 ? '🟠' : '🔴';
                  return `${emoji} ${pct}`;
                };

                const perf = summary.performance;
                if (perf !== undefined && perf !== null) {
                  totalPerf += Math.round(perf * 100);
                  pageCount++;
                }

                const pageLink = reportLink ? `[${pageName}](${reportLink})` : pageName;
                rows.push(`| ${pageLink} | ${getScore('performance')} | ${getScore('accessibility')} | ${getScore('best-practices')} | ${getScore('seo')} |`);
              }
            }

            const avgPerf = pageCount > 0 ? Math.round(totalPerf / pageCount) : 0;

            const summary = `## Lighthouse Report

| Page | Perf | A11y | Best Practices | SEO |
|------|------|------|----------------|-----|
${rows.join('\n')}

Average Performance: **${avgPerf}** | [Score Legend](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)
`;

            await core.summary.addRaw(summary).write();
            fs.writeFileSync('summary.md', summary);

            core.setOutput('avg-performance', avgPerf);

      - name: Comment on PR
        if: github.event.workflow_run.event == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');

            if (!fs.existsSync('summary.md')) {
              console.log('No summary file, skipping PR comment');
              return;
            }

            const body = fs.readFileSync('summary.md', 'utf8');
            if (!body || body.trim() === '') return;

            // Get PR number from the workflow run
            const runId = context.payload.workflow_run.id;
            const run = await github.rest.actions.getWorkflowRun({
              owner: context.repo.owner,
              repo: context.repo.repo,
              run_id: runId,
            });

            // Find associated PR
            const prs = await github.rest.pulls.list({
              owner: context.repo.owner,
              repo: context.repo.repo,
              head: `${context.repo.owner}:${run.data.head_branch}`,
              state: 'open',
            });

            if (prs.data.length === 0) {
              console.log('No open PR found for this branch');
              return;
            }

            const prNumber = prs.data[0].number;

            const { data: comments } = await github.rest.issues.listComments({
              issue_number: prNumber,
              owner: context.repo.owner,
              repo: context.repo.repo,
            });

            const botComment = comments.find(comment =>
              comment.user.type === 'Bot' && comment.body.includes('Lighthouse Report')
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

  badge:
    name: Update Badge
    needs: summary
    if: github.event.workflow_run.head_branch == 'main' || (github.event_name == 'workflow_dispatch' && contains(inputs.url, 'pikeandwest.com'))
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          ref: main

      - name: Download results
        uses: actions/download-artifact@v4
        with:
          pattern: lighthouse-*
          path: results/
          merge-multiple: true

      - name: Update badge
        run: |
          # Calculate average score from results
          TOTAL=0
          COUNT=0
          for f in results/*.json; do
            [[ "$f" == *-links.json ]] && continue
            [[ ! -f "$f" ]] && continue
            SCORE=$(jq -r '.[0].summary.performance // 0' "$f" 2>/dev/null || echo 0)
            if [[ "$SCORE" != "0" && "$SCORE" != "null" ]]; then
              SCORE_PCT=$(echo "$SCORE * 100" | bc | cut -d. -f1)
              TOTAL=$((TOTAL + SCORE_PCT))
              COUNT=$((COUNT + 1))
            fi
          done

          if [[ $COUNT -gt 0 ]]; then
            AVG=$((TOTAL / COUNT))
          else
            AVG=0
          fi

          # Determine color
          if [[ $AVG -ge 90 ]]; then
            COLOR="brightgreen"
          elif [[ $AVG -ge 50 ]]; then
            COLOR="yellow"
          else
            COLOR="red"
          fi

          # Write badge JSON
          mkdir -p .github/badges
          echo "{\"schemaVersion\":1,\"label\":\"lighthouse\",\"message\":\"${AVG}\",\"color\":\"${COLOR}\"}" > .github/badges/lighthouse.json

      - name: Commit badge
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .github/badges/
          git diff --staged --quiet || git commit -m "chore: update lighthouse badge [skip ci]"
          git push || echo "Nothing to push"
```

**Step 2: Verify YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/lighthouse.yml'))"`
Expected: No output (valid YAML)

**Step 3: Commit**

```bash
git add .github/workflows/lighthouse.yml
git commit -m "feat(ci): add async Lighthouse workflow triggered by deploy"
```

---

## Task 3: Delete Old Workflow Files

**Files:**

- Delete: `.github/workflows/build.yml`
- Delete: `.github/workflows/ci.yml`
- Delete: `.github/workflows/perf.yml`

**Step 1: Remove old files**

```bash
git rm .github/workflows/build.yml .github/workflows/ci.yml .github/workflows/perf.yml
```

**Step 2: Commit**

```bash
git commit -m "chore(ci): remove redundant workflow files

BREAKING: Removed build.yml, ci.yml, perf.yml
- build.yml: inlined into deploy.yml
- ci.yml: validation merged into deploy.yml
- perf.yml: replaced by lighthouse.yml (async)"
```

---

## Task 4: Test the New Workflows

**Step 1: Push to a test branch and verify**

```bash
git checkout -b refactor/consolidate-workflows
git push -u origin refactor/consolidate-workflows
```

**Step 2: Open PR and verify behavior**

Expected:

1. Deploy workflow runs: Build → Validate → Deploy (~2-3 min)
2. After Deploy completes, Lighthouse workflow triggers automatically
3. PR gets two comments: preview URL (fast) and Lighthouse report (later)
4. Deploy workflow shows "success" regardless of Lighthouse results

**Step 3: Verify GitHub UI shows only 2 workflows**

Go to: `https://github.com/<owner>/<repo>/actions`
Expected: Only "Deploy" and "Lighthouse" workflows visible

---

## Summary of Changes

| Before                   | After            | Savings            |
|--------------------------|------------------|--------------------|
| 4 workflow files         | 2 workflow files | -2 files           |
| 2 builds per push        | 1 build per push | -50% build time    |
| Lighthouse blocks deploy | Lighthouse async | Faster PR feedback |
| Confusing workflow list  | Clear naming     | Better DX          |

**Estimated CI minutes saved:** ~1-2 min per push (eliminating duplicate Hugo build)
