# Sitepins Documentation Extraction Summary

**Date:** 2026-01-23
**Status:** Complete
**Scope:** Comprehensive technical reference compiled from Sitepins official documentation

---

## What Was Created

This extraction project consolidated Sitepins documentation into two comprehensive resources:

### 1. Comprehensive Technical Guide

**File:** `/docs/research/sitepins-comprehensive-guide.md`

A complete technical reference covering:

- **Overview & Getting Started** - What Sitepins is, key characteristics, supported formats, registration and setup
- **Site Configuration** - `.sitepins.json` format with all configuration options explained
- **Content Schemas** - Complete schema structure, field types, validation, inheritance patterns, and examples
- **Content Snippets** - Creating, managing, and using reusable code blocks in the editor
- **Media Library Management** - Organization, naming conventions, responsive images, CDN integration
- **Sidebar Customization** - Configuration, organization patterns, quick navigation tips
- **AI Content Tools** - Available AI features, setup, usage examples, cost management, best practices
- **Developer Configuration** - Deep dive into `.sitepins.json`, environment variables, validation rules
- **Integration Patterns** - Real-world Hugo + Sitepins patterns for blog posts, data files, multi-section pages
- **Best Practices & Tips** - Content organization, schema design, SEO, performance, workflow, troubleshooting
- **Resources & References** - Official documentation links, Hugo integration, related tools, community

**Page Count:** 30 pages (1,930 lines)
**Key Sections:** 10 major sections with subsections
**Code Examples:** 50+ JSON, YAML, Go Template examples
**Tables:** 20+ reference tables

### 2. CLAUDE.md Integration

**File:** `/CLAUDE.md`

Added comprehensive CMS section including:

- Sitepins overview with key features
- Quick start guide for Pike & West integration
- Links to comprehensive documentation
- Planned CMS feature timeline
- Status tracking

---

## What's Covered in the Comprehensive Guide

### Configuration Options

All `.sitepins.json` configuration fields documented with:

- Type information
- Default values
- Descriptions
- Use cases
- Examples

**Sections:**

- Content configuration (root, fmType, ignorePatterns)
- Media configuration (root, uploadPath, cdnUrl, maxFileSize)
- Editor settings (theme, fontSize, lineNumbers)
- Preview settings (enabled, url, deployPreview)
- Git configuration (provider, branch, commitMessages)
- AI configuration (enabled, apiKey, model, maxTokens)
- Sidebar configuration (sections, icons, collapsed states)

### Field Types & Properties

Complete reference for all Sitepins field types:

| Type          | Properties                                 | Use Cases                       |
|---------------|--------------------------------------------|---------------------------------|
| Text          | maxLength, minLength, pattern, placeholder | Titles, short fields            |
| Textarea      | rows, maxLength                            | Descriptions, longer content    |
| Number        | min, max, step, default                    | Counts, prices, ordering        |
| Boolean       | default, description                       | Toggles, feature flags          |
| Date/DateTime | default, validation                        | Publication dates, timestamps   |
| Select        | options array, default                     | Categories, status, enums       |
| Array         | items, minItems, maxItems                  | Tags, lists                     |
| Object        | fields array                               | Nested structures, complex data |

All with:

- Property tables
- JSON examples
- Validation patterns
- Default value guidance

### Content Schemas

Detailed documentation on:

- Schema location and structure (`.sitepins/schema/` directory)
- Complete schema anatomy with all possible properties
- Supported field types with property tables
- Field properties (required, default, placeholder, help, etc.)
- Schema inheritance and folder structure patterns
- Real-world example schemas for:
  - Blog posts
  - Static pages
  - Event listings
  - Author information

### Content Snippets

Complete guide to snippets including:

- Snippet location (`.sitepins/snippet/`)
- Complete snippet JSON structure
- Field properties for dynamic templates
- Built-in snippet examples:
  - Contact CTA
  - Image gallery
  - Pull quotes
  - Tip boxes
- How to create and manage snippets
- How editors use snippets
- Linking snippets to specific schemas

### Media Management

Comprehensive media handling guide:

- Folder organization structure
- Image naming conventions
- Image formats (JPG, PNG, WebP, AVIF, SVG)
- Responsive image handling
- Hugo integration patterns for responsive images
- External CDN integration (ImageKit example)
- Media library optimization tips
- Alt text documentation patterns

### AI Content Tools

Complete AI integration guide:

- Available AI features with use cases:
  - Content generation from outlines
  - Meta description auto-generation
  - Alt text generation
  - Content expansion
  - Summarization
  - Title suggestions
  - Tone adjustment

- Setup instructions:
  - OpenAI API key configuration
  - GitHub Secrets storage
  - Environment variable reference

- Using AI tools in editor:
  - Step-by-step for content generation
  - Meta description generation workflow
  - Alt text generation
  - Tone adjustment process

- Cost management:
  - Per-token pricing for different models
  - Budget tips and spending alerts

### Integration Patterns

Four complete integration patterns with:

**Pattern 1: Blog Post Workflow**

- File structure for date-organized posts
- Complete schema with all blog fields
- Hugo template for rendering

**Pattern 2: Data File Management**

- YAML data file structure
- Hugo template to render data
- Sitepins editing workflow

**Pattern 3: Multi-Section Pages**

- Front matter with section toggles
- Hugo template with conditional sections
- Schema for easy editing

**Pattern 4: Structured Content with Arrays**

- Event listings with array of items
- Hugo template iterating arrays
- Array schema with object items

### Best Practices

Comprehensive best practices covering:

1. **Content Organization**
   - Naming conventions (kebab-case files, snake_case keys)
   - Folder hierarchy strategies
   - Data file structuring
   - Image organization

