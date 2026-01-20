# Hugo UTM Implementation

> Shortcodes, partials, and data files for UTM tracking in Pike & West's Hugo site.

## Shortcode: tracked-link

A Hugo shortcode that generates links with UTM parameters automatically appended.

### File: `layouts/shortcodes/tracked-link.html`

```go-html-template
{{/*
  tracked-link shortcode

  Generates a link with UTM parameters for tracking.

  Parameters:
    - url: Target URL (required)
    - source: utm_source (required) - instagram, facebook, gbp, email, google
    - campaign: utm_campaign (required) - blog-[slug], promo-[name], seasonal-[name], evergreen
    - content: utm_content (required) - bio-link, post, story, carousel, reel, page-cta
    - text: Link text (optional, defaults to url)
    - class: CSS class (optional)
    - target: Link target (optional, defaults to _self)

  Usage:
    {{< tracked-link url="/contact/" source="instagram" campaign="blog-wedding-checklist" content="story" text="Schedule a Tour" >}}
*/}}

{{- $url := .Get "url" -}}
{{- $source := .Get "source" | lower -}}
{{- $campaign := .Get "campaign" | lower -}}
{{- $content := .Get "content" | lower -}}
{{- $text := .Get "text" | default $url -}}
{{- $class := .Get "class" | default "" -}}
{{- $target := .Get "target" | default "_self" -}}

{{/* Auto-detect medium based on source */}}
{{- $medium := "social" -}}
{{- if eq $source "email" -}}
  {{- $medium = "email" -}}
{{- else if eq $source "gbp" -}}
  {{- $medium = "organic" -}}
{{- else if eq $source "google" -}}
  {{- $medium = "cpc" -}}
{{- end -}}

{{/* Build UTM query string */}}
{{- $separator := "?" -}}
{{- if strings.Contains $url "?" -}}
  {{- $separator = "&" -}}
{{- end -}}

{{- $utmParams := printf "utm_source=%s&utm_medium=%s&utm_campaign=%s&utm_content=%s" $source $medium $campaign $content -}}
{{- $fullUrl := printf "%s%s%s" $url $separator $utmParams -}}

<a href="{{ $fullUrl }}"{{ with $class }} class="{{ . }}"{{ end }} target="{{ $target }}">{{ $text }}</a>
```

### Usage Examples

Basic link:

```go-html-template
{{< tracked-link
    url="/contact/"
    source="instagram"
    campaign="blog-wedding-checklist"
    content="story"
    text="Schedule a Tour"
>}}
```

Output:

```html
<a href="/contact/?utm_source=instagram&utm_medium=social&utm_campaign=blog-wedding-checklist&utm_content=story" target="_self">Schedule a Tour</a>
```

With CSS class and new tab:

```go-html-template
{{< tracked-link
    url="/blog/wedding-venue-checklist/"
    source="facebook"
    campaign="seasonal-holidays-2025"
    content="post"
    text="Read More"
    class="btn btn-primary"
    target="_blank"
>}}
```

## Partial: social-share-urls

A Hugo partial that generates all social share URLs with proper UTMs for a blog post.

### File: `layouts/partials/social-share-urls.html`

```go-html-template
{{/*
  social-share-urls partial

  Generates a dictionary of social share URLs with UTM parameters.

  Context: Expects a Page object (.)

  Returns: Dictionary with share URLs for each platform

  Usage:
    {{ $shareUrls := partial "social-share-urls.html" . }}
    {{ $shareUrls.instagram.bio }}
    {{ $shareUrls.facebook.post }}
*/}}

{{- $page := . -}}
{{- $baseUrl := $page.Permalink -}}
{{- $slug := $page.File.ContentBaseName -}}
{{- $campaign := printf "blog-%s" $slug -}}

{{/* Helper function to build URL with UTMs */}}
{{- $buildUrl := dict
    "base" $baseUrl
    "campaign" $campaign
-}}

{{/* Build all share URLs */}}
{{- $urls := dict -}}

{{/* Instagram URLs */}}
{{- $instagram := dict
    "bio" (printf "%s?utm_source=instagram&utm_medium=social&utm_campaign=%s&utm_content=bio-link" $baseUrl $campaign)
    "post" (printf "%s?utm_source=instagram&utm_medium=social&utm_campaign=%s&utm_content=post" $baseUrl $campaign)
    "story" (printf "%s?utm_source=instagram&utm_medium=social&utm_campaign=%s&utm_content=story" $baseUrl $campaign)
    "carousel" (printf "%s?utm_source=instagram&utm_medium=social&utm_campaign=%s&utm_content=carousel" $baseUrl $campaign)
    "reel" (printf "%s?utm_source=instagram&utm_medium=social&utm_campaign=%s&utm_content=reel" $baseUrl $campaign)
-}}
{{- $urls = merge $urls (dict "instagram" $instagram) -}}

{{/* Facebook URLs */}}
{{- $facebook := dict
    "post" (printf "%s?utm_source=facebook&utm_medium=social&utm_campaign=%s&utm_content=post" $baseUrl $campaign)
    "share" (printf "https://www.facebook.com/sharer/sharer.php?u=%s" (printf "%s?utm_source=facebook&utm_medium=social&utm_campaign=%s&utm_content=share" $baseUrl $campaign | urlquery))
-}}
{{- $urls = merge $urls (dict "facebook" $facebook) -}}

{{/* Google Business Profile URLs */}}
{{- $gbp := dict
    "post" (printf "%s?utm_source=gbp&utm_medium=organic&utm_campaign=%s&utm_content=post" $baseUrl $campaign)
-}}
{{- $urls = merge $urls (dict "gbp" $gbp) -}}

{{/* Email URLs */}}
{{- $email := dict
    "newsletter" (printf "%s?utm_source=email&utm_medium=email&utm_campaign=%s&utm_content=newsletter" $baseUrl $campaign)
    "signature" (printf "%s?utm_source=email&utm_medium=email&utm_campaign=%s&utm_content=signature" $baseUrl $campaign)
-}}
{{- $urls = merge $urls (dict "email" $email) -}}

{{/* Return the complete URL dictionary */}}
{{- return $urls -}}
```

