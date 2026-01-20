# Webflow MCP to Hugo Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Install the Webflow MCP server for this project, extract comprehensive site data, and audit the Hugo implementation against the source Webflow site.

**Architecture:** Project-scoped MCP configuration connects to Webflow's remote server via OAuth. MCP tools extract structured data (pages, elements, styles, assets) into `webflow-mcp-analysis/` folder. This data then drives a systematic audit of each Hugo partial against the source.

**Tech Stack:** Node.js 22+, Webflow MCP (remote via mcp-remote), Claude Code project settings

---

## Phase 1: Environment Setup

### Task 1.1: Upgrade Node.js to 22.3.0+

**Context:** The Webflow MCP requires Node.js 22.3.0+. Current version is v20.19.4.

**Step 1: Check current Node.js version manager**

Run: `which node && ls -la $(which node)`

This determines if using nvm, fnm, volta, or system Node.

**Step 2: Install Node.js 22 via your version manager**

If using nvm:

```bash
nvm install 22
nvm use 22
```

If using fnm:

```bash
fnm install 22
fnm use 22
```

If using Homebrew (system):

```bash
brew install node@22
brew link --overwrite node@22
```

**Step 3: Verify Node.js version**

Run: `node -v`
Expected: `v22.x.x` (22.3.0 or higher)

**Step 4: Create .nvmrc for project consistency**

Create file `.nvmrc` with content:

```text
22
```

This ensures consistent Node version for the project.

---

### Task 1.2: Create Webflow MCP Analysis Directory Structure

**Context:** MCP exports are structured data (JSON, markdown). Keep separate from static HTML export.

**Step 1: Create directory structure**

```bash
mkdir -p webflow-mcp-analysis/{site,pages,collections,styles,elements,assets,custom-code}
```

**Step 2: Create README for the directory**

Create `webflow-mcp-analysis/README.md`:

```markdown
# Webflow MCP Analysis Export

Structured data extracted from Pike & West Webflow site via MCP server.

## Directory Structure

- `site/` - Site configuration, locales, publish status
- `pages/` - Page metadata, URLs, SEO settings
- `collections/` - CMS collection schemas and items
- `styles/` - CSS classes with properties at each breakpoint
- `elements/` - Page element trees with hierarchy and attributes
- `assets/` - Asset inventory with URLs
- `custom-code/` - Site-wide and page-level custom code

## Date Generated

<!-- Updated automatically by extraction scripts -->
Last updated: [pending]

## Source

Site: Pike & West (pikeandwest.com)
MCP Server: https://mcp.webflow.com/sse
```

**Step 3: Add to .gitignore (optional - decide if tracking)**

If you want to track this data in git, skip this step.
If sensitive, add to `.gitignore`:

```text
webflow-mcp-analysis/
```

---

### Task 1.3: Configure Webflow MCP for This Project

**Context:** Project-scoped MCP configuration keeps this separate from global settings.

**Step 1: Create project .claude directory if needed**

```bash
mkdir -p .claude
```

**Step 2: Create project MCP settings**

Create `.claude/settings.json`:

```json
{
  "mcpServers": {
    "webflow": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.webflow.com/sse"]
    }
  }
}
```

**Step 3: Add to .gitignore**

Append to `.gitignore`:

```text
.claude/settings.local.json
```

Note: Track `.claude/settings.json` so team shares MCP config. Don't track `.claude/settings.local.json` (user overrides).

**Step 4: Commit the MCP configuration**

```bash
git add .claude/settings.json .nvmrc
git commit -m "chore: add Webflow MCP configuration for migration analysis"
```

---

### Task 1.4: Authenticate and Verify MCP Connection

**Context:** First MCP call triggers OAuth flow with Webflow.

**Step 1: Restart Claude Code session**

Exit and restart Claude Code to load the new MCP configuration:

```bash
exit  # or Ctrl+C
claude  # restart
```

**Step 2: Verify MCP is loaded**

Run: `/mcp`

Expected output should list `webflow` as an available MCP server.

**Step 3: Trigger OAuth authentication**

Ask Claude: "List all my Webflow sites"

This triggers the OAuth flow:

1. Browser opens to Webflow authorization page
2. Log in and authorize access to your sites
3. Return to Claude Code - connection is now active

