# Homepage Audit: Webflow vs Hugo Structure Comparison

**Audit Date:** 2026-01-20
**Auditor:** Claude Code
**Status:** In Progress

## Executive Summary

This audit compares the Webflow homepage structure (158 elements) against the Hugo implementation. The Hugo site successfully implements all major sections but uses a different (BEM-style) class naming convention and simplified element hierarchy.

---

## Section-by-Section Comparison

### 1. Header/Navigation

| Aspect          | Webflow                                         | Hugo                                 | Status              |
|-----------------|-------------------------------------------------|--------------------------------------|---------------------|
| Container Class | `navbar1_component w-nav`                       | `header`                             | Different naming    |
| Logo Link       | `navbar1_logo-link w-nav-brand`                 | `header__logo`                       | Different naming    |
| Logo Image      | `navbar1_logo`                                  | Direct `<img>` in logo link          | Simplified          |
| Menu Container  | `navbar1_menu is-page-height-tablet w-nav-menu` | `header__nav`                        | Different structure |
| Menu Buttons    | `navbar1_menu-buttons`                          | Direct nav links                     | Simplified          |
| Contact Button  | `navbar-button-gold w-button`                   | `header__link header__link--primary` | Different naming    |
| Artists Button  | `navbar-button-gold is-secondary w-button`      | `header__link header__link--outline` | Different naming    |
| Hamburger Menu  | `navbar1_menu-button w-nav-button`              | `header__hamburger`                  | Different naming    |
| Hamburger Lines | `menu-icon1_line-top/middle/bottom`             | `header__hamburger-line`             | Simplified          |

**Webflow Elements:**

- `ComponentInstance` - "Navigation With Artist CTA"
- Hamburger icon with 3 separate div lines and animated middle line

**Hugo Elements:**

- Simplified header partial with BEM naming
- Three hamburger lines using `<span>` elements
- Menu driven by Hugo `site.Menus.main`

- [x] Header structure present
- [x] Logo present
- [x] Navigation buttons present
- [x] Hamburger menu present
- [ ] Webflow animation classes missing (expected - requires JS)

---

### 2. Hero Section

| Aspect           | Webflow                                    | Hugo                         | Status              |
|------------------|--------------------------------------------|------------------------------|---------------------|
| Section Class    | `hero-header-section`                      | `hero`                       | Different naming    |
| Background Image | `<img>` element with class `image mobile`  | CSS `background-image` style | Different approach  |
| Content Wrapper  | `div-block mobile hidden`                  | `hero__content`              | Different structure |
| Title            | `h1-crm-les-mores mobile hidden`           | `hero__title`                | Different naming    |
| Tagline          | `hero-subheader-1 mobile hidden`           | `hero__tagline tagline`      | Different naming    |
| CTA Button       | `button-1-pw-cream mobile hidden w-button` | `btn btn-secondary`          | Different naming    |

**Webflow Element Structure:**

```text
Section (hero-header-section)
  Image (image | mobile)
  Block (div-block | mobile)
    Heading (h1-crm-les-mores | mobile)
      String: "Germantown's Premier"
      <br>
      String: "ART GALLERY & VENUE"
    Block (hero-subheader-1 | mobile)
      String: "ART AND LIFE."
      <br>
      String: "LIFE AND ART."
      <br>
      String: "LIFE AS ART."
    Link (button-1-pw-cream | mobile)
      String: "SCHEDULE A TOUR"
```

**Hugo Element Structure:**

```text
section.hero (background-image inline style)
  div.hero__content
    h1.hero__title
      "Germantown's Premier"
      <br>
      "ART GALLERY & VENUE"
    div.hero__tagline.tagline
      Lines from data file with <br> separators
    div.hero__cta
      a.btn.btn-secondary
```

- [x] Hero section present
- [x] Background image present (different implementation)
- [x] Title with two lines present
- [x] Tagline with three lines present
- [x] CTA button present
- [ ] Webflow uses `<img>` element; Hugo uses CSS background
- [ ] Webflow content marked as `hidden` (may be JS-revealed)

