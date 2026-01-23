# ADR-005: Blog Editorial Styling Patterns

**Status:** Accepted
**Date:** 2026-01-22
**Updated:** 2026-01-23

## Context

Blog posts needed visual enhancements to:

1. Match the luxury, magazine-style aesthetic of Pike & West
2. Break up long-form content for better readability
3. Highlight key quotes and insights
4. Create visual hierarchy within articles
5. Support planning guides with structured content (timelines, checklists)
6. Showcase client testimonials inline

Research into editorial design best practices (newspapers, magazines, luxury publications) identified features commonly used by professional publications.

## Decision

Implement a comprehensive editorial styling system with 11 components:

### Core Elements (Required)

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| Drop Caps | Decorative first letter | CSS `::first-letter` (accessible) |
| Pull Quotes | Highlight key insights | `{{< pull-quote >}}` shortcode |
| Section Dividers | Separate major sections | `{{< divider >}}` shortcode |

### Extended Elements (Content-Appropriate)

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| Standfirst | Intro summary paragraph | `{{< standfirst >}}` shortcode |
| Kicker | Category label above headline | `{{< kicker >}}` shortcode |
| Tip Box | Planning advice callouts | `{{< tip >}}` shortcode |
| Fact Box | Quick stats/specs sidebar | `{{< fact-box >}}` shortcode |
| Key Takeaways | End-of-article summary | `{{< key-takeaways >}}` shortcode |
| Timeline | Planning milestones | `{{< timeline >}}` shortcode |
| Sidebar Quote | Client testimonials | `{{< sidebar-quote >}}` shortcode |
| Numbered List | Styled step-by-step | `{{< numbered-list >}}` shortcode |

### Design Principles

1. **Accessibility First**: Use semantic HTML (`<aside>`, `<blockquote>`, `::first-letter`)
2. **Brand Consistency**: Gold accents, Le Mores display font, cream backgrounds
3. **Restraint**: Guidelines prevent overuse (e.g., 2-3 dividers max per article)
4. **Flexibility**: Floatable variants for sidebars, multiple style options

## Consequences

- **Positive:** Professional, magazine-quality appearance
- **Positive:** Accessible implementation (screen reader friendly)
- **Positive:** Easy to use via Hugo shortcodes
- **Positive:** Consistent with luxury brand positioning
- **Positive:** Supports diverse content types (planning guides, inspiration, news)
- **Negative:** Authors need to learn shortcode syntax
- **Negative:** Requires restraint (overuse diminishes impact)
- **Neutral:** Adds ~630 lines to `_blog.scss`

## Implementation Details

### File Locations

| File | Purpose |
|------|---------|
| `assets/scss/_blog.scss` | All editorial styling (~630 lines) |
| `layouts/shortcodes/*.html` | 11 shortcode templates |
| `.claude/agents/blog-editor.md` | Reusable formatting agent |
| `archetypes/blog.md` | Template with all examples |
| `CLAUDE.md` | Quick reference documentation |

### Shortcode Summary

```markdown
{{</* pull-quote author="Name" */>}}Quote{{</* /pull-quote */>}}
{{</* divider style="ornament|line|flourish" */>}}
{{</* standfirst */>}}Intro summary{{</* /standfirst */>}}
{{</* kicker */>}}Category{{</* /kicker */>}}
{{</* tip title="Pro Tip" */>}}Advice{{</* /tip */>}}
{{</* fact-box title="At a Glance" position="right" */>}}Stats{{</* /fact-box */>}}
{{</* key-takeaways */>}}Summary points{{</* /key-takeaways */>}}
{{</* timeline title="Planning" */>}}Milestones{{</* /timeline */>}}
{{</* sidebar-quote author="Name" event="Wedding 2025" */>}}Testimonial{{</* /sidebar-quote */>}}
{{</* numbered-list title="Steps" */>}}Numbered items{{</* /numbered-list */>}}
```

### Usage Guidelines

| Feature | Frequency | Best Used For |
|---------|-----------|---------------|
| Drop caps | 1 per article (auto) | Article opening |
| Pull quotes | 1-2 per 1000 words | Key insights, emotional moments |
| Dividers | 2-3 per article max | Major topic shifts |
| Standfirst | Long articles | Summary hook |
| Kicker | Categorized content | Topic labels |
| Tip boxes | Planning content | Actionable advice |
| Fact boxes | Venue-focused content | Specs, quick stats |
| Key takeaways | 1500+ word articles | End summary |
| Timelines | Planning guides | Milestones |
| Sidebar quotes | Throughout | Client testimonials |
| Numbered lists | Step-by-step content | Instructions |

### Automation

- **Blog Editor Agent**: `.claude/agents/blog-editor.md` provides formatting workflow
- **Commands**: `/blog-draft`, `/blog-outline`, `/content-audit` enforce styling
- **Archetype**: `archetypes/blog.md` includes all shortcode examples

## References

- [Smashing Magazine: Block Quotes and Pull Quotes](https://www.smashingmagazine.com/2008/06/block-quotes-and-pull-quotes-examples-and-good-practices/)
- [Adrian Roselli: Accessible Drop Caps](https://adrianroselli.com/2019/10/accessible-drop-caps.html)
- [CSS-Tricks: Drop Caps](https://css-tricks.com/snippets/css/drop-caps/)
- [Fiveable: Newspaper Layout Fundamentals](https://fiveable.me/editorial-design/unit-8/newspaper-layout-fundamentals/study-guide/ObFtrRuiCVJvMFt8)
- [Vev: Interactive Article Design](https://www.vev.design/blog/interactive-articles/)
