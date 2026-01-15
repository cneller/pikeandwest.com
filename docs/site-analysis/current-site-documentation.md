# Pike & West - Current Webflow Site Documentation

> Comprehensive analysis of pikeandwest.com for Hugo migration

## Site Overview

| Property      | Value                                  |
|---------------|----------------------------------------|
| Domain        | pikeandwest.com                        |
| Platform      | Webflow                                |
| CDN           | Cloudflare                             |
| Business Type | Art Gallery & Event Venue              |
| Location      | 2277 West Street, Germantown, TN 38138 |
| Phone         | 901.206.5575                           |
| Established   | 2023                                   |

## Page Inventory

### 1. Homepage (`/`)

**Title:** Pike & West | Germantown Gallery and Event Venue

**Sections (top to bottom):**

#### Header/Navigation

- Logo: Pike & West (black text with gold fleur-de-lis icon)
- Navigation links: CONTACT US (`/contact`), ARTISTS (`/gallery-application`)
- Style: Fixed white background, minimal

#### Hero Section

- **Headline:** "Germantown's Premier ART GALLERY & VENUE"
- **Tagline:** "ART AND LIFE. LIFE AND ART. LIFE AS ART."
- **CTA Button:** "SCHEDULE A TOUR" → `/contact`
- **Background:** Full-bleed venue exterior photo (white brick building, address "2277 West St")
- **Typography:** Oswald, uppercase, large

#### Our Venue Section

- **Heading:** "OUR VENUE"
- **Subtext:** "Want to see more? Follow us on Instagram."
- **Carousel:** 10 venue/event photos with lightbox
- **Controls:** Previous/Next arrows, dot indicators
- **Layout:** Multi-image slider with thumbnail view

#### Event Types Section

- **Heading:** "The perfect place for your next..."
- **Background:** Dark/black with gold accent
- **Grid:** 6 event type cards (2 rows x 3 columns on desktop)

| Icon              | Label           |
|-------------------|-----------------|
| Wedding ring      | WEDDING         |
| Champagne glasses | PRIVATE PARTY   |
| ID badge          | CORPORATE PARTY |
| Cake slice        | BIRTHDAY        |
| Disco ball        | DANCE           |
| Baby rattle       | BABY SHOWER     |

- **CTA Button:** "Contact Us" → `/contact`
- **Icon Style:** Cream/gold line icons on dark background

#### About Us Section

- **Main Heading:** "ABOUT US"

**Subsection 1: "Who we are"**

- Text about family-owned business, established 2023
- Mentions team members: Eden Neller (venue coordinator), Lyndal Brumley (event coordinator)
- Photo: Two blonde women in white dresses
- CTA: "SCHEDULE A TOUR"

**Subsection 2: "What we do"**

- Text about event types and venue features
- Mentions multi-story patio space
- Photo: Black and white event photo
- CTA: "Contact Us"

#### CTA Banner Section

- **Background:** Disco ball pattern/image
- **Heading:** "Let's celebrate!"
- **Subtext:** "Book your next event at Pike & West and create unforgettable memories!"
- **CTA Button:** "SCHEDULE A TOUR"

#### Footer

- Logo (small)
- "Contact Us" link
- Social icons: Instagram, Facebook
- Copyright: "Copyright © Pike & West 2023. All rights reserved."

---

### 2. Contact Page (`/contact`)

**Title:** Pike & West | Contact Us

**Sections:**

#### Header

- Logo
- Navigation: HOME (`/`)

#### Contact Form Section

- **Heading:** "CONTACT US"
- **Form:** Embedded HoneyBook widget (iframe)
- Form fields (from HoneyBook): Name, Email, Phone, Event Type, Date, Message

#### Find Us Section

- **Heading:** "FIND US"
- **Google Maps:** Embedded iframe
- **Contact Details:**
  - Our Location: 2277 West Street, Germantown TN 38138 (linked to Google Maps)
  - Hours: "Available by appointment only. Call or email to reserve a tour."
  - Phone: 901.206.5575

#### CTA Banner (same as homepage)

#### Footer (same as homepage)

---

### 3. Gallery Application Page (`/gallery-application`)

**Title:** Gallery Application

**Purpose:** Artist submission form for gallery exhibitions

**Sections:**

#### Header

- Logo
- Navigation: HOME (`/`)

#### Application Form Section

- **Heading:** "Gallery Application"
- **Form:** HoneyBook embedded widget

**Form Fields:**

| Field              | Type     | Required | Placeholder/Options                                                             |
|--------------------|----------|----------|---------------------------------------------------------------------------------|
| Full name          | Text     | Yes      | "John Doe"                                                                      |
| Email              | Email    | Yes      | "<me@email.com>"                                                                  |
| Phone              | Tel      | Yes      | "123 456 7890"                                                                  |
| Exhibited before?  | Radio    | Yes      | Yes / No                                                                        |
| Art type           | Textarea | No       | "Please include details regarding the concept/theme, medium, and imagery."      |
| Website            | URL      | No       | "If none, skip. You can email us photos of your work at <events@pikeandwest.com>" |
| Social media       | URL      | No       | Same as above                                                                   |
| Installation date  | Date     | Yes      | MM/DD/YY picker                                                                 |
| Logistics details  | Textarea | No       | About date flexibility, display duration                                        |
| How heard about us | Dropdown | No       | Select an option                                                                |

- reCAPTCHA protection
- SMS consent notice
- Send button (disabled until form valid)

#### Find Us Section (same as Contact page)

#### CTA Banner (same as homepage)

#### Footer (same as homepage)

---

## Design System

### Color Palette