---

### 3. Venue Gallery Section

| Aspect          | Webflow                                                          | Hugo                         | Status                   |
|-----------------|------------------------------------------------------------------|------------------------------|--------------------------|
| Section Class   | `section_gallery17`                                              | `venue-gallery section`      | Different naming         |
| Container       | `padding-global > container-large > padding-section-large`       | `container`                  | Simplified               |
| Heading         | `h1-les-mores-blk is-centered`                                   | `venue-gallery__heading`     | Different naming         |
| Subtext         | `text-size-medium` (Paragraph)                                   | `venue-gallery__subtext`     | Different naming         |
| Gallery Wrapper | `gallery17_component`                                            | `venue-gallery__carousel`    | Different naming         |
| Slider          | `gallery17_slider w-slider`                                      | `venue-gallery__track`       | Different component      |
| Slider Mask     | `gallery17_mask w-slider-mask`                                   | (not present - custom JS)    | Different approach       |
| Slides          | `gallery17_slide w-slide`                                        | `venue-gallery__slide`       | Similar concept          |
| Lightbox        | `gallery17_lightbox-link w-inline-block w-lightbox`              | `lightbox` (separate div)    | Different implementation |
| Image Wrapper   | `gallery17_image-wrapper`                                        | (not present)                | Missing                  |
| Image           | `gallery17_image`                                                | `venue-gallery__image`       | Different naming         |
| Left Arrow      | `gallery17_arrow_left hide-mobile-landscape w-slider-arrow-left` | `venue-gallery__arrow--prev` | Different naming         |
| Right Arrow     | `gallery17_arrow hide-mobile-landscape w-slider-arrow-right`     | `venue-gallery__arrow--next` | Different naming         |
| Navigation Dots | `gallery17_slide-nav w-slider-nav w-slider-nav-invert w-round`   | `venue-gallery__nav`         | Different naming         |

**Webflow Slide Count:** 10 slides with lightbox links
**Hugo Slide Count:** Dynamic from `assets/images/venue/*`

- [x] Venue gallery section present
- [x] Heading "OUR VENUE" present
- [x] Subtext about Instagram present
- [x] Image carousel/slider present
- [x] Navigation arrows present
- [x] Navigation dots present
- [x] Lightbox functionality present
- [ ] Webflow uses native slider; Hugo uses custom JS implementation
- [ ] Webflow has nested container hierarchy (`padding-global > container-large > padding-section-large`)

---

### 4. Event Types Section

| Aspect          | Webflow                                                | Hugo                      | Status                 |
|-----------------|--------------------------------------------------------|---------------------------|------------------------|
| Section Class   | `event-wrap`                                           | `events section`          | Different naming       |
| Container       | `event-wrap-container mobile w-container`              | `container`               | Different naming       |
| Header Block    | `event-div-block-1`                                    | (integrated into section) | Simplified             |
| Section Heading | `section-header-h2 drk-bkgrnd mobile vertical`         | `events__heading`         | Different naming       |
| Icons Grid      | `event-div-block-2 mobile vertical`                    | `events__grid`            | Different naming       |
| Event Item      | `div-block-9` or `div-block-11` or `div-block-14-copy` | `events__item`            | Inconsistent in WF     |
| Event Icon      | `image event-wrap`                                     | `events__icon > img`      | Similar                |
| Event Label     | `heading-3 events mobile`                              | `events__label`           | Different element type |
| CTA Button      | `button-1-pw-cream outline event hidden w-button`      | `btn btn-outline`         | Different naming       |

**Webflow Event Types (6):**

1. WEDDING (icon: `PW_Icon_Rings_Light2.png`)
2. PRIVATE PARTY (icon: `PW_Icon_Cheers_Light3.png`)
3. CORPORATE PARTY (icon: `PW_Icon_Lanyard_Light3.png`)
4. BIRTHDAY (icon: `PW_Icon_Cake_Light2.png`)
5. DANCE (icon: `PW_Icon_Disco_Light3.png`)
6. BABY SHOWER (icon: `PW_Icon_Rattle_Light3.png`)

