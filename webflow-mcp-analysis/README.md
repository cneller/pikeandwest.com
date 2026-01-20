# Webflow MCP Analysis

**Generated:** 2026-01-20
**Source:** Webflow MCP Designer API

This directory contains raw data extracted from the Pike & West Webflow site via the Webflow MCP (Model Context Protocol) server. This data serves as the authoritative source for the Hugo migration.

## Directory Structure

```text
webflow-mcp-analysis/
├── README.md                 # This file
├── gap-analysis.md           # Comprehensive gap analysis (Webflow vs Hugo)
├── site/
│   └── configuration.md      # Site ID, domains, settings
├── pages/
│   └── inventory.md          # All pages with IDs and status
├── collections/
│   └── README.md             # CMS collections (none found)
├── custom-code/
│   ├── README.md             # Custom code summary
│   ├── site-head.html        # Head injection code
│   └── site-body.html        # Body injection code
├── styles/
│   ├── design-variables.md   # Color, typography, spacing variables
│   └── all-classes-raw.json  # Raw style class export (large)
├── elements/
│   └── homepage-raw.json     # Raw homepage element tree (large)
└── assets/
    └── inventory.md          # All assets with URLs and metadata
```

## Key Files

### gap-analysis.md

The main deliverable - a comprehensive comparison of Webflow source vs Hugo implementation with:

- Priority-ranked fixes
- Code snippets for corrections
- Links to detailed audit reports

### styles/design-variables.md

Verified design tokens extracted directly from Webflow:

| Variable | Value     | CSS Variable |
|----------|-----------|--------------|
| PW Black | `#434345` | `--pw-black` |
| PW Gold  | `#aa6e0b` | `--pw-gold`  |
| PW Cream | `#fff7e1` | `--pw-cream` |

### custom-code/

GTM and tracking code injected into the Webflow site:

- **GTM Container:** `GTM-P8XR8C5S`
- **Adobe Typekit:** `jxr6fkv`

## Related Audit Documents

Detailed audits are in `docs/audits/`:

| Audit          | Findings                                 |
|----------------|------------------------------------------|
| SCSS Variables | Hugo SCSS correctly aligned with Webflow |
| Breakpoints    | Hamburger at 767px is intentional        |
| Typography     | Oswald font missing, Playfair unused     |
| Homepage       | All sections functional                  |

## How to Use This Data

### For Style Matching

1. Open `styles/all-classes-raw.json`
2. Search for the Webflow class name
3. Extract computed styles at each breakpoint
4. Compare with Hugo SCSS implementation

### For Element Structure

1. Open `elements/homepage-raw.json`
2. Trace element hierarchy
3. Map Webflow classes to Hugo BEM classes
4. Verify content matches

### For Asset Verification

1. Review `assets/inventory.md`
2. Cross-reference with Hugo `static/images/`
3. Ensure all required assets are present

## Extraction Method

Data was extracted using the Webflow MCP server tools:

- `data_sites_tool` - Site configuration
- `data_pages_tool` - Page inventory
- `data_cms_tool` - CMS collections
- `data_scripts_tool` - Custom code
- `style_tool` - Design variables and classes
- `element_tool` - Page element trees
- `asset_tool` - Asset inventory

The MCP Bridge App connected the Webflow Designer to enable Designer API access.

## Source

- **Site:** Pike & West (pikeandwest.com)
- **Site ID:** `65393d47a9c3933524124fcb`
- **MCP Server:** <https://mcp.webflow.com/sse>
- **Extraction Guide:** [Webflow MCP to Hugo Migration Guide](../docs/webflow-mcp-to-hugo-migration-guide.md)

## Notes

- Raw JSON files (`*-raw.json`) are large and not human-readable
- Use a JSON viewer or `jq` to explore them
- The gap analysis summarizes all findings in a digestible format