### Usage in Templates

In a blog post template:

```go-html-template
{{ $shareUrls := partial "social-share-urls.html" . }}

<div class="share-links">
  <h3>Share this post</h3>

  <p><strong>Instagram Bio:</strong></p>
  <input type="text" readonly value="{{ $shareUrls.instagram.bio }}" onclick="this.select()">

  <p><strong>Facebook:</strong></p>
  <a href="{{ $shareUrls.facebook.share }}" target="_blank" rel="noopener">Share on Facebook</a>

  <p><strong>Email Newsletter:</strong></p>
  <input type="text" readonly value="{{ $shareUrls.email.newsletter }}" onclick="this.select()">
</div>
```

Generate a JSON block for easy copying:

```go-html-template
{{ $shareUrls := partial "social-share-urls.html" . }}

<script type="application/json" id="share-urls">
{
  "instagram": {
    "bio": "{{ $shareUrls.instagram.bio }}",
    "story": "{{ $shareUrls.instagram.story }}",
    "post": "{{ $shareUrls.instagram.post }}"
  },
  "facebook": {
    "post": "{{ $shareUrls.facebook.post }}"
  },
  "gbp": {
    "post": "{{ $shareUrls.gbp.post }}"
  },
  "email": {
    "newsletter": "{{ $shareUrls.email.newsletter }}"
  }
}
</script>
```

## Data File: utm_links.yaml

Track all active UTM links in a central data file for reference and auditing.

### File: `data/utm_links.yaml`

```yaml
# UTM Links Registry
# Tracks all active UTM-tagged links for Pike & West
# Last updated: 2025-01-20

# Evergreen links (permanent, don't change)
evergreen:
  instagram_bio:
    url: "https://pikeandwest.com/?utm_source=instagram&utm_medium=social&utm_campaign=evergreen&utm_content=bio-link"
    description: "Main Instagram bio link"
    created: "2025-01-20"
    active: true

  facebook_page_cta:
    url: "https://pikeandwest.com/contact/?utm_source=facebook&utm_medium=social&utm_campaign=evergreen&utm_content=page-cta"
    description: "Facebook page 'Contact Us' CTA button"
    created: "2025-01-20"
    active: true

  gbp_website:
    url: "https://pikeandwest.com/?utm_source=gbp&utm_medium=organic&utm_campaign=evergreen&utm_content=website-link"
    description: "Google Business Profile website link"
    created: "2025-01-20"
    active: true

# Seasonal campaigns (recurring annually)
seasonal:
  holidays_2025:
    campaign: "seasonal-holidays-2025"
    start_date: "2025-10-15"
    end_date: "2025-12-31"
    links:
      - platform: instagram
        content: story
        url: "https://pikeandwest.com/contact/?utm_source=instagram&utm_medium=social&utm_campaign=seasonal-holidays-2025&utm_content=story"
      - platform: facebook
        content: post
        url: "https://pikeandwest.com/contact/?utm_source=facebook&utm_medium=social&utm_campaign=seasonal-holidays-2025&utm_content=post"

  prom_2025:
    campaign: "seasonal-prom-2025"
    start_date: "2025-02-01"
    end_date: "2025-05-15"
    links: []

  graduation_2025:
    campaign: "seasonal-graduation-2025"
    start_date: "2025-04-01"
    end_date: "2025-06-30"
    links: []

# Blog post links (generated per post)
blog_posts:
  wedding_venue_checklist:
    slug: "wedding-venue-checklist"
    campaign: "blog-wedding-venue-checklist"
    published: "2025-01-15"
    links:
      instagram_bio:
        url: "https://pikeandwest.com/blog/wedding-venue-checklist/?utm_source=instagram&utm_medium=social&utm_campaign=blog-wedding-venue-checklist&utm_content=bio-link"
        distributed: "2025-01-15"
      instagram_carousel:
        url: "https://pikeandwest.com/blog/wedding-venue-checklist/?utm_source=instagram&utm_medium=social&utm_campaign=blog-wedding-venue-checklist&utm_content=carousel"
        distributed: "2025-01-16"
      facebook_post:
        url: "https://pikeandwest.com/blog/wedding-venue-checklist/?utm_source=facebook&utm_medium=social&utm_campaign=blog-wedding-venue-checklist&utm_content=post"
        distributed: "2025-01-15"
      email_newsletter:
        url: "https://pikeandwest.com/blog/wedding-venue-checklist/?utm_source=email&utm_medium=email&utm_campaign=blog-wedding-venue-checklist&utm_content=newsletter"
        distributed: "2025-01-17"

# Promotional campaigns (one-time)
promotions:
  summer_booking_2025:
    campaign: "promo-summer-booking-2025"
    description: "Summer 2025 early booking discount"
    start_date: "2025-03-01"
    end_date: "2025-05-31"
    links: []
```