**Hugo Event Types:** Driven by `data/events.yaml`

- [x] Event types section present
- [x] Section heading present
- [x] Grid of event types present
- [x] Icons for each event type
- [x] Labels for each event type
- [ ] Webflow CTA button marked `hidden` - verify if needed
- [ ] Webflow uses `<h3>` for labels; Hugo uses `<span>`
- [ ] Webflow has inconsistent block classes (`div-block-9`, `div-block-11`, `div-block-14-copy`)

---

### 5. About Section

| Aspect          | Webflow                                      | Hugo                    | Status              |
|-----------------|----------------------------------------------|-------------------------|---------------------|
| Section Class   | `section cc-store-home-wrap`                 | `about section`         | Different naming    |
| Container       | `container`                                  | `container`             | Same                |
| Content Wrapper | `home-content-wrap`                          | (integrated)            | Simplified          |
| Main Heading    | `h1-les-mores-blk mobile vertical`           | `about__heading`        | Different naming    |
| Grid Layout     | `about-grid`                                 | `about__block`          | Different approach  |
| Content Block   | `div-block-4 > home-section-wrap`            | `about__content`        | Simplified          |
| Subtitle        | `heading-2 mobile vertical`                  | `about__subtitle`       | Different naming    |
| Body Text       | `paragraph-light`                            | `about__text > p`       | Different structure |
| CTA Button      | `button-1-pw-black mobile vertical w-button` | `btn btn-dark`          | Different naming    |
| Image           | `image_home_wrap mobile vertical`            | `about__image > img`    | Different structure |
| Second Grid     | `about-grid cc-about-2 mobile`               | `about__block--reverse` | Different naming    |

**Webflow "About" Subsections:**

1. "Who we are" - Eden & Lyndal photo
2. "What we do" - Group shot photo

**Hugo "About" Subsections:** Driven by `data/about.yaml` with `reverse` flag

- [x] About section present
- [x] Main heading "ABOUT US" present
- [x] "Who we are" subsection present
- [x] "What we do" subsection present
- [x] Team photo present
- [x] Group photo present
- [x] CTA buttons present
- [ ] Webflow uses CSS Grid (`w-layout-grid`); Hugo uses flexbox blocks
- [ ] Webflow uses `<h1>` for subsection titles; Hugo uses `<h2>`

---

### 6. CTA Banner Section

| Aspect          | Webflow                              | Hugo                  | Status           |
|-----------------|--------------------------------------|-----------------------|------------------|
| Section Class   | `section cc-cta`                     | `cta-banner`          | Different naming |
| Container       | `container`                          | (integrated)          | Simplified       |
| Content Wrapper | `cta-wrap > div-block-15 > cta-text` | `cta-banner__content` | Simplified       |
| Heading         | `cta-heading`                        | `cta-banner__heading` | Different naming |
| Body Text       | `paragraph-bigger`                   | `cta-banner__text`    | Different naming |
| CTA Button      | `button-1-pw-black w-button`         | `btn btn-secondary`   | Different naming |

**Webflow Content:**

- Heading: "Let's celebrate!"
- Text: "Book your next event at Pike & West and create unforgettable memories!"
- CTA: "SCHEDULE A TOUR"

**Hugo Content:** Matches via `data/cta_banner.yaml`

- [x] CTA banner section present
- [x] Heading present
- [x] Body text present
- [x] CTA button present
- [x] Background image implemented
- [ ] Webflow has deeper nesting (`cta-wrap > div-block-15 > cta-text`)

---

### 7. Footer Section

