# Command: /social-from-blog

> Generate platform-specific social media posts from an existing blog post.

## Usage

```bash
/social-from-blog [file-path]
```

**Examples:**

```bash
/social-from-blog content/blog/art-gallery-wedding-reasons.md
/social-from-blog content/blog/corporate-event-planning-guide.md
```

## Purpose

This command transforms a blog post into multiple social media posts for:

- Instagram (feed post + stories)
- Facebook (feed post)
- Google Business Profile

Each platform's content is optimized for its specific requirements, audience expectations, and Pike & West's channel strategy.

## What It Does

### Step 1: Content Analysis

- Reads the blog post content
- Identifies key points and quotable moments
- Extracts the main value proposition
- Notes any statistics or compelling facts

### Step 2: Platform Adaptation

For each platform, generates content that:

- Meets character/format requirements
- Uses appropriate tone and style
- Includes platform-specific elements (hashtags, CTAs)
- Links back to the blog with UTM tracking

### Step 3: Asset Recommendations

- Suggests image crops and ratios
- Recommends carousel content (if applicable)
- Notes alt text requirements
- Identifies potential video/Reel angles

### Step 4: Scheduling Suggestions

- Recommends posting order across platforms
- Suggests optimal posting times
- Notes any timing considerations (seasons, events)

## Example Input/Output

**Input:**

```bash
/social-from-blog content/blog/5-reasons-art-gallery-wedding.md
```

**Output:**

```markdown
# Social Posts Generated from: "5 Reasons an Art Gallery Wedding Is Unforgettable"

Blog URL: https://pikeandwest.com/blog/5-reasons-art-gallery-wedding/

---

## Instagram Feed Post

**Caption (276 characters):**
Your wedding day deserves more than four walls and a dance floor.

An art gallery wedding creates something extraordinary—built-in decor that sparks conversation, intimate spaces that feel grand, and a backdrop as unique as your love story.

See all 5 reasons at the link in bio.

**Hashtags (28):**
#PikeAndWest #LifeAsArt #PikeAndWestWeddings
#ArtGalleryWedding #UniqueWeddingVenue #WeddingInspiration
#GermantownTN #MemphisWeddings #MemphisBride
#TennesseeWedding #SouthernWedding #GalleryWedding
#WeddingVenue #DreamWedding #WeddingPlanning
#BridetoBe #EngagedLife #WeddingIdeas
#ArtLoversWedding #CuratedCelebration #BoutiqueWedding
#IntimateWedding #ModernWedding #UniqueVenue
#WeddingGoals #SayIDo #WeddingDay #MidSouthBride

**Image Recommendation:**
- Primary: Wide shot of ceremony with art visible
- Ratio: 1:1 square
- Alt text: "Couple exchanging vows in Pike & West art gallery with contemporary paintings as backdrop"

**Carousel Option (5 slides):**
1. Cover: "5 Reasons Art Gallery Weddings Are Unforgettable"
2. Reason 1: Built-in decor quote
3. Reason 2: Intimate yet grand quote
4. Reason 3: Conversation starters quote
5. CTA: "Read the full guide—link in bio"

---

## Instagram Stories (3 slides)

**Slide 1:**
- Text: "Planning your wedding venue tour?"
- Sticker: Poll - "Gallery wedding: Yes or Maybe?"
- Background: Soft gallery shot

**Slide 2:**
- Text: "5 reasons an art gallery wedding is unforgettable..."
- Visual: List preview graphic
- Sticker: "See More" link to blog

**Slide 3:**
- Text: "Ready to see the space?"
- CTA: Link sticker to contact page
- UTM: ?utm_source=instagram&utm_medium=social&utm_campaign=blog-art-gallery-wedding&utm_content=stories

---

## Facebook Post

**Caption (487 characters):**
Your wedding day deserves more than four walls and a dance floor. It deserves a setting that sparks conversation, inspires emotion, and creates a backdrop as unique as your love story.

We've witnessed countless couples discover something magical when they choose to celebrate surrounded by contemporary art. From built-in decor to unforgettable photo opportunities, here's why an art gallery wedding creates memories that last.

Read the full guide: [link]

**Link:**
https://pikeandwest.com/blog/5-reasons-art-gallery-wedding/?utm_source=facebook&utm_medium=social&utm_campaign=blog-art-gallery-wedding

**Hashtags (5):**
#ArtGalleryWedding #MemphisWeddings #UniqueVenue #PikeAndWest #GermantownTN

**Image Recommendation:**
- Ratio: 1.91:1 landscape
- Style: Reception with guests and art visible
- Alt text: "Wedding reception at Pike & West gallery with guests mingling among contemporary art"

---

## Google Business Profile Post

**Caption (248 characters):**
Discover why couples choose art gallery weddings for unforgettable celebrations. From stunning backdrops to built-in conversation starters, Pike & West offers a wedding experience unlike any other in the Memphis area.

**CTA Button:** Learn more
**Link:** https://pikeandwest.com/blog/5-reasons-art-gallery-wedding/?utm_source=gbp&utm_medium=organic&utm_campaign=blog-art-gallery-wedding

**Image:**
- Ratio: 4:3
- Style: Bright, inviting gallery shot with wedding setup

---

## Posting Schedule Recommendation

| Platform          | Day       | Time     | Notes              |
|-------------------|-----------|----------|--------------------|
| Instagram Feed    | Tuesday   | 11:00 AM | Peak engagement    |
| Instagram Stories | Tuesday   | 11:30 AM | Shortly after feed |
| Facebook          | Tuesday   | 1:00 PM  | Afternoon browsing |
| Google Business   | Wednesday | 10:00 AM | Midweek visibility |

**Rationale:** Stagger posts to extend reach without overwhelming any single day. Tuesday is strong for wedding content as couples plan on weeknights.

---

## Link Summary

Update Instagram bio link to:
```

