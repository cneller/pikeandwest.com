# Blog Editor Agent

A reusable agent for formatting Pike & West blog posts with consistent editorial styling.

## Purpose

Apply magazine-style visual enhancements to blog content, ensuring every post meets Pike & West's luxury aesthetic standards. This agent can:

1. **Format new drafts** with all required editorial elements
2. **Retrofit existing posts** with missing styling components
3. **Audit posts** for editorial styling compliance
4. **Suggest improvements** for visual engagement

## When to Use

- Creating a new blog post
- Editing an existing post
- Reviewing content before publication
- Retrofitting older posts with new styling features

## Editorial Styling Checklist

### Required Elements

Every blog post MUST include:

| Element | Shortcode | Frequency |
|---------|-----------|-----------|
| Drop cap | Automatic (first paragraph) | 1 per post |
| Pull quotes | `{{< pull-quote >}}` | 1-2 per 1000 words |
| Section dividers | `{{< divider >}}` | 2-3 per post |

### Recommended Elements

Include when appropriate to content:

| Element | Shortcode | When to Use |
|---------|-----------|-------------|
| Standfirst | `{{< standfirst >}}` | Long articles needing summary |
| Kicker | `{{< kicker >}}` | Categorized content |
| Tip box | `{{< tip >}}` | Planning advice, pro tips |
| Fact box | `{{< fact-box >}}` | Venue specs, quick stats |
| Key takeaways | `{{< key-takeaways >}}` | End of long articles |
| Timeline | `{{< timeline >}}` | Planning guides, milestones |
| Sidebar quote | `{{< sidebar-quote >}}` | Testimonials, client praise |
| Numbered list | `{{< numbered-list >}}` | Step-by-step instructions |

## Shortcode Reference

### Pull Quote
```markdown
{{< pull-quote >}}
Highlighted text from the article.
{{< /pull-quote >}}

{{< pull-quote author="Attribution" >}}
Quote with attribution.
{{< /pull-quote >}}

{{< pull-quote position="right" >}}
Floated to right on desktop.
{{< /pull-quote >}}
```

### Section Divider
```markdown
{{< divider >}}                    <!-- Gold diamond (default) -->
{{< divider style="line" >}}       <!-- Gradient gold line -->
{{< divider style="flourish" >}}   <!-- Fading lines from center -->
```

### Standfirst (Deck)
```markdown
{{< standfirst >}}
Bold intro paragraph that summarizes the article and hooks readers.
{{< /standfirst >}}
```

### Kicker
```markdown
{{< kicker >}}Planning Tips{{< /kicker >}}
# Article Headline Here
```

### Tip Box
```markdown
{{< tip >}}
Book your venue 12-18 months in advance for peak season.
{{< /tip >}}

{{< tip title="Insider Tip" >}}
Ask about weekday rates for savings.
{{< /tip >}}
```

### Fact Box
```markdown
{{< fact-box title="At a Glance" >}}
- **Capacity:** 150 seated, 200 standing
- **Square Feet:** 4,500
- **Catering:** In-house or external
{{< /fact-box >}}

{{< fact-box title="Quick Facts" position="right" >}}
Floated sidebar version.
{{< /fact-box >}}
```

### Key Takeaways
```markdown
{{< key-takeaways >}}
- Main point one
- Main point two
- Main point three
{{< /key-takeaways >}}
```

### Timeline
```markdown
{{< timeline title="Planning Timeline" >}}
- **12-18 months:** Book venue and caterer
- **9-12 months:** Send save-the-dates
- **6-9 months:** Finalize guest list
{{< /timeline >}}
```

Or with explicit items:
```markdown
{{< timeline >}}
{{< timeline-item time="12-18 months" >}}Book venue and caterer{{< /timeline-item >}}
{{< timeline-item time="9-12 months" >}}Send save-the-dates{{< /timeline-item >}}
{{< timeline-item time="6-9 months" done="true" >}}Finalize guest list{{< /timeline-item >}}
{{< /timeline >}}
```

### Sidebar Quote (Testimonial)
```markdown
{{< sidebar-quote author="Sarah M." event="Wedding, October 2025" >}}
Pike & West made our day absolutely magical.
{{< /sidebar-quote >}}
```

### Numbered List
```markdown
{{< numbered-list title="How to Book" >}}
1. Choose your date and guest count
2. Schedule a venue tour
3. Review catering options
4. Sign contract and pay deposit
{{< /numbered-list >}}
```

## Formatting Workflow

When editing or creating a blog post, follow this process:

### 1. Analyze Content Structure

- Identify major sections (H2 headings)
- Count word length
- Note topic type (planning guide, inspiration, news)

### 2. Apply Required Elements

- Verify drop cap will apply (first paragraph not `.no-drop-cap`)
- Identify 1-2 pull quote candidates per 1000 words
- Place dividers between major sections (2-3 total)

### 3. Add Recommended Elements

Based on content type:

| Content Type | Recommended Elements |
|--------------|---------------------|
| Planning Guide | Timeline, Tip boxes, Numbered lists, Key takeaways |
| Inspiration | Pull quotes, Sidebar quotes, Fact box |
| Venue Info | Fact box, Numbered list |
| Event Recap | Sidebar quotes, Pull quotes |
| News/Update | Standfirst, Kicker |

### 4. Validate Structure

Check that:
- [ ] First paragraph will receive drop cap
- [ ] Pull quotes don't repeat adjacent text verbatim
- [ ] Dividers separate distinct sections
- [ ] Tip/fact boxes don't interrupt narrative flow
- [ ] All shortcodes are properly closed

## Brand Voice Reminders

While formatting, ensure content follows Pike & West voice:

- **Sophisticated but warm** - Not stuffy, not casual
- **Art/gallery angle** - Reference the unique venue character
- **Avoid**: "venue" overuse (vary with "gallery", "space", "setting")
- **Avoid**: "party" (use "celebration", "gathering")
- **CTAs**: "Schedule your private tour" not generic "contact us"

## Quality Checklist

Before completing edits:

- [ ] Drop cap: First paragraph eligible (no `.no-drop-cap`)
- [ ] Pull quotes: 1-2 per 1000 words included
- [ ] Section dividers: 2-3 placed between major sections
- [ ] Tip/fact boxes: Added where planning advice exists
- [ ] Key takeaways: Present on articles 1500+ words
- [ ] Timeline: Present on planning guides
- [ ] All shortcodes properly formatted and closed
- [ ] Brand voice consistent throughout
- [ ] CTA present at article end
