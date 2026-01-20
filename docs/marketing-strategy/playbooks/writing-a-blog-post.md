# Writing a Blog Post

End-to-end workflow for creating blog content for Pike & West.

## Overview

- **Time Required**: 2-4 hours (can be split across sessions)
- **Frequency**: Weekly
- **Tools Needed**: Hugo, Claude Code, image editor (optional)

## Step-by-Step Workflow

### Step 1: Select Topic

Check the content queue for the next recommended topic:

```bash
# View content queue
cat docs/marketing-strategy/content-queue/README.md
```

Look for:

- Topics marked as high priority
- Seasonal content that aligns with current month
- Topics that match upcoming events

### Step 2: Create Outline

Run the blog outline command with your selected topic:

```bash
/blog-outline [topic]
```

Example:

```bash
/blog-outline "Spring Wedding Photography Tips"
```

The command will generate:

- Suggested H2/H3 structure
- Key points to cover
- Target keyword recommendations
- Estimated word count
- Persona alignment

### Step 3: Review and Approve Outline

Before drafting, review the outline for:

- [ ] Does the structure flow logically?
- [ ] Are all key points relevant to Pike & West's audience?
- [ ] Is the target keyword appropriate?
- [ ] Does it serve one of our target personas?

Make edits to the outline if needed, then approve to proceed.

### Step 4: Generate Draft

Run the blog draft command:

```bash
/blog-draft [topic]
```

This generates a full draft based on the approved outline.

### Step 5: Edit the Draft

This is where you add the Pike & West touch. Edit for:

**Local Flavor**

- Reference Germantown, Memphis, or Mid-South area
- Mention nearby landmarks or venues (for context)
- Use local seasonal references (hot Memphis summers, etc.)

**Personal Touches**

- Add anecdotes from actual Pike & West events
- Include quotes from past clients (with permission)
- Reference specific venue features (courtyard, gallery space, etc.)

**Voice and Tone**

- Sophisticated but approachable
- Helpful and knowledgeable
- Avoid being salesy - focus on value

**SEO Elements**

- Ensure target keyword appears in first 100 words
- Include keyword in at least one H2
- Add internal links to relevant pages (contact, gallery, etc.)

### Step 6: Add Images

Select images that enhance the content:

**Venue Photos (Preferred)**

- Check `static/images/venue/` for existing assets
- Use photos that match the blog topic
- Ensure proper aspect ratios (16:9 for headers, 4:3 for inline)

**Stock Images (If Needed)**

- Use Unsplash or Pexels for free stock
- Ensure images match Pike & West's aesthetic
- Download at highest resolution available

**Image Requirements**

- Add descriptive alt text for SEO
- Compress images before adding (use TinyPNG or similar)
- Name files descriptively: `spring-wedding-courtyard-setup.jpg`

### Step 7: Complete Front Matter

Every blog post requires complete front matter:

```yaml
---
title: "Your Blog Post Title"
date: 2026-01-20
draft: false
description: "Meta description (150-160 characters)"
keywords:
  - primary keyword
  - secondary keyword
  - long-tail keyword
categories:
  - Weddings  # or Corporate Events, Venue Tips, etc.
personas:
  - elegant-emily  # Target persona(s)
featured_image: "/images/blog/post-slug/featured.jpg"
author: "Pike & West Team"
social_distributed:
  instagram: false
  facebook: false
  gbp: false
---
```

### Step 8: Preview Locally

Start the Hugo development server:

```bash
hugo server -D
```

Check the following:

- [ ] Page loads without errors
- [ ] Images display correctly
- [ ] Links work properly
- [ ] Mobile layout looks good (use browser dev tools)
- [ ] No spelling or grammar issues
- [ ] Meta description appears correctly

### Step 9: Publish

When ready to publish:

1. Set `draft: false` in front matter
2. Commit changes:

   ```bash
   git add content/blog/[post-slug].md
   git add static/images/blog/[post-slug]/
   git commit -m "Add blog post: [title]"
   ```

3. Push to deploy:

   ```bash
   git push origin main
   ```

### Step 10: Generate Social Content

After publishing, generate social media posts:

```bash
/social-from-blog [post-url]
```

This creates:

- Instagram caption with hashtags
- Facebook post with preview text
- Google Business Profile post

### Step 11: Update Tracking

As you distribute to each channel, update the blog post front matter:

```yaml
social_distributed:
  instagram: true
  instagram_date: 2026-01-21
  facebook: true
  facebook_date: 2026-01-21
  gbp: true
  gbp_date: 2026-01-22
```

See [Posting to Social](./posting-to-social.md) for the full distribution workflow.

## Quality Checklist

Before considering a blog post complete:

- [ ] Topic selected from content queue
- [ ] Outline reviewed and approved
- [ ] Draft edited with local flavor and personal touches
- [ ] At least 2-3 images added with alt text
- [ ] Front matter complete (all fields populated)
- [ ] Previewed locally without errors
- [ ] Published and deployed
- [ ] Social content generated
- [ ] At least one social channel distributed

## Troubleshooting

**Hugo server shows errors**

- Check front matter YAML syntax (proper indentation, quotes)
- Ensure image paths are correct (start with `/images/`)
- Look for unclosed shortcodes

**Images not displaying**

- Verify file exists in `static/images/` directory
- Check file extension matches reference (case sensitive)
- Ensure path starts with `/` for absolute reference

**Social command not generating content**

- Ensure blog post is published (not draft)
- Check that post URL is accessible
- Verify front matter description exists
