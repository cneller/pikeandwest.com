# ADR-005: Blog Editorial Styling Patterns

**Status:** Accepted
**Date:** 2026-01-22

## Context

Blog posts needed visual enhancements to:

1. Match the luxury, magazine-style aesthetic of Pike & West
2. Break up long-form content for better readability
3. Highlight key quotes and insights
4. Create visual hierarchy within articles

Research into editorial design best practices identified three high-impact features commonly used by luxury publications.

## Decision

Implement three editorial styling patterns:

1. **Drop Caps** - Large decorative first letters
2. **Pull Quotes** - Prominent excerpted text
3. **Decorative Section Dividers** - Elegant separators

### Drop Caps

Use CSS `::first-letter` pseudo-element (not span-based solutions) for accessibility:

- Screen readers read text naturally without "burping" on separated letters
- Applied automatically to first paragraph of blog content
- Manual class available for other paragraphs (`.drop-cap`)
- Disable option via `.no-drop-cap` class

### Pull Quotes

Use semantic HTML5 structure:

- `<aside>` element for non-essential content (proper for excerpts)
- `<blockquote>` inside for the quote text
- `<cite>` for attribution
- Hugo shortcode for easy authoring

### Section Dividers

Decorative `<hr>` elements with three style variants:

- `ornament` - Gold diamond symbol (default)
- `line` - Gradient gold line
- `flourish` - Lines fading from center
- Use `aria-hidden="true"` on decorative dividers

## Consequences

- **Positive:** Professional, magazine-quality appearance
- **Positive:** Accessible implementation (screen reader friendly)
- **Positive:** Easy to use via Hugo shortcodes
- **Positive:** Consistent with luxury brand positioning
- **Negative:** Authors need to learn shortcode syntax
- **Negative:** Requires restraint (overuse diminishes impact)
- **Neutral:** Adds ~230 lines to `_blog.scss`

## Implementation Details

### File Locations

| File | Purpose |
|------|---------|
| `assets/scss/_blog.scss` | All editorial styling |
| `layouts/shortcodes/pull-quote.html` | Pull quote shortcode |
| `layouts/shortcodes/divider.html` | Divider shortcode |
| `CLAUDE.md` | Usage documentation |

### Drop Caps CSS

```scss
// Accessibility: uses ::first-letter (no DOM modification)
.blog-post__content > p:first-of-type::first-letter {
  float: left;
  font-family: $font-display;
  font-size: 3.5em;
  line-height: 0.8;
  padding-right: 0.1em;
  color: $color-gold;
}
```

### Pull Quote Shortcode

```markdown
{{</* pull-quote author="Attribution" */>}}
Quote text here.
{{</* /pull-quote */>}}
```

### Divider Shortcode

```markdown
{{</* divider style="ornament" */>}}
```

### Usage Guidelines

| Feature | Frequency | Best Used For |
|---------|-----------|---------------|
| Drop caps | 1 per article (auto) | Article opening |
| Pull quotes | Every 3-5 paragraphs | Key insights, emotional moments |
| Dividers | 2-3 per article max | Major topic shifts |

## References

- [Smashing Magazine: Block Quotes and Pull Quotes](https://www.smashingmagazine.com/2008/06/block-quotes-and-pull-quotes-examples-and-good-practices/)
- [Adrian Roselli: Accessible Drop Caps](https://adrianroselli.com/2019/10/accessible-drop-caps.html)
- [CSS-Tricks: Drop Caps](https://css-tricks.com/snippets/css/drop-caps/)
- [Sara Soueidan: Not Your Typical Horizontal Rules](https://www.sarasoueidan.com/blog/horizontal-rules/)