| Aspect         | Webflow                                         | Hugo                           | Status              |
|----------------|-------------------------------------------------|--------------------------------|---------------------|
| Section Class  | `section footer-wrap mobile vertical`           | `footer`                       | Different naming    |
| Container      | `footer-wrap-1 mobile vertical w-container`     | `footer__container`            | Different naming    |
| Logo Block     | `footer-logo-link-block mobile vertical`        | `footer__logo`                 | Different naming    |
| Logo Image     | `footer-logo mobile vertical`                   | `footer__logo > img`           | Different structure |
| Contact Link   | `footer-link mobile vertical button-1-pw-cream` | `footer__links > footer__link` | Different structure |
| Social Block   | `div-block-16`                                  | `footer__social`               | Different naming    |
| Instagram Link | `link-block-2 w-inline-block`                   | `footer__social-link`          | Different naming    |
| Instagram Icon | `image-3`                                       | `footer__social-link > img`    | Different naming    |
| Facebook Link  | `link-block-3 w-inline-block`                   | `footer__social-link`          | Different naming    |
| Facebook Icon  | `image-2`                                       | `footer__social-link > img`    | Different naming    |
| Copyright      | `footer-copyright mobile vertical`              | `footer__copyright`            | Different naming    |

**Webflow Footer Elements:**

- Logo (vanilla logomark)
- Empty link spacer
- "Contact Us" styled link
- Social icons block (Instagram + Facebook)
- Copyright text

**Hugo Footer Elements:**

- Logo (via Hugo resources)
- Menu links (via `site.Menus.footer`)
- Social icons (via `site.Params.social`)
- Copyright text (dynamic year)

- [x] Footer section present
- [x] Logo present
- [x] Contact link present
- [x] Social media links present (Instagram, Facebook)
- [x] Copyright text present
- [x] Dynamic year in Hugo (vs hardcoded 2023 in Webflow)
- [ ] Webflow has empty link spacer element

---

## Class Name Mapping Reference

### Common Elements

| Webflow Class    | Hugo Class (BEM)       |
|------------------|------------------------|
| `w-button`       | `btn`                  |
| `w-nav`          | `header__nav`          |
| `w-container`    | `container`            |
| `w-slider`       | Custom JS carousel     |
| `w-slide`        | `venue-gallery__slide` |
| `w-inline-block` | (inline styling)       |
| `w-lightbox`     | `lightbox`             |

### Section-Specific Mappings

| Webflow Class                | Hugo Class                |
|------------------------------|---------------------------|
| `navbar1_component`          | `header`                  |
| `navbar1_logo-link`          | `header__logo`            |
| `navbar1_menu`               | `header__nav`             |
| `navbar-button-gold`         | `header__link--primary`   |
| `hero-header-section`        | `hero`                    |
| `h1-crm-les-mores`           | `hero__title`             |
| `hero-subheader-1`           | `hero__tagline`           |
| `button-1-pw-cream`          | `btn btn-secondary`       |
| `section_gallery17`          | `venue-gallery`           |
| `gallery17_component`        | `venue-gallery__carousel` |
| `gallery17_slide`            | `venue-gallery__slide`    |
| `gallery17_image`            | `venue-gallery__image`    |
| `event-wrap`                 | `events`                  |
| `event-wrap-container`       | `container`               |
| `section-header-h2`          | `events__heading`         |
| `heading-3 events`           | `events__label`           |
| `section cc-store-home-wrap` | `about`                   |
| `about-grid`                 | `about__block`            |
| `heading-2`                  | `about__subtitle`         |
| `paragraph-light`            | `about__text`             |
| `button-1-pw-black`          | `btn btn-dark`            |
| `image_home_wrap`            | `about__image`            |
| `section cc-cta`             | `cta-banner`              |
| `cta-heading`                | `cta-banner__heading`     |
| `paragraph-bigger`           | `cta-banner__text`        |
| `section footer-wrap`        | `footer`                  |
| `footer-logo`                | `footer__logo`            |
| `footer-link`                | `footer__link`            |
| `footer-copyright`           | `footer__copyright`       |

---

## Missing Elements Checklist

### Elements Missing from Hugo