**Step 4: Verify site access**

Expected output: List of Webflow sites you have access to, including Pike & West.

Note the **Site ID** for Pike & West - you'll need this for subsequent commands.

---

## Phase 2: Site Data Extraction

### Task 2.1: Extract Site Configuration

**Step 1: Get site details**

Prompt: "For the Pike & West site, get the complete site configuration including domains, locales, and publish status"

**Step 2: Save output**

Save the response to `webflow-mcp-analysis/site/configuration.md`

Include:

- Site ID
- Site name
- Primary domain
- All domains/subdomains
- Locale settings
- Last published date
- Timezone

---

### Task 2.2: Extract Page Inventory

**Step 1: List all pages**

Prompt: "List all pages on the Pike & West site with their URLs, slugs, SEO metadata, and any CMS bindings"

**Step 2: Save output**

Save to `webflow-mcp-analysis/pages/inventory.md`

Format as table:

| Page Name | Slug | URL | SEO Title | SEO Description | CMS Bound |
|-----------|------|-----|-----------|-----------------|-----------|

---

### Task 2.3: Extract CMS Collections (if any)

**Step 1: List collections**

Prompt: "List all CMS collections on Pike & West with their complete field schemas"

**Step 2: Save collection schemas**

For each collection, save to `webflow-mcp-analysis/collections/{collection-name}-schema.md`

Include:

- Collection name and slug
- All fields with types
- Validation rules
- Reference relationships

**Step 3: Export collection items**

Prompt: "Export all items from the [COLLECTION] collection with all field values"

Save to `webflow-mcp-analysis/collections/{collection-name}-items.json`

---

### Task 2.4: Extract Custom Code

**Step 1: Get site-wide custom code**

Prompt: "Show all site-wide custom code on Pike & West (head and body scripts)"

**Step 2: Get page-level custom code**

Prompt: "Show any page-level custom code for each page"

**Step 3: Save output**

Save to:

- `webflow-mcp-analysis/custom-code/site-head.html`
- `webflow-mcp-analysis/custom-code/site-body.html`
- `webflow-mcp-analysis/custom-code/page-{slug}.html` (for each page with custom code)

---

## Phase 3: Design System Extraction (Requires Designer Companion)

### Task 3.1: Connect Designer Companion App

**Context:** Element and style extraction requires Webflow Designer open with companion app.

**Step 1: Open Webflow Designer**

1. Log into Webflow
2. Open Pike & West project in Designer

**Step 2: Launch MCP Bridge App**

1. In Designer, press `E` to open Apps panel
2. Find "Webflow MCP Bridge App"
3. Click to launch and keep it running

**Step 3: Verify connection**

Prompt: "Can you access the Designer API for Pike & West?"

Expected: Confirmation that Designer API is connected.

---

### Task 3.2: Extract Design Variables

**Step 1: Get all design variables**

Prompt: "Get all design variables from Pike & West including color, spacing, and typography variables"

**Step 2: Save and compare**

Save to `webflow-mcp-analysis/styles/design-variables.md`

Format:

```markdown
## Color Variables
| Variable   | Value   | Usage        |
|------------|---------|--------------|
| --pw-black | #434345 | Primary text |
| --pw-gold  | #aa6e0b | Accent color |
| --pw-cream | #fff7e1 | Background   |

## Typography
...

## Spacing
...
```

**Important:** Compare with CLAUDE.md design system and note discrepancies.

Current CLAUDE.md says:

- Black: `#000000`
- Gold: `#C9A227`
- Cream: `#FFFDD0`

But webflow-export CSS shows:

- --pw-black: `#434345`
- --pw-gold: `#aa6e0b`
- --pw-cream: `#fff7e1`

The MCP extraction will confirm the authoritative values.

---

### Task 3.3: Extract All Styles/Classes

**Step 1: Get all styles with CSS properties**

Prompt: "List all styles (classes) on Pike & West with their CSS properties at each breakpoint (desktop, tablet 991px, mobile landscape 767px, mobile portrait 479px)"

**Step 2: Save output**

Save to `webflow-mcp-analysis/styles/all-classes.md`

Format each class:

