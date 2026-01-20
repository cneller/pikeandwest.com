# Project Cleanup Audit - 2026-01-20

> Review this document and check the boxes for items you want to remove.
> After review, we'll execute the removals for all checked items.

## Instructions

1. Review each section below
2. Check `[ ]` → `[x]` for files you want to remove
3. For partial removals, line numbers are provided
4. Save this file when done
5. We'll execute the cleanup based on your selections

---

## Phase 1: Completed Hamburger Plans (Recommended: Remove All)

These plans have been fully implemented. Commits are in git history.

| Remove? | File                                                     | Reason                                               |
|---------|----------------------------------------------------------|------------------------------------------------------|
| - [x]   | `docs/plans/2026-01-20-hamburger-3d-flip.md`             | Implemented: commits `06cd062`, `8c69811`, `592fe29` |
| - [x]   | `docs/plans/2026-01-20-hamburger-enhanced-animations.md` | Implemented: commits `e96af22`, `2e40934`, `db4fc47` |
| - [x]   | `docs/plans/2026-01-20-hamburger-menu-animation.md`      | Implemented: commits `21a5783`, `73b5c59`, `dca3c03` |
| - [x]   | `docs/plans/2026-01-19-header-hamburger-breakpoint.md`   | Implemented: commits `77e8877`, `b1b8ff7`            |
| - [x]   | `docs/plans/2026-01-20-close-menu-on-resize.md`          | Implemented: commit `9bf23c4`                        |

---

## Phase 2: Completed Hero & Header Plans (Recommended: Remove All)

| Remove? | File                                               | Reason                                               |
|---------|----------------------------------------------------|------------------------------------------------------|
| - [ ]   | `docs/plans/2026-01-20-hero-webflow-parity.md`     | Implemented: commits `51ab006`, `f18ec69`, `e39d305` |
| - [x]   | `docs/plans/2026-01-19-sticky-header-migration.md` | Implemented: commits `a48d220`, `d13aac8`, `258946a` |

---

## Phase 3: Legacy Infrastructure Plans (Recommended: Remove All)

Setup work completed long ago. Current state is production-ready.

| Remove? | File                                                          | Reason                                                               |
|---------|---------------------------------------------------------------|----------------------------------------------------------------------|
| - [ ]   | `docs/plans/2025-01-15-backstopjs-visual-regression-skill.md` | Skill now exists in `~/.claude/skills/backstopjs-visual-regression/` |
| - [x]   | `docs/plans/2025-01-15-hugo-migration.md`                     | High-level plan from before project started; migration complete      |
| - [x]   | `docs/plans/2025-01-15-visual-regression-iteration.md`        | Generic visual regression guidance; superseded                       |
| - [ ]   | `docs/plans/2025-01-16-cloudflare-pages-github-actions.md`    | Deployment setup complete; GitHub Actions workflow is live           |

---

## Phase 4: Early January Plans (Superseded by Audits)

These early plans have been replaced by the 2026-01-20 audit reports.

| Remove? | File                                                    | Reason                                                         |
|---------|---------------------------------------------------------|----------------------------------------------------------------|
| - [x]   | `docs/plans/2026-01-15-style-comparison-design.md`      | Covered by `docs/audits/2026-01-20-*` reports                  |
| - [x]   | `docs/plans/2026-01-16-data-file-migration.md`          | Data files implemented; `data/` directory complete             |
| - [x]   | `docs/plans/2026-01-16-homepage-style-sync.md`          | Superseded by newer visual parity audits                       |
| - [x]   | `docs/plans/2026-01-16-webflow-scss-audit-alignment.md` | Superseded by `docs/audits/2026-01-20-scss-variables-audit.md` |
| - [x]   | `docs/plans/2026-01-16-sitepins-cms-preparation.md`     | CMS prep not currently active                                  |
| - [ ]   | `docs/plans/2026-01-19-webflow-mcp-hugo-migration.md`   | MCP extraction complete; results in `webflow-mcp-analysis/`    |

---

## Phase 5: Blog Implementation Plans (Review Needed)

Check if blog is fully complete before removing.