### Using Data in Templates

Access UTM link data in templates:

```go-html-template
{{ $utmLinks := .Site.Data.utm_links }}

{{/* Get evergreen Instagram bio link */}}
{{ $igBioLink := $utmLinks.evergreen.instagram_bio.url }}

{{/* Loop through active seasonal campaigns */}}
{{ range $name, $campaign := $utmLinks.seasonal }}
  {{ if $campaign.links }}
    <h4>{{ $name }}</h4>
    {{ range $campaign.links }}
      <a href="{{ .url }}">{{ .platform }} {{ .content }}</a>
    {{ end }}
  {{ end }}
{{ end }}
```

## GA4 Reporting

Create custom reports in GA4 to analyze UTM-tagged traffic.

### Channel Performance Report

**Purpose:** Compare traffic and conversions across marketing channels.

**Dimensions:**

- Session source (utm_source)
- Session medium (utm_medium)

**Metrics:**

- Sessions
- Engaged sessions
- Engagement rate
- Conversions (contact form submissions)
- Conversion rate

**Filters:** None (shows all traffic)

**Setup in GA4:**

1. Go to Explore > Blank
2. Add dimensions: Session source, Session medium
3. Add metrics: Sessions, Engaged sessions, Engagement rate, Conversions
4. Drag dimensions to Rows, metrics to Values
5. Save as "Channel Performance"

### Content Performance Report

**Purpose:** Identify which blog posts drive the most traffic when shared.

**Dimensions:**

- Session campaign (utm_campaign)
- Session source (utm_source)
- Session content (utm_content)

**Metrics:**

- Sessions
- Avg. session duration
- Pages per session
- Conversions

**Filters:**

- Session campaign contains "blog-"

**Setup in GA4:**

1. Go to Explore > Blank
2. Add dimensions: Session campaign, Session source, Session content
3. Add metrics: Sessions, Avg. session duration, Pages per session, Conversions
4. Add filter: Session campaign contains "blog-"
5. Drag Session campaign to Rows, other dimensions to secondary rows
6. Save as "Blog Content Performance"

### Campaign Performance Report

**Purpose:** Track seasonal and promotional campaign effectiveness.

**Dimensions:**

- Session campaign (utm_campaign)
- Date

**Metrics:**

- Sessions
- New users
- Conversions
- Conversion rate

**Filters:**

- Session campaign contains "seasonal-" OR "promo-"

**Setup in GA4:**

1. Go to Explore > Blank
2. Add dimensions: Session campaign, Date
3. Add metrics: Sessions, New users, Conversions
4. Add filter: Session campaign matches regex `^(seasonal|promo)-`
5. Drag Date to Columns for time trend visualization
6. Save as "Campaign Performance"

### Content Type Analysis

**Purpose:** Determine which content formats (story, carousel, reel, etc.) drive the most engagement.

**Dimensions:**

- Session content (utm_content)
- Session source (utm_source)

**Metrics:**

- Sessions
- Engagement rate
- Conversions

**Filters:** None (or filter to specific source like instagram)

**Setup in GA4:**

1. Go to Explore > Blank
2. Add dimensions: Session content, Session source
3. Add metrics: Sessions, Engagement rate, Conversions
4. Optional filter: Session source exactly matches "instagram"
5. Drag Session content to Rows
6. Save as "Content Type Performance"

### Creating a Dashboard

Combine these reports into a Looker Studio dashboard:

1. Create new Looker Studio report
2. Connect GA4 as data source
3. Add charts for each report type:
   - Pie chart: Channel distribution (source/medium)
   - Bar chart: Top blog posts by campaign
   - Line chart: Campaign performance over time
   - Table: Content type breakdown
4. Add date range selector
5. Add filters for source, medium, campaign

### Sample Looker Studio Query

For a custom query in Looker Studio:

```sql
-- Top performing blog posts by platform
SELECT
  session_campaign,
  session_source,
  COUNT(*) as sessions,
  COUNTIF(event_name = 'generate_lead') as conversions
FROM `your_project.analytics_XXXXXX.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN '20250101' AND '20251231'
  AND session_campaign LIKE 'blog-%'
GROUP BY session_campaign, session_source
ORDER BY sessions DESC
LIMIT 20
```