```markdown
### .hero-header-section

**Desktop:**
- display: flex
- flex-direction: column
- ...

**Tablet (max-width: 991px):**
- ...

**Mobile Landscape (max-width: 767px):**
- ...

**Mobile Portrait (max-width: 479px):**
- ...
```

---

### Task 3.4: Extract Page Element Trees

**Step 1: Extract homepage elements**

Prompt: "Get the complete element tree for the Pike & West homepage with element types, hierarchy, applied classes, custom attributes, and text content"

**Step 2: Save output**

Save to `webflow-mcp-analysis/elements/homepage.md`

Format as nested structure showing parent/child relationships.

**Step 3: Repeat for each page**

- `webflow-mcp-analysis/elements/contact.md`
- `webflow-mcp-analysis/elements/about.md`
- `webflow-mcp-analysis/elements/gallery-application.md`

---

### Task 3.5: Extract Asset Inventory

**Step 1: Get all assets**

Prompt: "List all assets on Pike & West with their URLs, dimensions, and where they're used"

**Step 2: Save output**

Save to `webflow-mcp-analysis/assets/inventory.md`

Format:

| Asset Name | URL | Dimensions | Used On |
|------------|-----|------------|---------|

**Step 3: Verify against existing images**

Compare with `webflow-export/images/` to ensure we have all assets.

---

## Phase 4: Hugo Audit Against Webflow Source

### Task 4.1: Update Design System Documentation

**Context:** MCP extraction revealed actual Webflow values. Update CLAUDE.md to match.

**Step 1: Compare design variables**

Read `webflow-mcp-analysis/styles/design-variables.md` and compare with CLAUDE.md color palette.

**Step 2: Update CLAUDE.md color palette**

Modify the Color Palette section in CLAUDE.md to use correct Webflow values:

```markdown
### Color Palette

| Color    | Hex       | CSS Variable | Usage                        |
|----------|-----------|--------------|------------------------------|
| PW Black | `#434345` | --pw-black   | Primary text, headers        |
| Gold     | `#aa6e0b` | --pw-gold    | Accents, buttons, highlights |
| Cream    | `#fff7e1` | --pw-cream   | Backgrounds, cards           |
| White    | `#FFFFFF` | --white      | Base background              |
| Black    | `#000000` | --black      | Pure black accents           |
```

**Step 3: Update typography section**

Webflow uses:

- Le Mores Collection Serif (headlines)
- Raleway (body)

Not Oswald and Montserrat as currently documented.

**Step 4: Commit design system updates**

```bash
git add CLAUDE.md
git commit -m "docs: update design system with verified Webflow values"
```

---

### Task 4.2: Audit Homepage Sections

**Context:** Compare Hugo homepage partials against Webflow element trees.

**Step 1: Create audit checklist**

Create `docs/audits/2026-01-19-homepage-audit.md`:

```markdown
# Homepage Section Audit

Comparing Hugo partials against Webflow MCP element extraction.

## Hero Section
- [ ] Element structure matches
- [ ] Classes/styles match
- [ ] Content matches
- [ ] Responsive behavior matches

## Venue Gallery Section
- [ ] Element structure matches
- [ ] Grid/layout matches
- [ ] Image sizes match
- [ ] Hover effects match

## Event Types Section
- [ ] Element structure matches
- [ ] Card layout matches
- [ ] Typography matches

## About Section
- [ ] Element structure matches
- [ ] Layout matches
- [ ] Image positioning matches

## CTA Banner Section
- [ ] Element structure matches
- [ ] Button styling matches
- [ ] Text content matches