- [ ] **Webflow Interactions:** Animation states (`w-nav-button` interactions)
- [ ] **Empty Link Spacer:** Footer has empty link element in Webflow
- [ ] **Nested Container Hierarchy:** Webflow uses `padding-global > container-large > padding-section-large` pattern
- [ ] **Combo Classes:** Many Webflow elements use combo classes like `mobile`, `vertical`, `hidden`
- [ ] **Image Element in Hero:** Webflow uses `<img>` tag, Hugo uses CSS background
- [ ] **Lightbox JSON Config:** Webflow has `<script type="application/json">` for lightbox config
- [ ] **Slider Native Controls:** Webflow uses native `w-slider` with mask, Hugo uses custom JS

### Elements Present but Structurally Different

| Element        | Webflow Approach           | Hugo Approach                        |
|----------------|----------------------------|--------------------------------------|
| Hero Image     | `<img>` element            | CSS `background-image`               |
| Gallery Slider | Native Webflow slider      | Custom JavaScript carousel           |
| Event Labels   | `<h3>` heading elements    | `<span>` elements                    |
| About Layout   | CSS Grid (`w-layout-grid`) | Flexbox blocks with reverse modifier |
| Menu Links     | Explicit buttons in markup | Hugo menu system                     |
| Social Icons   | Custom PNG images          | PNG with SVG fallback                |

---

## Overall Status Summary

| Section           | Status     | Notes                                        |
|-------------------|------------|----------------------------------------------|
| Header/Navigation | Functional | Different class naming, simplified structure |
| Hero              | Functional | Different image approach (CSS vs img)        |
| Venue Gallery     | Functional | Custom JS instead of Webflow slider          |
| Event Types       | Functional | Different heading level for labels           |
| About             | Functional | Different grid approach                      |
| CTA Banner        | Functional | Simplified nesting                           |
| Footer            | Functional | Different structure, dynamic year            |

### Legend

- Functional = Working but may need visual polish
- Partial = Some elements missing or incomplete
- Missing = Section not implemented

---

## Recommendations

1. **Visual Regression Testing:** Run BackstopJS at all breakpoints to catch visual discrepancies
2. **Animation Review:** Document all Webflow interactions that need JS implementation
3. **Class Consolidation:** Consider if any Webflow class names should be adopted for CSS parity
4. **Image Strategy:** Decide if hero should use `<img>` element for SEO/accessibility
5. **Slider Enhancement:** Ensure custom gallery slider matches Webflow behavior (autoplay, infinite, etc.)
6. **Responsive Testing:** Verify `mobile`, `vertical`, `hidden` modifier behaviors at breakpoints

---

## Files Referenced

### Webflow Source

- `/Users/colinneller/Projects/pikeandwest.com/webflow-export/index.html`
- `/Users/colinneller/Projects/pikeandwest.com/webflow-mcp-analysis/elements/homepage-raw.json`

### Hugo Implementation

- `/Users/colinneller/Projects/pikeandwest.com/layouts/index.html`
- `/Users/colinneller/Projects/pikeandwest.com/layouts/_default/baseof.html`
- `/Users/colinneller/Projects/pikeandwest.com/layouts/partials/header.html`
- `/Users/colinneller/Projects/pikeandwest.com/layouts/partials/hero.html`
- `/Users/colinneller/Projects/pikeandwest.com/layouts/partials/venue-gallery.html`
- `/Users/colinneller/Projects/pikeandwest.com/layouts/partials/event-types.html`
- `/Users/colinneller/Projects/pikeandwest.com/layouts/partials/about.html`
- `/Users/colinneller/Projects/pikeandwest.com/layouts/partials/cta-banner.html`
- `/Users/colinneller/Projects/pikeandwest.com/layouts/partials/footer.html`

### Data Files

- `/Users/colinneller/Projects/pikeandwest.com/data/hero.yaml`
- `/Users/colinneller/Projects/pikeandwest.com/data/venue_gallery.yaml`
- `/Users/colinneller/Projects/pikeandwest.com/data/events.yaml`
- `/Users/colinneller/Projects/pikeandwest.com/data/about.yaml`
- `/Users/colinneller/Projects/pikeandwest.com/data/cta_banner.yaml`
