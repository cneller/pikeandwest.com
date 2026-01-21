# Asking for Reviews

Systematic approach to soliciting reviews from Pike & West clients.

## Overview

- **Timing**: 1-3 days after event
- **Priority Platforms**: Google (first), then Facebook
- **Goal**: Build social proof and improve local SEO

## Why Reviews Matter

- 93% of consumers say online reviews impact their purchasing decisions
- Google reviews directly influence local search rankings
- Venues with 50+ reviews get significantly more inquiries
- Recent reviews matter more than old ones

## When to Ask for Reviews

### Optimal Timing

| Event Type       | Best Time to Ask                      |
|------------------|---------------------------------------|
| Weddings         | 2-3 days after (honeymoon excitement) |
| Corporate Events | 1-2 days after (fresh memory)         |
| Private Parties  | 1-2 days after                        |
| Gallery Events   | Same day or next day                  |

### Signals That a Client Will Review

- They expressed gratitude in person
- They sent a thank-you email or message
- They posted about the event on social media
- The event went exceptionally well
- They've already referred others to you

### When NOT to Ask

- If there were issues during the event
- If the client seemed dissatisfied
- During an ongoing complaint resolution
- More than 2 weeks after the event

## Platform Priority

Ask for reviews in this order:

### 1. Google (Highest Priority)

- Greatest SEO impact
- Most trusted by consumers
- Visible in Maps and Search
- Direct link: `https://g.page/r/[YOUR-PLACE-ID]/review`

### 2. Facebook

- Good for social proof
- Easy for clients already on platform
- Visible to their network
- Direct link: `https://facebook.com/pikeandwest/reviews`

### 3. The Knot / WeddingWire (Wedding Clients Only)

- Essential for wedding venue reputation
- Couples actively search these platforms
- Ask wedding clients specifically for these

## How to Ask

### Email Template (Primary Method)

**Subject**: Thank you for celebrating at Pike & West

```text
Hi [Name],

We hope you're still basking in the joy of [your wedding day / your event / your celebration]! It was truly an honor to host such a special [occasion type] at Pike & West.

If you have a moment, we'd be incredibly grateful if you could share your experience on Google. Your feedback helps other [couples / companies / families] discover our venue and helps us continue to improve.

[Leave a Google Review - BUTTON/LINK]

It only takes a minute, and your words mean the world to us.

Thank you again for choosing Pike & West. We hope to see you again soon!

Warmly,
The Pike & West Team
```

### In-Person Script (Day of Event)

Use during the farewell or final walkthrough:

> "We've loved having you here at Pike & West. If you enjoyed your experience, we'd be so grateful if you could leave us a quick Google review in the next few days. It really helps other [couples/families/companies] find us."

### Text Message Template

For clients who prefer text communication:

```text
Hi [Name]! Thank you again for celebrating at Pike & West. If you have a moment, we'd love a quick Google review - it means so much to us! [LINK]
```

## QR Code Strategy for Events

Create a QR code that links directly to your Google review page.

### Where to Display

- Near the exit/farewell area
- On the guest book table
- In the restrooms (discreet placement)
- On thank-you cards handed out at departure

### QR Code Best Practices

- Make it large enough to scan easily (minimum 1" x 1")
- Include brief text: "Loved your experience? Leave us a review!"
- Use a branded design that matches Pike & West aesthetic
- Test the QR code before printing

### Creating the QR Code

```bash
# Generate QR code (example using qrencode)
qrencode -o google-review-qr.png "https://g.page/r/[YOUR-PLACE-ID]/review"
```

Or use online tools like QR Code Generator or Canva.

## Follow-Up Sequence

If no review received after initial ask:

### Day 1: Initial Request

Send email template (above) within 1-3 days of event.

### Day 7: Gentle Reminder

Only send if they opened the first email but didn't click:

**Subject**: Quick favor?

```text
Hi [Name],

We hope the memories from [event] are still making you smile!

If you have a spare moment, we'd still love to hear about your experience at Pike & West. A quick Google review helps us more than you know.

[Leave a Review - LINK]

No pressure at all - we just wanted to follow up in case our first email got buried.

Thank you!
The Pike & West Team
```

### Day 14: Final Ask (Optional)

Only for highly satisfied clients:

**Subject**: One last ask

```text
Hi [Name],

We promise this is our last ask! If leaving a Google review slipped your mind, we'd still be grateful for your feedback whenever you have a moment.

[Leave a Review - LINK]

Either way, thank you for choosing Pike & West. We hope to host you again someday!

Warmly,
The Pike & West Team
```

### After 14 Days

Stop asking. If they haven't reviewed by now, they likely won't.

## Tracking Review Requests

Maintain a log to track outreach and results:

```yaml
# data/review_requests.yaml
- client: "Sarah & Michael Johnson"
  event_date: 2026-01-15
  event_type: wedding
  initial_request: 2026-01-17
  platform_requested: google
  follow_up_1: 2026-01-24
  follow_up_2: null
  review_received: true
  review_date: 2026-01-19
  review_platform: google
  review_rating: 5

- client: "Acme Corp"
  event_date: 2026-01-10
  event_type: corporate
  initial_request: 2026-01-12
  platform_requested: google
  follow_up_1: 2026-01-19
  follow_up_2: 2026-01-26
  review_received: false
  notes: "Contact moved to new company"
```

## Metrics to Track

| Metric                 | Target      |
|------------------------|-------------|
| Request-to-review rate | 25-40%      |
| Average time to review | 3-5 days    |
| Monthly review volume  | 4-8 reviews |
| Average rating         | 4.5+ stars  |

## What to Do with Reviews

Once reviews come in:

1. **Respond promptly** - See [Responding to Reviews](./responding-to-reviews.md)
2. **Share on social** - Screenshot great reviews for Instagram/Facebook
3. **Add to testimonials** - Update website testimonials section
4. **Thank the client** - Send a personal thank-you note or small gift for exceptional reviews
5. **Learn from feedback** - Use constructive criticism to improve

## Legal Considerations

- Never offer incentives for positive reviews (violates platform policies)
- Don't ask clients to give a specific star rating
- Never write fake reviews or have staff post reviews
- You can ask for "honest feedback" or "a review" - not "a 5-star review"
- Respect if someone declines to leave a review
