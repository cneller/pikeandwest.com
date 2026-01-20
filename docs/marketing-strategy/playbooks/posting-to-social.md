# Posting to Social

Content distribution workflow for Pike & West's social media channels.

## Overview

- **Time Required**: 15-30 minutes per blog post
- **Frequency**: After each blog post or notable event
- **Platforms**: Instagram, Facebook, Google Business Profile

## Prerequisites

Before distributing:

1. Blog post is published and live on the website
2. Social content generated via `/social-from-blog [post-url]`
3. Access to scheduling tools (Later, Meta Business Suite, or native apps)

## Step-by-Step Workflow

### Step 1: Generate Social Content

After publishing a blog post, run:

```bash
/social-from-blog [post-url]
```

This generates platform-specific content:

- Instagram caption with hashtags
- Facebook post with link preview text
- Google Business Profile update

Save the generated content for each platform.

### Step 2: Prepare Images

Select images for social distribution:

**Image Sizing Guide**

| Platform          | Recommended Size | Aspect Ratio       |
|-------------------|------------------|--------------------|
| Instagram Feed    | 1080x1080px      | 1:1 (square)       |
| Instagram Stories | 1080x1920px      | 9:16 (vertical)    |
| Facebook          | 1200x630px       | 1.91:1 (landscape) |
| Google Business   | 720x720px        | 1:1 (square)       |

**Image Selection Tips**

- Use the blog's featured image as primary
- Select 3-5 additional images for carousel posts (Instagram)
- Ensure images are high quality and on-brand
- Avoid text-heavy images (Instagram penalizes these)

### Step 3: Post to Instagram

**Option A: Schedule via Later (Recommended)**

1. Open Later.com or Later app
2. Select Pike & West Instagram account
3. Click "Create Post"
4. Upload image(s)
5. Paste generated Instagram caption
6. Add location: "Pike & West, Germantown, Tennessee"
7. Schedule for optimal time (see timing guide below)
8. Save

**Option B: Post Directly**

1. Open Instagram app
2. Tap + to create new post
3. Select image(s)
4. Apply filters if needed (keep minimal)
5. Paste caption from generated content
6. Add location tag
7. Post or schedule

**Instagram Best Practices**

- Use 20-30 relevant hashtags
- Always include location tag
- Tag vendors/partners when relevant
- Respond to comments within 2 hours

### Step 4: Post to Facebook

**Option A: Schedule via Meta Business Suite (Recommended)**

1. Open business.facebook.com
2. Select Pike & West page
3. Click "Create Post"
4. Paste generated Facebook content
5. Add blog post link (Facebook will generate preview)
6. Schedule for optimal time
7. Publish

**Option B: Post Directly**

1. Go to Pike & West Facebook page
2. Click "Create Post"
3. Paste content and add link
4. Post immediately

**Facebook Best Practices**

- Include the blog link for traffic
- Keep text concise (Facebook truncates long posts)
- Ask a question to encourage engagement
- Respond to comments promptly

### Step 5: Post to Google Business Profile

1. Open business.google.com
2. Select Pike & West location
3. Click "Add update" or "Create post"
4. Select post type:
   - "What's new" for blog content
   - "Event" for upcoming events
   - "Offer" for promotions
5. Add image (720x720px works best)
6. Paste generated GBP content
7. Add "Learn more" button with blog URL
8. Publish

**Google Business Best Practices**

- Posts expire after 7 days - repost evergreen content
- Use keywords naturally in post text
- Always include a call-to-action button
- Check insights to see what performs

### Step 6: Update Blog Front Matter

After distributing to each channel, update the blog post:

```yaml
social_distributed:
  instagram: true
  instagram_date: 2026-01-21
  instagram_url: "https://instagram.com/p/..."  # optional
  facebook: true
  facebook_date: 2026-01-21
  facebook_url: "https://facebook.com/..."  # optional
  gbp: true
  gbp_date: 2026-01-21
```

### Step 7: Track UTM Links

Add distributed links to tracking file:

```yaml
# data/utm_links.yaml
- url: "https://pikeandwest.com/blog/spring-wedding-tips/?utm_source=instagram&utm_medium=social&utm_campaign=blog"
  created: 2026-01-21
  campaign: "spring-wedding-tips"
  platform: instagram

- url: "https://pikeandwest.com/blog/spring-wedding-tips/?utm_source=facebook&utm_medium=social&utm_campaign=blog"
  created: 2026-01-21
  campaign: "spring-wedding-tips"
  platform: facebook
```

## Optimal Posting Times

Based on venue industry benchmarks:

| Platform        | Best Days     | Best Times                 |
|-----------------|---------------|----------------------------|
| Instagram       | Tue, Wed, Fri | 11am-1pm, 7pm-9pm          |
| Facebook        | Wed, Thu, Fri | 1pm-4pm                    |
| Google Business | Any day       | Morning (posts show fresh) |

Adjust based on your analytics over time.

## Content Type Guide

**Blog Post Distribution**

- Lead with value, not promotion
- Tease the content to drive clicks
- Include clear call-to-action

**Event Announcements**

- Post 2-4 weeks before event
- Share behind-the-scenes content day-of
- Post recap within 48 hours after

**Venue Photos**

- Best for Instagram
- Use carousel format for multiple images
- Include vendor credits when applicable

**Client Testimonials**

- Create quote graphics
- Tag clients (with permission)
- Great for Stories

## Quick Distribution Checklist

For each blog post:

- [ ] Generated social content via `/social-from-blog`
- [ ] Images sized for each platform
- [ ] Instagram: Posted/scheduled with hashtags and location
- [ ] Facebook: Posted/scheduled with link
- [ ] Google Business: Posted with CTA button
- [ ] Blog front matter updated with distribution dates
- [ ] UTM links added to tracking file

## Troubleshooting

**Link preview not showing on Facebook**

- Wait a few minutes and retry
- Use Facebook Debugger tool to refresh cache
- Ensure og:image meta tag is set in blog post

**Instagram hashtags not working**

- Check for banned hashtags (Instagram silently fails)
- Don't use the same hashtag set every post
- Ensure hashtags are in caption, not comments

**Google Business post rejected**

- Remove any phone numbers from text (use button instead)
- Check image for text overlay (limited allowed)
- Ensure content follows Google guidelines