<https://pikeandwest.com/blog/5-reasons-art-gallery-wedding/?utm_source=instagram&utm_medium=social&utm_campaign=blog-art-gallery-wedding&utm_content=bio-link>

```text

```

## Configuration

### Command File Location

```text
.claude/commands/social-from-blog.md
```

### Command Definition

```yaml
---
name: social-from-blog
description: Generate social posts from blog content
arguments:
  - name: file
    description: Path to blog post markdown file
    required: true
---

# /social-from-blog Command

When invoked:
1. Read and analyze the blog post content
2. Extract key points, quotes, and value props
3. Generate platform-specific posts for IG, FB, GBP
4. Include appropriate hashtags per platform
5. Add UTM-tracked links
6. Suggest images and posting schedule
```

## Options

| Option        | Description                 | Default |
|---------------|-----------------------------|---------|
| `--platforms` | Limit to specific platforms | All     |
| `--carousel`  | Include carousel version    | true    |
| `--stories`   | Include Stories version     | true    |

**Example with options:**

```bash
/social-from-blog content/blog/wedding-guide.md --platforms instagram,facebook
```

## Related Commands

- [/blog-draft](./blog-draft.md) - Create the source blog post
- [/utm-link](./utm-link.md) - Generate individual tracked links

## Output Files

The command can optionally save outputs:

```text
content/social/
├── 2025-02-15-art-gallery-wedding/
│   ├── instagram-feed.md
│   ├── instagram-stories.md
│   ├── facebook.md
│   └── gbp.md
```

## Quality Checklist

- [ ] Instagram caption under 2200 characters
- [ ] Facebook caption 400-600 characters
- [ ] GBP post under 1500 characters
- [ ] All links include UTM parameters
- [ ] Hashtags match platform limits
- [ ] Image ratios specified for each platform
- [ ] Alt text included for accessibility
- [ ] CTAs are platform-appropriate