## Footer
- [ ] Element structure matches
- [ ] Link structure matches
- [ ] Social icons match
```

**Step 2: Audit hero section**

Compare:

- `webflow-mcp-analysis/elements/homepage.md` (hero section)
- `layouts/partials/hero.html`
- `assets/scss/` hero styles

Document discrepancies in audit file.

**Step 3: Continue for each section**

Work through each section systematically, documenting:

- Structural differences
- Missing elements
- Style discrepancies
- Content differences

---

### Task 4.3: Audit SCSS Variables

**Context:** Ensure Hugo SCSS variables match Webflow extracted values.

**Step 1: Read current SCSS variables**

Check `assets/scss/_variables.scss` (or equivalent).

**Step 2: Compare with MCP extraction**

Compare against `webflow-mcp-analysis/styles/design-variables.md`.

**Step 3: Update SCSS variables**

Ensure all CSS custom properties match Webflow source:

```scss
// Colors - verified against Webflow MCP extraction
:root {
  --pw-black: #434345;
  --pw-gold: #aa6e0b;
  --pw-cream: #fff7e1;
  --white: white;
  --black: black;
}
```

**Step 4: Commit SCSS updates**

```bash
git add assets/scss/
git commit -m "fix(styles): align CSS variables with Webflow source values"
```

---

### Task 4.4: Audit Responsive Breakpoints

**Context:** Ensure Hugo breakpoints match Webflow exactly.

**Step 1: Extract Webflow breakpoint styles**

From `webflow-mcp-analysis/styles/all-classes.md`, document:

- What changes at 991px
- What changes at 767px
- What changes at 479px

**Step 2: Compare with Hugo SCSS**

Check `assets/scss/_variables.scss` breakpoint definitions match.

**Step 3: Document discrepancies**

Add to audit file any breakpoint behavior differences.

---

### Task 4.5: Audit Typography

**Context:** Ensure fonts and type scale match.

**Step 1: Verify font files**

Compare:

- `webflow-export/fonts/` contents
- `static/fonts/` or font loading in Hugo

**Step 2: Verify type scale**

From MCP extraction, document:

- h1: font-family, size, weight, line-height
- h2: ...
- h3: ...
- body: ...

**Step 3: Compare with Hugo SCSS**

Check typography styles match extracted values.

---

## Phase 5: Gap Analysis and Remediation Plan

### Task 5.1: Compile Gap Analysis

**Step 1: Create gap analysis document**

Create `docs/audits/2026-01-19-gap-analysis.md`:

```markdown
# Webflow to Hugo Gap Analysis

## Summary

| Category   | Matches | Discrepancies | Missing |
|------------|---------|---------------|---------|
| Colors     |         |               |         |
| Typography |         |               |         |
| Spacing    |         |               |         |
| Layout     |         |               |         |
| Components |         |               |         |

## Critical Gaps (Must Fix)

1. [Gap description with file references]
2. ...

## Minor Gaps (Nice to Fix)

1. ...

## Cosmetic Differences (Acceptable)

1. ...
```

**Step 2: Prioritize gaps**

Categorize each gap:

- **Critical:** Visually broken or functionally wrong
- **Minor:** Noticeable but not breaking
- **Cosmetic:** Pixel-level differences, acceptable

**Step 3: Create remediation tickets**

For each critical gap, document:

- What's wrong
- Which files need changes
- Expected fix

---

### Task 5.2: Update webflow-mcp-analysis README

**Step 1: Update README with generation date**

Edit `webflow-mcp-analysis/README.md` to update:

- Last updated date
- Summary of extracted data
- Link to gap analysis

**Step 2: Commit all extraction data**

```bash
git add webflow-mcp-analysis/
git add docs/audits/
git commit -m "docs: add Webflow MCP analysis and Hugo audit results"
```

---

## Verification Checklist

- [ ] Node.js 22+ installed and verified
- [ ] .nvmrc created for project consistency
- [ ] MCP configuration added to `.claude/settings.json`
- [ ] OAuth authentication completed with Webflow
- [ ] Site configuration extracted
- [ ] All pages inventoried
- [ ] CMS collections documented (if any)
- [ ] Custom code extracted
- [ ] Designer companion connected
- [ ] Design variables extracted
- [ ] All CSS classes documented with breakpoint values
- [ ] Page element trees extracted for all pages
- [ ] Asset inventory completed
- [ ] CLAUDE.md design system updated
- [ ] Homepage sections audited
- [ ] SCSS variables aligned with Webflow
- [ ] Responsive breakpoints verified
- [ ] Typography audited
- [ ] Gap analysis completed
- [ ] All changes committed

---

## Resources

- [Webflow MCP Documentation](https://developers.webflow.com/mcp/reference/overview)
- [Webflow MCP GitHub](https://github.com/webflow/mcp-server)
- Migration guide: `docs/webflow-mcp-to-hugo-migration-guide.md`
- CSS mapping: `docs/webflow-to-hugo-css-mapping.md`

---

_Plan created: 2026-01-19_