| Remove? | File                                                | Reason                     |
|---------|-----------------------------------------------------|----------------------------|
| - [ ]   | `docs/plans/2026-01-19-blog-implementation.md`      | Blog implemented and live  |
| - [ ]   | `docs/plans/2026-01-19-blog-hero-implementation.md` | Blog hero section complete |

---

## Phase 6: Analytics Plans (Review Needed)

These may still be useful for GA4/GTM verification. Check `docs/next-steps.md` blocking tasks.

| Remove? | File                                                            | Reason                       |
|---------|-----------------------------------------------------------------|------------------------------|
| - [ ]   | `docs/plans/2026-01-19-cloudflare-deployment-ga4-testing.md`    | Deployment/GA4 testing guide |
| - [ ]   | `docs/plans/2026-01-19-cross-domain-tracking-implementation.md` | Cross-domain setup reference |
| - [ ]   | `docs/plans/2026-01-19-tickettailor-ga4-integration.md`         | Ticket tracking integration  |

---

## Phase 7: Active Visual Parity Plans (Likely Keep)

These appear to be ongoing work. Remove only if visual parity is complete.

| Remove? | File                                                        | Reason                        |
|---------|-------------------------------------------------------------|-------------------------------|
| - [ ]   | `docs/plans/2026-01-20-section-by-section-visual-parity.md` | Active visual regression work |
| - [ ]   | `docs/plans/2026-01-20-visual-parity-fixes.md`              | Active visual parity fixes    |
| - [ ]   | `docs/plans/2026-01-20-webflow-parity-non-homepage.md`      | Non-homepage parity work      |

---

## Phase 8: Untracked Files (For Reference Only)

These untracked files are **in active use** and should be committed, not removed:

| Status | File                           | Reason                                                 |
|--------|--------------------------------|--------------------------------------------------------|
| KEEP   | `assets/scss/_animations.scss` | Imported in `main.scss:30` - commit this, don't remove |

**Note:** The animations file is used for hamburger menu animations. It should be added to git, not deleted.

---

## Files to KEEP (No Action Required)

These files are actively referenced or provide ongoing value:

### Core Documentation

- `docs/next-steps.md` - Active project tracker (referenced in CLAUDE.md)
- `docs/webflow-to-hugo-css-mapping.md` - CSS mapping reference
- `docs/webflow-mcp-to-hugo-migration-guide.md` - Migration process reference
- `docs/cross-domain-tracking-verification.md` - Analytics verification

### Analytics Documentation

- `docs/analytics/README.md` - GTM/GA4 strategy
- `docs/analytics/implementation-guide.md` - Implementation reference
- `docs/analytics/monitoring-checklist.md` - Operational checklist

### Site Analysis

- `docs/site-analysis/current-site-documentation.md` - Original site reference

### Recent Audits (2026-01-20)

- `docs/audits/2026-01-20-homepage-audit.md`
- `docs/audits/2026-01-20-scss-variables-audit.md`
- `docs/audits/2026-01-20-breakpoints-audit.md`
- `docs/audits/2026-01-20-typography-audit.md`

### Webflow MCP Analysis (Reference Corpus)

- `webflow-mcp-analysis/` - Entire directory kept for reference

### Claude Code Infrastructure

- `.claude/commands/` - Custom commands
- `.claude/agents/` - Sub-agents
- `.claude/skills/` - Project skills

---

## Summary

| Phase                    | Files  | Recommendation |
|--------------------------|--------|----------------|
| 1. Hamburger Plans       | 5      | Remove all     |
| 2. Hero/Header Plans     | 2      | Remove all     |
| 3. Legacy Infrastructure | 4      | Remove all     |
| 4. Early January Plans   | 6      | Remove all     |
| 5. Blog Plans            | 2      | Review first   |
| 6. Analytics Plans       | 3      | Review first   |
| 7. Visual Parity Plans   | 3      | Likely keep    |
| 8. Untracked Files       | 0      | N/A (keep)     |
| **Total Candidates**     | **25** |                |

**Conservative removal (Phases 1-4):** 17 files
**Aggressive removal (Phases 1-6):** 22 files

---

## Execution

After reviewing, save this file and confirm you're ready. I'll then:

1. Remove all checked files
2. Update any references in `docs/next-steps.md` if needed
3. Create a summary of what was removed
