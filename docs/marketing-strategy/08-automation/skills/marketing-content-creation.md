# Skill: Marketing Content Creation

> Auto-activates when working in content directories to provide brand context and writing guidance.

## Purpose

This skill ensures all content created for Pike & West maintains consistent brand voice, targets the right personas, and follows established content templates. It loads relevant context automatically so you don't have to manually reference multiple documents.

## Activation Triggers

The skill activates when:

- Working in `content/blog/` directory
- Creating or editing markdown files in `content/`
- Discussing blog post topics or content creation
- Mentioning "blog", "article", "content" in marketing context

## What It Loads

### Brand Voice Guidelines

```yaml
tone: sophisticated, warm, aspirational
voice: confident but approachable, elegant but genuine
vocabulary:
  prefer:
    - curated
    - bespoke
    - artful
    - distinctive
    - elevated
    - intentional
  avoid:
    - cheap
    - deal
    - basic
    - standard
    - party (use "celebration" or "gathering")
    - venue (overuse - vary with "space", "gallery", "setting")
```

### Persona Context

Loads active persona profiles with:

- Demographics and psychographics
- Pain points and motivations
- Preferred content types
- Language preferences
- Decision-making factors

### Content Templates

- Blog post structure with required sections
- Front matter requirements for Hugo
- SEO checklist for each piece
- Internal linking guidelines

## Behavior

When activated, the skill:

1. **Identifies Target Persona** - Determines which persona the content serves
2. **Loads Voice Guidelines** - Applies Pike & West brand voice rules
3. **Suggests Structure** - Recommends appropriate content format
4. **Checks SEO Requirements** - Ensures keyword placement and meta fields
5. **Validates Tone** - Reviews content for brand consistency

## Example Session

**User:** I need to write a blog post about unique wedding reception ideas.

**Claude (with skill active):**

```markdown
I'll help you create this blog post for Pike & West. Based on the topic,
this targets **Boutique Bride Bella** who values unique, Instagram-worthy
experiences.

**Recommended Structure:**
1. Hook: Sensory-rich opening about memorable receptions
2. Problem: Generic venues create forgettable events
3. Solution: 5-7 unique reception ideas that work at Pike & West
4. Social Proof: Brief mention of past events
5. CTA: Tour scheduling

**Primary Keyword:** "unique wedding reception ideas Memphis"
**Secondary Keywords:** "art gallery wedding", "Germantown wedding venue"

**Voice Reminders:**
- Lead with art/gallery angle - it's the differentiator
- Use sensory language (ambient lighting, curated artwork)
- Avoid generic venue language
- Include 2-3 internal links to related content

Shall I generate an outline or proceed to a full draft?
```

## Configuration

### Skill File Location

```text
.claude/skills/marketing-content-creation/
├── SKILL.md              # Main skill definition
├── brand-voice.yaml      # Voice guidelines
├── templates/
│   ├── blog-post.md      # Blog template
│   └── landing-page.md   # Landing page template
└── checklists/
    └── content-review.md # Review checklist
```

### SKILL.md Structure

```markdown
# Marketing Content Creation Skill

## Activation
- Path patterns: `content/blog/**`, `content/**/*.md`
- Keywords: blog, article, content, post, writing

## Context Files
- Load: `docs/marketing-strategy/02-personas/*.md`
- Load: `docs/marketing-strategy/04-content/content-pillars.md`
- Load: `docs/marketing-strategy/03-seo/keyword-strategy.md`

## Instructions
When creating content:
1. Ask which persona this targets (or infer from topic)
2. Apply brand voice guidelines
3. Follow SEO requirements
4. Use appropriate template structure
5. Include required front matter for Hugo
```

## Integration Points

### With Other Skills

- **seo-optimization**: Validates keyword placement
- **social-media-posting**: Suggests social promotion hooks

### With Commands

- **`/blog-draft`**: Uses this skill's context for generation
- **`/blog-outline`**: Uses templates from this skill
- **`/content-audit`**: Checks against voice guidelines

## Quality Checks

Content created with this skill should:

- [ ] Target a specific persona
- [ ] Include primary and secondary keywords naturally
- [ ] Follow Pike & West brand voice
- [ ] Have complete Hugo front matter
- [ ] Include 2+ internal links
- [ ] Have a clear CTA
- [ ] Be scannable (headers, lists, short paragraphs)
