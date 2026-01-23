# Workshops & Classes Feature

> **Created:** 2026-01-23
> **Status:** Implementation Complete (pending Ticket Tailor setup)

## Overview

Pike & West will host creative workshops and classes as a secondary revenue stream alongside venue rentals. This feature adds a dedicated workshops section to the website with Ticket Tailor integration for ticket sales.

## Business Context

- **Primary business:** Venue rentals for weddings, corporate events, parties
- **New offering:** Creative workshops (painting, pottery, mixed media, etc.)
- **Target audience:** People who want to ATTEND workshops (not hosts)
- **Secondary audience:** Artists/instructors who want to HOST workshops

## CTA Language System

A clear distinction was needed between venue rental inquiries and workshop attendance. The following CTA language was finalized:

### Finalized CTA Mapping

| Location | Old CTA | New CTA | Purpose |
|----------|---------|---------|---------|
| **Header nav (outline)** | Blog | **Workshops** | Navigate to workshops |
| **Header nav (primary)** | Contact Us | **Host Your Event** | Venue rental inquiries |
| **Hero section** | SCHEDULE A TOUR | **BOOK A TOUR** | Venue tour booking |
| **Event types section** | CONTACT US | **HOST YOUR EVENT** | Venue rental inquiries |
| **CTA banner text** | "Book your next event..." | "**Host** your next event..." | Venue context |
| **CTA banner button** | Schedule a Tour | **Book a Tour** | Venue tour booking |
| **Footer (Explore)** | Contact | **Host an Event** | Venue rental inquiries |
| **Footer (new)** | — | **Workshops** | Navigate to workshops |

### Language Framework

| User Intent | CTA Language | Where Used |
|-------------|--------------|------------|
| Rent the venue | "Host Your Event" | Header, Event types, Footer |
| See the space | "Book a Tour" | Hero, CTA banner |
| Attend a workshop | "Workshops" | Header, Footer |
| Teach a workshop | "Get in Touch" | Workshops page secondary CTA |

## Page Structure

### Workshops Landing Page (`/workshops/`)

```
┌─────────────────────────────────────┐
│         CREATIVE WORKSHOPS          │  ← Page header
│        Immerse yourself in art      │
├─────────────────────────────────────┤
│    Join Us for Hands-On Creativity  │  ← Intro section
│    [intro paragraphs]               │
├─────────────────────────────────────┤
│       UPCOMING WORKSHOPS            │  ← Ticket Tailor widget
│    ┌───────────────────────────┐    │     (or placeholder)
│    │   [Ticket Tailor Widget]  │    │
│    └───────────────────────────┘    │
├─────────────────────────────────────┤
│  Social       Expert       All      │  ← Features grid
│  Atmosphere   Instruction  Materials│
├─────────────────────────────────────┤
│     WANT TO HOST A WORKSHOP?        │  ← Secondary CTA
│     [contact link]                  │
└─────────────────────────────────────┘
```

## Ticket Tailor Integration

### Approach: Widget Embed (Phase 1)

Selected the widget embed approach for initial implementation:
- Responsive, handles checkout flow
- Customizable colors/fonts to match brand
- Can filter by keyword to show only workshop events
- Minimal development effort

### Configuration

Add widget URL to `config/_default/params.toml`:

```toml
[ticketTailor]
  widgetUrl = "https://www.tickettailor.com/events/pikeandwest"
```

### Future Options

| Approach | When to Use |
|----------|-------------|
| **Widget Embed** (current) | Simple listing with external checkout |
| **Pop-out Modal** | Custom buy buttons with overlay checkout |
| **API Integration** | Full design control, build-time event sync |

### Recommended: Custom Domain

Set up `tickets.pikeandwest.com` as a custom domain in Ticket Tailor for:
- Better analytics tracking
- Consistent branding
- Avoiding cookie issues

## Files Created

| File | Purpose |
|------|---------|
| `content/workshops.md` | Page content and front matter |
| `data/workshops.yaml` | Page data (heading, intro, features, CTAs) |
| `layouts/page/workshops.html` | Page template |
| `assets/scss/_workshops.scss` | Page styles |

## Files Modified

| File | Change |
|------|--------|
| `config/_default/menus.toml` | Header: Blog→Workshops, Contact Us→Host Your Event; Footer: Contact→Host an Event, added Workshops |
| `config/_default/params.toml` | Added `[ticketTailor]` config section |
| `data/hero.yaml` | SCHEDULE A TOUR → BOOK A TOUR |
| `data/events.yaml` | CONTACT US → HOST YOUR EVENT |
| `data/cta_banner.yaml` | "Book your next event" → "Host your next event", "Schedule a Tour" → "Book a Tour" |
| `layouts/partials/header.html` | Button styling checks for "Host Your Event" |
| `assets/scss/main.scss` | Added workshops import |

## Future Enhancements

Once workshops are running, consider:

1. **Category filtering** - Art, Craft, Photography workshop types
2. **Individual workshop pages** - Rich SEO content, instructor bios
3. **Past workshops gallery** - Show what attendees created
4. **Email signup** - Workshop announcement newsletter
5. **API integration** - Pull events at build time for full design control

## Setup Checklist

- [x] Update all CTAs across site (Host/Attend language)
- [x] Create workshops landing page structure
- [x] Add Ticket Tailor config placeholder
- [x] Add workshops to header and footer navigation
- [ ] Set up Ticket Tailor account
- [ ] Create first workshop event in Ticket Tailor
- [ ] Get widget URL and add to params.toml
- [ ] Consider setting up tickets.pikeandwest.com custom domain
- [ ] Add workshop-specific imagery to page
