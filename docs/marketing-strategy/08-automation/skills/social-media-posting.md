# Skill: Social Media Posting

> Auto-activates when discussing social media to load platform specifications, hashtag strategies, and posting guidelines.

## Purpose

This skill ensures social media content is optimized for each platform, uses the correct hashtag strategy, and maintains Pike & West's sophisticated brand voice across Instagram, Facebook, and Google Business Profile.

## Activation Triggers

The skill activates when:

- Mentioning Instagram, Facebook, or Google Business Profile
- Discussing "social media", "posts", "captions"
- Working with files in social media related directories
- Creating content for social promotion

## What It Loads

### Platform Specifications

```yaml
instagram:
  caption_length: 2200 max, ideal 150-300
  hashtags: 20-30 per post, mix of sizes
  image_ratio: 1:1 (feed), 9:16 (stories/reels)
  link_in_bio: Required for all CTAs
  posting_times:
    - "Tue-Fri 11am-1pm"
    - "Sat-Sun 10am-12pm"

facebook:
  caption_length: 500-1000 ideal
  hashtags: 3-5 max, strategic only
  image_ratio: 1.91:1 (feed), 9:16 (stories)
  links: Direct links allowed
  posting_times:
    - "Wed-Fri 1pm-4pm"
    - "Sat 12pm-1pm"

google_business_profile:
  post_length: 1500 max, ideal 150-300
  hashtags: None (not supported)
  image_ratio: 4:3 or 1:1
  cta_buttons: Book, Learn more, Call, Order
  posting_frequency: 1-2x per week
```

### Hashtag Strategy

```yaml
branded:
  always_use:
    - "#PikeAndWest"
    - "#LifeAsArt"
  event_specific:
    - "#PikeAndWestWeddings"
    - "#PikeAndWestEvents"

location:
  primary:
    - "#GermantownTN"
    - "#MemphisEvents"
    - "#MemphisWeddings"
  secondary:
    - "#TennesseeWeddings"
    - "#MidSouthEvents"

niche:
  weddings:
    - "#ArtGalleryWedding"
    - "#UniqueWeddingVenue"
    - "#BoutiqueWedding"
  corporate:
    - "#CorporateEvents"
    - "#EventPlanning"
    - "#MeetingSpace"
  art:
    - "#ArtGallery"
    - "#ContemporaryArt"
    - "#ArtAndLife"
```

### Voice Adaptations by Platform

```yaml
instagram:
  tone: Aspirational, visual-forward, lifestyle-focused
  style: Shorter sentences, emoji-light, story-driven
  cta: "Link in bio" variations

facebook:
  tone: Community-focused, informative, engaging
  style: Slightly longer, conversational, shareable
  cta: Direct links with action verbs

google_business_profile:
  tone: Professional, local-SEO focused, informative
  style: Concise, keyword-rich, action-oriented
  cta: Button-focused (Book, Call, Learn More)
```

## Behavior

When activated, the skill:

1. **Identifies Platform** - Determines which platform(s) content is for
2. **Loads Specifications** - Applies character limits, hashtag rules
3. **Adapts Voice** - Adjusts tone for platform context
4. **Suggests Hashtags** - Recommends relevant hashtag mix
5. **Optimizes CTAs** - Ensures platform-appropriate calls to action

## Example Session

**User:** Create an Instagram post about our new art exhibition opening.

**Claude (with skill active):**

```markdown
**Instagram Post - Art Exhibition Opening**

**Caption (287 characters):**
A new chapter unfolds at Pike & West. Join us this Saturday as we unveil
"Reflections" - a curated collection exploring light, shadow, and the
spaces between.

Gallery hours: 5-8pm
Complimentary wine & hors d'oeuvres

Tap link in bio to RSVP.

**Hashtags (25):**
#PikeAndWest #LifeAsArt #PikeAndWestEvents
#GermantownTN #MemphisArt #MemphisEvents
#ArtGallery #ContemporaryArt #ArtExhibition
#GalleryOpening #ArtReception #CuratedArt
#TennesseeArt #MidSouthArt #ArtLovers
#GalleryNight #ArtCommunity #LocalArt
#ArtAndWine #CulturalEvents #ArtScene
#GermantownEvents #MemphisGallery #ArtLife
#WeekendPlans

**Image Recommendation:**
- Ratio: 1:1 square crop
- Style: Detail shot of artwork with gallery space visible
- Lighting: Natural gallery lighting, no heavy filters

**Posting Time:** Friday 11am (builds weekend anticipation)
```

## Configuration

### Skill File Location

```text
.claude/skills/social-media-posting/
├── SKILL.md              # Main skill definition
├── platform-specs.yaml   # Platform requirements
├── hashtags.yaml         # Hashtag strategy
└── templates/
    ├── instagram.md      # IG post template
    ├── facebook.md       # FB post template
    └── gbp.md           # Google Business template
```

### SKILL.md Structure

```markdown
# Social Media Posting Skill

## Activation
- Keywords: instagram, facebook, social media, post, caption, hashtag
- Keywords: IG, FB, GBP, google business

## Context Files
- Load: `docs/marketing-strategy/05-social-media/platform-strategy.md`
- Load: `docs/marketing-strategy/05-social-media/hashtag-strategy.md`

## Instructions
When creating social content:
1. Identify target platform(s)
2. Apply platform-specific character limits
3. Use appropriate hashtag mix (branded + location + niche)
4. Adapt voice for platform context
5. Include platform-appropriate CTA
6. Suggest optimal posting time
```

## Integration Points

### With Other Skills

- **marketing-content-creation**: Social posts often derive from blog content
- **utm-tracking**: All links should use UTM parameters

### With Commands

- **`/social-from-blog`**: Uses this skill to generate platform-specific posts
- **`/utm-link`**: Integrates tracked links into social posts

## Platform-Specific Checklists

### Instagram Post

- [ ] Caption under 2200 characters (ideal 150-300)
- [ ] 20-30 hashtags including branded tags
- [ ] "Link in bio" CTA (no direct links)
- [ ] Image is 1:1 ratio
- [ ] Alt text included

### Facebook Post

- [ ] Caption 500-1000 characters
- [ ] 3-5 strategic hashtags only
- [ ] Direct link with UTM tracking
- [ ] Image is 1.91:1 ratio
- [ ] Engagement question included

### Google Business Profile

- [ ] Post under 1500 characters (ideal 150-300)
- [ ] No hashtags
- [ ] CTA button selected (Book, Learn more, etc.)
- [ ] Local keywords included
- [ ] Image is 4:3 or 1:1 ratio