2. **Schema Design**
   - Descriptive labels with context
   - Meaningful defaults
   - Using select for controlled values
   - Validation patterns and error messages

3. **SEO Best Practices**
   - Meta description patterns
   - Image alt text requirements
   - URL slug strategies
   - Schema markup examples

4. **Performance**
   - Image optimization before upload
   - Responsive images in Hugo
   - Content structure for performance
   - Git commit frequency

5. **Workflow**
   - Draft before publishing
   - Preview testing strategy
   - Content review checklist
   - Scheduled publishing approach

### Troubleshooting

Common issues and solutions table:

- Schema not appearing → Verify file path matches folder structure
- Changes not showing → Check preview URL configuration
- Images not uploading → Verify media folder path and permissions
- Snippets not inserting → Check snippet shortcode syntax
- AI tools not working → Verify OpenAI API key in GitHub Secrets
- Commits not appearing → Check Git branch configuration

### Integration Checklist

Ready-to-use checklist for implementing Sitepins:

- [ ] .sitepins.json created with paths
- [ ] Schemas created for each content type
- [ ] Snippets created for shortcodes
- [ ] Sidebar sections configured
- [ ] Preview URL configured
- [ ] OpenAI API key stored in GitHub Secrets
- [ ] User roles assigned
- [ ] Team trained on workflow
- [ ] Backup strategy documented
- [ ] Publishing workflow documented

---

## How to Use This Documentation

### For Quick Reference

1. **Getting Started with Sitepins:**
   - Read "Overview & Getting Started" section
   - Follow the 5-step Quick Start in CLAUDE.md

2. **Setting Up Schemas:**
   - Find your content type in "Integration Patterns"
   - Copy the schema example
   - Customize field names and validation

3. **Creating Snippets:**
   - See "Content Snippets" section
   - Find snippet examples that match your shortcodes
   - Adapt template and fields for your use case

4. **Configuring Site:**
   - Use "Complete Configuration Reference" in Site Configuration section
   - Copy provided `.sitepins.json` example
   - Fill in your specific paths and settings

### For Deep Dives

1. **Understanding Field Types:**
   - See "Supported Field Types" table
   - Review property tables for your field type
   - Look at JSON examples in complete schema reference

2. **Optimization:**
   - See "Best Practices & Tips" section
   - Link to "[Sitepins Optimization Plan](../sitepins-optimization-plan.md)" for integration roadmap

3. **Advanced Features:**
   - AI content tools setup in "AI Content Tools"
   - External CDN integration in "Media Library Management"
   - Developer configuration in "Developer Configuration"

4. **Hugo Integration:**
   - See "Integration Patterns" for complete working examples
   - Check responsive image patterns in "Media Library Management"

---

## File Locations

All documentation is located in `/Users/colinneller/Projects/pikeandwest.com/`:

| File                                            | Purpose                                              |
|-------------------------------------------------|------------------------------------------------------|
| `docs/research/sitepins-comprehensive-guide.md` | Complete technical reference (30 pages)              |
| `docs/research/sitepins-optimization-plan.md`   | Integration strategy and phases (previously created) |
| `docs/research/markdown-cms-page-building.md`   | CMS comparison and patterns (previously created)     |
| `CLAUDE.md`                                     | Project guidelines with CMS section (updated)        |

---

## Quick Stats

| Metric                   | Value |
|--------------------------|-------|
| Total Pages              | 30    |
| Total Lines              | 1,930 |
| Code Examples            | 50+   |
| Reference Tables         | 20+   |
| Configuration Fields     | 30+   |
| Field Types              | 8     |
| Integration Patterns     | 4     |
| Best Practice Categories | 5     |
| Common Issues Covered    | 6     |

---

## Key Takeaways for Pike & West

### Sitepins Advantages for This Project

1. **Zero Configuration** - Auto-detects `content/`, `data/`, `static/images/` folders
2. **Git-First** - All changes committed to GitHub, perfect for version control
3. **AI Integration** - Can generate meta descriptions, alt text, blog content
4. **Flexible** - Supports Markdown, JSON, YAML, TOML formats
5. **No Installation** - Cloud-based, accessible from any browser

### Recommended First Steps

1. Create `.sitepins.json` in repository root with:

   ```json
   {
     "content": { "root": "content" },
     "media": { "root": "static/images" },
     "data": { "root": "data" }
   }
   ```

2. Create schemas for:
   - `.sitepins/schema/blog.json` for blog posts
   - `.sitepins/schema/pages.json` for static pages
   - Optionally `.sitepins/schema/events.json` for events

3. Create snippets for common shortcodes:
   - Pull quotes
   - Tip boxes
   - Image galleries
   - CTAs

4. Set up GitHub Secrets for OpenAI API key (optional)

### Integration with Existing Architecture

Sitepins fits perfectly with Pike & West's current setup:

- **Content files** already in `content/` (blog posts, pages)
- **Data files** already in `data/` (hero, events, about sections)
- **Images** already in `static/images/`
- **Hugo structure** already supports both Markdown and data-driven content
- **Git workflow** already established

No restructuring needed - Sitepins works with the existing architecture.

---

## Next Steps

1. **Review** - Read through the comprehensive guide sections relevant to your needs
2. **Plan** - Use the integration checklist to plan Sitepins setup
3. **Implement** - Follow the quick start in CLAUDE.md when ready
4. **Reference** - Use this guide as the source of truth for all Sitepins questions

---

## Document Information

- **Compiled From:** Official Sitepins documentation at <https://docs.sitepins.com/> and <https://developer.sitepins.com/>
- **Extraction Date:** 2026-01-23
- **Format:** Markdown with tables, code examples, and cross-references
- **Audience:** Pike & West development team, content editors, DevOps engineers
- **Maintenance:** Update when Sitepins releases new features or APIs change