| Name        | Hex       | RGB                | Usage                          |
|-------------|-----------|--------------------|--------------------------------|
| Black       | `#000000` | rgb(0, 0, 0)       | Primary text, headers          |
| Dark Text   | `#1A1B1F` | rgb(26, 27, 31)    | Body text                      |
| Dark Gray   | `#333333` | rgb(51, 51, 51)    | Secondary text                 |
| Medium Gray | `#434345` | rgb(67, 67, 69)    | Tertiary text                  |
| Gold/Brown  | `#AA6E0B` | rgb(170, 110, 11)  | Buttons, accents, CTAs         |
| Cream       | `#FFF7E1` | rgb(255, 247, 225) | Button backgrounds, highlights |
| White       | `#FFFFFF` | rgb(255, 255, 255) | Page backgrounds               |

### Typography

**Primary Font (Headlines):**

```css
font-family: 'Oswald', sans-serif;
font-weight: 200, 300, 400, 500, 600, 700;
text-transform: uppercase;
letter-spacing: 0.2em; /* expanded tracking */
```

**Secondary Font (Body):**

```css
font-family: 'Montserrat', sans-serif;
font-weight: 100-900 (all weights available);
```

**Google Fonts URL:**

```text
https://fonts.googleapis.com/css?family=Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic|Oswald:200,300,400,500,600,700
```

### Button Styles

**Primary CTA (Gold filled):**

```css
background-color: #AA6E0B;
color: #FFFFFF;
padding: 12px 24px;
text-transform: uppercase;
font-family: 'Oswald', sans-serif;
font-weight: 500;
letter-spacing: 0.1em;
border: none;
```

**Secondary CTA (Cream filled):**

```css
background-color: #FFF7E1;
color: #000000;
padding: 12px 24px;
text-transform: uppercase;
font-family: 'Oswald', sans-serif;
border: 2px solid #000000;
```

**Outline Button:**

```css
background-color: transparent;
color: #AA6E0B;
border: 2px solid #AA6E0B;
```

### Responsive Breakpoints

| Breakpoint    | Width         | Description            |
|---------------|---------------|------------------------|
| Mobile        | < 480px       | Single column, stacked |
| Tablet        | 480px - 768px | 2-column grids         |
| Desktop       | 768px - 992px | Standard layout        |
| Large Desktop | > 992px       | Full layout            |

---

## External Integrations

### Analytics & Tracking

| Service            | Purpose                           |
|--------------------|-----------------------------------|
| Google Tag Manager | Tag management container          |
| Metricool          | Social media analytics            |
| Cloudflare         | CDN, security, challenge platform |

### Form Services

| Service   | Usage                                  |
|-----------|----------------------------------------|
| HoneyBook | Contact form, gallery application form |
| reCAPTCHA | Form spam protection                   |

### Maps & Location

| Service     | Usage                         |
|-------------|-------------------------------|
| Google Maps | Embedded map on contact pages |

### Social Media

| Platform  | URL                                    |
|-----------|----------------------------------------|
| Instagram | <https://www.instagram.com/pikeandwest/> |
| Facebook  | <https://www.facebook.com/pikeandwest>   |

---

## Assets Inventory

### Images Required

**Logo:**

- Pike & West logo (black version)
- Pike & West logo (white version for dark backgrounds)
- Fleur-de-lis icon (gold)

**Hero:**

- Venue exterior photo (main hero image)

**Venue Gallery (10 images):**

- Interior shots
- Event setup photos
- Decorated venue photos
- Patio/outdoor space photos

**Event Type Icons (6):**

- Wedding ring icon (cream/outline)
- Champagne glasses icon
- ID badge icon
- Cake slice icon
- Disco ball icon
- Baby rattle icon

**About Section:**

- Team photo (Eden Neller & Lyndal Brumley)
- Black & white event photo

**Background Images:**

- Disco ball pattern (CTA banner)

### Webflow CSS Source

```text
https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/css/pikeandwest.webflow.shared.f818a7a5d.min.css
```

---

## Technical Notes

### Webflow-Specific Features to Replicate

1. **Image Carousel:** Uses Webflow's native slider component with lightbox
2. **Smooth Scrolling:** Anchor links with smooth scroll behavior
3. **Responsive Images:** Webflow's automatic responsive image handling
4. **Touch Detection:** `w-mod-js` and `w-mod-touch` classes for device detection
5. **Form Handling:** iFrame embeds for HoneyBook - will need to maintain

### Performance Considerations

- Current site loads multiple external scripts (GTM, HoneyBook, Metricool, Cloudflare)
- Images served from Webflow CDN
- CSS minified and bundled by Webflow

### SEO Elements

**Current Meta Tags:**

- Title tags per page
- No visible meta descriptions in source (may be in Webflow settings)
- No structured data detected

**URLs to Preserve:**

- `/` - Homepage
- `/contact` - Contact page
- `/gallery-application` - Artist application

---

## Migration Considerations

### Must Preserve

1. All text content exactly as-is
2. URL structure (no changes)
3. Form functionality (HoneyBook embeds)
4. Social links
5. Contact information
6. Google Maps integration

### Opportunities for Improvement

1. Add structured data (LocalBusiness, EventVenue schemas)
2. Add meta descriptions
3. Optimize images (WebP, lazy loading)
4. Improve Lighthouse scores
5. Add sitemap.xml
6. Add robots.txt
7. Implement proper heading hierarchy

### Risks

1. HoneyBook iframe embeds must work identically
2. GTM configuration must be migrated
3. Domain/DNS transition timing
4. SEO ranking preservation during transition
