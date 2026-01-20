---
description: Generate platform-specific social media posts from an existing blog post
allowed-tools: Read, Glob
arguments:
  - name: file
    description: Path to the blog post markdown file
    required: true
---

# /social-from-blog Command

Transform a Pike & West blog post into platform-optimized social media content.

## When Invoked with `$ARGUMENTS.file`

1. **Read and Analyze Blog Post**
   - Extract key points and quotable moments
   - Identify main value proposition
   - Note statistics, facts, or compelling statements
   - Determine target persona

2. **Generate Instagram Feed Post**

   ```markdown
   **Caption (under 2200 chars, ideal 150-300):**
   [Engaging caption with key message]

   **Hashtags (25-30):**
   #PikeAndWest #LifeAsArt [platform-specific hashtags]

   **Image Recommendation:**
   - Ratio: 1:1 square
   - Style: [description]
   - Alt text: [accessibility text]

   **Carousel Option (if applicable):**
   1. Cover: [title slide]
   2-4. Key points
   5. CTA: "Read the full guide—link in bio"
   ```

3. **Generate Instagram Stories (3 slides)**
   - Slide 1: Hook/question with poll sticker
   - Slide 2: Key insight with link sticker
   - Slide 3: CTA to contact page

4. **Generate Facebook Post**

   ```markdown
   **Caption (400-600 chars):**
   [Longer narrative format]

   **Link:** [blog URL with UTM]
   ?utm_source=facebook&utm_medium=social&utm_campaign=blog-[slug]

   **Hashtags (5):**
   [Limited hashtags for Facebook]

   **Image Recommendation:**
   - Ratio: 1.91:1 landscape
   - Style: [description]
   ```

5. **Generate Google Business Profile Post**

   ```markdown
   **Caption (under 1500 chars, ideal 200-300):**
   [Business-focused message]

   **CTA Button:** Learn more
   **Link:** [blog URL with UTM]
   ?utm_source=gbp&utm_medium=organic&utm_campaign=blog-[slug]

   **Image:**
   - Ratio: 4:3
   - Style: [description]
   ```

6. **Provide Scheduling Recommendations**

   | Platform          | Day   | Time   | Notes              |
   |-------------------|-------|--------|--------------------|
   | Instagram Feed    | [day] | [time] | [rationale]        |
   | Instagram Stories | [day] | [time] | Shortly after feed |
   | Facebook          | [day] | [time] | [rationale]        |
   | Google Business   | [day] | [time] | Midweek visibility |

7. **Generate UTM-Tracked Links**
   Provide copy-ready links for:
   - Instagram bio link
   - Facebook post link
   - Google Business link

## Platform-Specific Guidelines

### Instagram

- Caption: Conversational, emoji-light for Pike & West brand
- Hashtags: Mix of branded (#PikeAndWest, #LifeAsArt) and discovery hashtags
- Image: High-quality venue/event photography

### Facebook

- Caption: More narrative, can include links inline
- Limited hashtags (3-5)
- Landscape images perform best

### Google Business Profile

- Professional, SEO-conscious language
- Location-focused when appropriate
- Clear business benefit

## Pike & West Branded Hashtags

Always include:

- #PikeAndWest
- #LifeAsArt (tagline)
- #PikeAndWestWeddings (for wedding content)

Add contextual:

- #GermantownTN #MemphisWeddings #MemphisEvents
- #ArtGalleryWedding #UniqueVenue #GalleryWedding

## Quality Checklist

- [ ] Instagram caption under 2200 characters
- [ ] Facebook caption 400-600 characters
- [ ] GBP post under 1500 characters
- [ ] All links include UTM parameters
- [ ] Hashtags match platform limits
- [ ] Image ratios specified for each platform
- [ ] Alt text included for accessibility
- [ ] CTAs are platform-appropriate
- [ ] Brand voice maintained across platforms
