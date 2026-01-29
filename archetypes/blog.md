---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
description: "A brief summary for search results and social sharing (150-160 characters ideal)"
date: {{ .Date }}
draft: true
author: "Pike & West"
categories: []
  # Options: News, Weddings, Corporate Events, Planning Tips, Behind the Scenes
tags: []
image: ""
  # Image path from assets/images/, e.g.: images/photos/venue-01-interior.jpeg
image_alt: "Describe the image for accessibility"
keywords:
  # SEO keywords for this post (3-5 recommended)
  # - keyword one Memphis
  # - keyword two Germantown
---

<!--
EDITORIAL STYLING QUICK REFERENCE
=================================
See CLAUDE.md or .claude/agents/blog-editor.md for full documentation.

REQUIRED (every post):
  - Drop cap: Automatic on first paragraph
  - Pull quotes: 1-2 per 1000 words
  - Section dividers: 2-3 per article

COMMON SHORTCODES:

  {{</* pull-quote */>}}Quote text{{</* /pull-quote */>}}
  {{</* pull-quote author="Name" */>}}Quote{{</* /pull-quote */>}}

  {{</* divider */>}}                    (gold diamond)
  {{</* divider style="line" */>}}       (gradient line)

  {{</* tip */>}}Planning advice{{</* /tip */>}}
  {{</* tip title="Pro Tip" */>}}Advice{{</* /tip */>}}

  {{</* fact-box title="At a Glance" */>}}
  - **Capacity:** 150 guests
  {{</* /fact-box */>}}

  {{</* key-takeaways */>}}
  - Main point one
  - Main point two
  {{</* /key-takeaways */>}}

  {{</* timeline */>}}
  - **12 months:** Book venue
  - **9 months:** Send save-the-dates
  {{</* /timeline */>}}

  {{</* sidebar-quote author="Sarah M." event="Wedding 2025" */>}}
  Testimonial text here.
  {{</* /sidebar-quote */>}}

  {{</* numbered-list */>}}
  1. First step
  2. Second step
  {{</* /numbered-list */>}}

  {{</* standfirst */>}}Bold intro summary{{</* /standfirst */>}}
  {{</* kicker */>}}Category Label{{</* /kicker */>}}
-->

{{< kicker >}}Category Here{{< /kicker >}}

Write your opening paragraph here. It will automatically receive a drop cap
(large decorative first letter) to create a magazine-style appearance.

{{< standfirst >}}
A bold summary sentence that bridges the headline and body copy, hooking
readers and setting expectations for what they'll learn.
{{< /standfirst >}}

Continue with your introduction. Set the stage for what readers will learn
or experience in this post.

{{< divider >}}

## First Major Section

Develop your first main point here. Use clear, engaging prose that matches
Pike & West's sophisticated yet approachable voice.

{{< tip >}}
Include helpful planning advice that readers can act on immediately.
{{< /tip >}}

{{< pull-quote >}}
Include a memorable quote or key insight that captures the essence of this section.
{{< /pull-quote >}}

Continue elaborating on your point with supporting details, examples, or
stories that resonate with your audience.

{{< sidebar-quote author="Client Name" event="Event Type, Date" >}}
A brief testimonial that supports your point.
{{< /sidebar-quote >}}

{{< divider >}}

## Second Major Section

Transition to your next main topic. Each section should flow naturally
from the previous one while introducing new value for the reader.

{{< fact-box title="At a Glance" position="right" >}}

- **Key Stat:** Value
- **Another Stat:** Value
- **Detail:** Information
{{< /fact-box >}}

For step-by-step content, use numbered lists:

{{< numbered-list title="How to Get Started" >}}

1. Choose your date and guest count
2. Schedule a venue tour with our team
3. Review catering and decor options
4. Sign your contract and celebrate
{{< /numbered-list >}}

For planning content, use timelines:

{{< timeline title="Planning Timeline" >}}

- **12-18 months out:** Book venue and caterer
- **9-12 months out:** Send save-the-dates
- **6-9 months out:** Finalize guest list and vendors
{{< /timeline >}}

{{< divider style="line" >}}

## Bring Your Vision to Life at Pike & West

End with a call-to-action that connects your content to Pike & West's services.

{{< key-takeaways >}}

- Key point one from this article
- Key point two from this article
- Key point three from this article
{{< /key-takeaways >}}

[Schedule a tour](/contact/) to see our space and start planning your event.
Call us at 901.206.5575 or visit our contact page to get started.
