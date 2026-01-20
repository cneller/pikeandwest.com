# Webflow Parity: Non-Homepage Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Achieve visual and content parity between Hugo and Webflow for Contact page, Gallery Application page, and global elements (header, footer).

**Architecture:** Fix SCSS styling values to match Webflow CSS exactly, update Hugo templates for semantic HTML and correct content structure, and configure HoneyBook widget integration for Gallery Application.

**Tech Stack:** Hugo 0.146.0+, SCSS, Hugo templates (Go), HoneyBook JavaScript widget

---

## Task 1: Fix Header Navigation Button Padding

**Files:**

- Modify: `assets/scss/_header.scss:216`

**Problem:** Hugo uses `9px 25px` padding, Webflow uses `12px 25px` (0.75rem = 12px). Buttons appear 3px shorter.

**Step 1: Update padding value**

In `assets/scss/_header.scss`, change line 216:

```scss
// BEFORE
padding: 9px 25px; // Webflow: padding-top/bottom 9px

// AFTER
padding: 12px 25px; // Webflow: 0.75rem 1.5625rem (12px 25px)
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 3: Visual verification**

Run: `hugo server`
Navigate to: <http://localhost:1313>
Check: Header navigation buttons should be 6px taller (3px top + 3px bottom)

**Step 4: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "fix(header): correct nav button padding to match Webflow (12px vs 9px)"
```

---

## Task 2: Remove Blog Menu Item from Navigation

**Files:**

- Modify: `config/_default/menus.toml:15-18`

**Problem:** Blog menu item exists in Hugo but not on live Webflow site. Shows 3 nav items instead of 2.

**Step 1: Remove Blog from main menu**

In `config/_default/menus.toml`, delete lines 15-18:

```toml
# BEFORE (lines 15-18 to DELETE)
[[main]]
  name = "Blog"
  url = "/blog/"
  weight = 3
```

**Step 2: Keep Blog in footer menu (optional, but maintain for now)**

Footer menu stays unchanged - Blog link can remain in footer.

**Step 3: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 4: Visual verification**

Run: `hugo server`
Navigate to: <http://localhost:1313>
Check: Header should show only 2 buttons: "Contact Us" and "Artists"

**Step 5: Commit**

```bash
git add config/_default/menus.toml
git commit -m "fix(nav): remove Blog from main menu to match Webflow"
```

---

## Task 3: Increase Hamburger Touch Target Size

**Files:**

- Modify: `assets/scss/_header.scss:45-46`

**Problem:** Hugo hamburger is 30x24px, Webflow is 48x48px. Smaller touch target hurts mobile UX.

**Step 1: Update hamburger dimensions**

In `assets/scss/_header.scss`, change lines 45-46:

```scss
// BEFORE
width: 30px;
height: 24px;

// AFTER
width: 44px;
height: 44px;
```

**Step 2: Center the inner bars within larger touch target**

The inner element already uses `top: 50%; left: 50%; transform: translate(-50%, -50%)` so it will auto-center.

**Step 3: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 4: Visual verification**

Run: `hugo server`
Navigate to: <http://localhost:1313> (resize to mobile width < 767px)
Check: Hamburger button has larger tap area but bars remain same visual size

**Step 5: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "fix(header): increase hamburger touch target to 44x44px for better mobile UX"
```

---

## Task 4: Fix Contact Page Typography - Detail Labels

**Files:**

- Modify: `assets/scss/_contact.scss:72-80`

**Problem:** Hugo labels use 14px/400/1.4px letter-spacing. Webflow uses 12px/500/1px.

**Step 1: Update label styling**

In `assets/scss/_contact.scss`, change lines 72-80:

```scss
// BEFORE
strong {
  display: block;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-weight-regular;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  margin-bottom: $spacing-xs;
  color: $color-medium-gray;
}

// AFTER
strong {
  display: block;
  font-family: $font-primary; // Raleway (matches Webflow)
  font-size: 12px; // Webflow: 12px
  font-weight: $font-weight-medium; // Webflow: 500
  text-transform: uppercase;
  letter-spacing: 1px; // Webflow: 1px
  line-height: 20px; // Webflow: 20px
  margin-bottom: 10px; // Webflow: 10px (not $spacing-xs which is 4px)
  color: $color-medium-gray;
}
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add assets/scss/_contact.scss
git commit -m "fix(contact): correct label typography to match Webflow (12px/500/1px)"
```

---

## Task 5: Fix Contact Page Typography - Detail Values

**Files:**

- Modify: `assets/scss/_contact.scss:82-89`

**Problem:** Hugo uses Montserrat 16px. Webflow uses Raleway 14px.

**Step 1: Update value text styling**

In `assets/scss/_contact.scss`, change lines 82-89:

```scss
// BEFORE
span,
a {
  font-family: $font-secondary;
  font-size: 16px;
  line-height: 1.6;
  color: $color-black;
}

// AFTER
span,
a {
  font-family: $font-primary; // Webflow: Raleway (not Montserrat)
  font-size: 14px; // Webflow: 0.875rem (14px)
  line-height: 24px; // Webflow: 1.5rem (24px)
  color: $color-black;
}
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add assets/scss/_contact.scss
git commit -m "fix(contact): correct detail value typography to Raleway 14px"
```

---

## Task 6: Fix Contact Page Section Title Size

**Files:**

- Modify: `assets/scss/_contact.scss:6-15`

**Problem:** Hugo section-title uses 32px. Webflow h1 default is 36px.

**Step 1: Update section title font size**

In `assets/scss/_contact.scss`, change lines 6-15:

```scss
// BEFORE
.section-title {
  font-family: $font-display;
  font-size: 32px;
  font-weight: $font-weight-regular;
  text-transform: uppercase;
  letter-spacing: 3.2px;
  text-align: center;
  margin-bottom: $spacing-xl;
  color: $color-black;
}

// AFTER
.section-title {
  font-family: $font-display;
  font-size: 36px; // Webflow h1 default
  font-weight: $font-weight-regular;
  text-transform: uppercase;
  letter-spacing: 0.1em; // Webflow: 0.1em (scales with font size)
  text-align: center;
  margin-top: 10px; // Webflow: margin-top: 10px
  margin-bottom: 30px; // Webflow: margin-bottom: 30px
  color: $color-black;
}
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add assets/scss/_contact.scss
git commit -m "fix(contact): correct section-title to 36px with Webflow margins"
```

---

## Task 7: Fix Contact Page Map Height

**Files:**

- Modify: `assets/scss/_contact.scss:49-55`

**Problem:** Hugo map is 300px mobile, 350px desktop. Webflow uses 400px.

**Step 1: Update map height**

In `assets/scss/_contact.scss`, change lines 49-55:

```scss
// BEFORE
&__map {
  width: 100%;
  height: 300px;

  @media (min-width: $breakpoint-md) {
    height: 350px;
  }

// AFTER
&__map {
  width: 100%;
  height: 400px; // Webflow: 400px desktop

  @media (max-width: $breakpoint-md) {
    height: 100%; // Webflow: responsive on mobile
    min-height: 300px;
  }
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add assets/scss/_contact.scss
git commit -m "fix(contact): correct map height to 400px matching Webflow"
```

---

## Task 8: Fix Contact Page Grid Breakpoint

**Files:**

- Modify: `assets/scss/_contact.scss:43`

**Problem:** Hugo uses `min-width: $breakpoint-md` (768px). Webflow changes at 767px (max-width).

**Step 1: Adjust breakpoint logic**

In `assets/scss/_contact.scss`, change line 43:

```scss
// BEFORE
@media (min-width: $breakpoint-md) {

// AFTER
@media (min-width: $breakpoint-md + 1) { // 768px (Webflow: > 767px)
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add assets/scss/_contact.scss
git commit -m "fix(contact): align grid breakpoint with Webflow (768px)"
```

---

## Task 9: Add Mobile Text Alignment for Contact Details

**Files:**

- Modify: `assets/scss/_contact.scss` (add new block after line 98)

**Problem:** Webflow centers contact details text on mobile (max-width: 479px). Hugo doesn't.

**Step 1: Add mobile portrait media query**

In `assets/scss/_contact.scss`, add after the `&__detail` block (after line 98):

```scss
// Mobile portrait: center text (Webflow behavior)
@media (max-width: $breakpoint-sm) {
  &__details {
    text-align: center;
  }

  &__detail {
    strong,
    span,
    a {
      text-align: center;
    }
  }
}
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 3: Visual verification**

Run: `hugo server`
Navigate to: <http://localhost:1313/contact/>
Resize browser to < 479px
Check: Contact details (location, hours, phone) should be centered

**Step 4: Commit**

```bash
git add assets/scss/_contact.scss
git commit -m "fix(contact): center details text on mobile portrait (479px)"
```

---

## Task 10: Update Hours Text with Line Break

**Files:**

- Modify: `config/_default/params.toml:11`

**Problem:** Webflow has `<br>` between sentences. Hugo is single line.

**Step 1: Update hours text**

In `config/_default/params.toml`, change line 11:

```toml
# BEFORE
hours = "Available by appointment only. Call or email to reserve a tour."

# AFTER
hours = "Available by appointment only.<br>Call or email to reserve a tour."
```

**Step 2: Update template to render HTML**

In `layouts/page/contact.html`, line 52 needs `safeHTML`:

```go-html-template
<!-- BEFORE -->
<span>{{ .Site.Params.contact.hours }}</span>

<!-- AFTER -->
<span>{{ .Site.Params.contact.hours | safeHTML }}</span>
```

**Step 3: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 4: Commit**

```bash
git add config/_default/params.toml layouts/page/contact.html
git commit -m "fix(contact): add line break in hours text matching Webflow"
```

---

## Task 11: Add Semantic HTML to Contact Page

**Files:**

- Modify: `layouts/page/contact.html:23-33` and `5-14`

**Problem:** Webflow uses `<address>` tags for map and form containers. Hugo uses `<div>`.

**Step 1: Update form container**

In `layouts/page/contact.html`, change lines 5-14:

```go-html-template
<!-- BEFORE -->
<div class="form-embed">
  {{ with .Site.Params.forms.contactEmbed }}
  <iframe src="{{ . }}" title="Contact Form" loading="lazy"></iframe>
  {{ else }}
  <p>
    Contact form coming soon. Please call us at {{
    .Site.Params.contact.phone }}.
  </p>
  {{ end }}
</div>

<!-- AFTER -->
<address class="form-embed">
  {{ with .Site.Params.forms.contactEmbed }}
  <iframe src="{{ . }}" title="Contact Form" loading="lazy"></iframe>
  {{ else }}
  <p>
    Contact form coming soon. Please call us at {{
    .Site.Params.contact.phone }}.
  </p>
  {{ end }}
</address>
```

**Step 2: Update map container**

In `layouts/page/contact.html`, change lines 23-33:

```go-html-template
<!-- BEFORE -->
<div class="find-us__map">

<!-- AFTER -->
<address class="find-us__map">
```

And the closing tag:

```go-html-template
<!-- BEFORE -->
</div>

<!-- AFTER -->
</address>
```

**Step 3: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 4: Commit**

```bash
git add layouts/page/contact.html
git commit -m "fix(contact): use semantic address tags for form and map containers"
```

---

## Task 12: Fix Form Container Responsive Styling

**Files:**

- Modify: `assets/scss/_contact.scss:18-31`

**Problem:** Hugo form container lacks Webflow's width constraints and mobile min-height.

**Step 1: Update form-embed styling**

In `assets/scss/_contact.scss`, change lines 18-31:

```scss
// BEFORE
.contact-form {
  padding: $spacing-3xl 0;

  .form-embed {
    max-width: 600px;
    margin: 0 auto;
    background-color: $color-cream;

    iframe {
      width: 100%;
      min-height: 500px;
      border: 0;
    }
  }
}

// AFTER
.contact-form {
  padding: $spacing-3xl 0;
  margin-top: 37px; // Webflow: margin-top: 37px

  .form-embed {
    width: 75%; // Webflow: width: 75%
    max-width: 600px;
    margin: 20px auto; // Webflow: margin: 20px auto
    padding: 0;
    overflow: hidden;
    border: 1px solid #eee; // Webflow: border: 1px #eee

    iframe {
      width: 100%;
      min-height: 500px;
      border: 0;
      display: flex;
      flex-grow: 1;
    }

    // Mobile: full width and viewport height
    @media (max-width: $breakpoint-md) {
      width: 100%;
      min-height: 100vh; // Webflow: min-height: 100vh on mobile
      margin-top: 1.25rem;
      margin-bottom: 1.25rem;
      display: flex;
    }
  }
}
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add assets/scss/_contact.scss
git commit -m "fix(contact): match Webflow form container dimensions and responsive behavior"
```

---

## Task 13: Configure HoneyBook Widget for Gallery Application

**Files:**

- Modify: `config/_default/params.toml:27`
- Modify: `layouts/page/gallery-application.html:8-21`

**Problem:** Gallery Application uses iframe fallback instead of HoneyBook JavaScript widget.

**Step 1: Verify placement ID in config**

The ID is already in `config/_default/params.toml:27`:

```toml
galleryApplicationPlacementId = "65174362ef543a000898bc37"
```

**Step 2: Replace iframe with HoneyBook widget**

In `layouts/page/gallery-application.html`, replace lines 8-21:

```go-html-template
<!-- BEFORE -->
<div class="form-embed">
  {{ with .Site.Params.forms.galleryApplicationEmbed }}
  <iframe
    src="{{ . }}"
    title="Gallery Application Form"
    loading="lazy"
  ></iframe>
  {{ else }}
  <p>
    Application form coming soon. Please email us at
    events@pikeandwest.com.
  </p>
  {{ end }}
</div>

<!-- AFTER -->
<div class="form-embed">
  {{ with .Site.Params.forms.galleryApplicationPlacementId }}
  <!-- HoneyBook Widget Container -->
  <div class="hb-p-{{ . }}-1"></div>
  <!-- HoneyBook Tracking Pixel -->
  <img height="1" width="1" style="display:none"
       src="https://www.honeybook.com/p.png?pid={{ . }}" alt="">
  <!-- HoneyBook Widget Script -->
  <script>
    (function(h,b,s,n,i,p,e,t) {
      h._HB_ = h._HB_ || {};
      h._HB_.pid = i;
      t=b.createElement(s);
      t.type="text/javascript";
      t.async=!0;
      t.src=n;
      e=b.getElementsByTagName(s)[0];
      e.parentNode.insertBefore(t,e);
    })(window,document,"script","https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.min.js","{{ . }}");
  </script>
  {{ else }}
  <p>
    Application form coming soon. Please email us at
    events@pikeandwest.com.
  </p>
  {{ end }}
</div>
```

**Step 3: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 4: Visual verification**

Run: `hugo server`
Navigate to: <http://localhost:1313/gallery-application/>
Check: HoneyBook form widget should load (requires internet connection)

**Step 5: Commit**

```bash
git add layouts/page/gallery-application.html
git commit -m "feat(gallery): integrate HoneyBook widget replacing iframe fallback"
```

---

## Task 14: Fix Gallery Application Page Structure

**Files:**

- Modify: `layouts/page/gallery-application.html` (full restructure)

**Problem:** Hugo uses different layout structure than Webflow. Need single column with form above Find Us.

**Step 1: Restructure to match Webflow layout**

Replace entire content of `layouts/page/gallery-application.html`:

```go-html-template
{{ define "main" }}
{{/* Application Form Section */}}
<section class="contact-form section">
  <div class="container contact-form contacts-us">
    <h1 class="section-title">Gallery Application</h1>
    <div class="form-embed">
      {{ with .Site.Params.forms.galleryApplicationPlacementId }}
      <!-- HoneyBook Widget Container -->
      <div class="hb-p-{{ . }}-1"></div>
      <!-- HoneyBook Tracking Pixel -->
      <img height="1" width="1" style="display:none"
           src="https://www.honeybook.com/p.png?pid={{ . }}" alt="">
      <!-- HoneyBook Widget Script -->
      <script>
        (function(h,b,s,n,i,p,e,t) {
          h._HB_ = h._HB_ || {};
          h._HB_.pid = i;
          t=b.createElement(s);
          t.type="text/javascript";
          t.async=!0;
          t.src=n;
          e=b.getElementsByTagName(s)[0];
          e.parentNode.insertBefore(t,e);
        })(window,document,"script","https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.min.js","{{ . }}");
      </script>
      {{ else }}
      <p>
        Application form coming soon. Please email us at
        events@pikeandwest.com.
      </p>
      {{ end }}
    </div>
  </div>
</section>

{{/* Find Us Section */}}
<section class="find-us section">
  <div class="container">
    <h2 class="section-title">FIND US</h2>
    <div class="find-us__grid">
      <address class="find-us__map">
        {{ with .Site.Params.maps.embed }}
        <iframe
          src="{{ . }}"
          style="border: 0"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Pike & West Location"
        ></iframe>
        {{ end }}
      </address>

      <div class="find-us__details">
        <div class="find-us__detail">
          <strong>OUR LOCATION</strong>
          <a
            href="{{ .Site.Params.contact.googleMapsUrl }}"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ .Site.Params.contact.address }}<br />
            {{ .Site.Params.contact.city }} {{ .Site.Params.contact.state }} {{
            .Site.Params.contact.zip }}
          </a>
        </div>

        <div class="find-us__detail">
          <strong>HOURS</strong>
          <span>{{ .Site.Params.contact.hours | safeHTML }}</span>
        </div>

        <div class="find-us__detail">
          <strong>PHONE</strong>
          <span>{{ .Site.Params.contact.phone }}</span>
        </div>
      </div>
    </div>
  </div>
</section>
{{ end }}
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add layouts/page/gallery-application.html
git commit -m "fix(gallery): restructure to match Webflow layout with shared styles"
```

---

## Task 15: Add Details Spacing to Match Webflow

**Files:**

- Modify: `assets/scss/_contact.scss:64-68`

**Problem:** Hugo uses 24px flex gap. Webflow uses 30px bottom margin per detail.

**Step 1: Update details spacing**

In `assets/scss/_contact.scss`, change lines 64-68:

```scss
// BEFORE
&__details {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  justify-content: center;
}

// AFTER
&__details {
  display: flex;
  flex-direction: column;
  gap: 0; // Remove gap, use margin instead
  justify-content: center;
  padding-left: 20px; // Webflow: padding-left: 20px

  @media (max-width: $breakpoint-md) {
    padding-left: 0;
  }
}
```

**Step 2: Add margin to detail items**

In `assets/scss/_contact.scss`, add to `&__detail`:

```scss
&__detail {
  margin-bottom: 30px; // Webflow: margin-bottom: 30px
  overflow: hidden; // Webflow: overflow: hidden

  &:last-child {
    margin-bottom: 0;
  }

  // ... rest of existing styles
}
```

**Step 3: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 4: Commit**

```bash
git add assets/scss/_contact.scss
git commit -m "fix(contact): match Webflow details spacing (30px margin, 20px padding)"
```

---

## Task 16: Final Visual Regression Test

**Files:**

- None (verification only)

**Step 1: Start Hugo server**

Run: `hugo server`

**Step 2: Test Contact page at all breakpoints**

Navigate to: <http://localhost:1313/contact/>

Test at these widths:

- 1920px (ultra-wide): 2-column grid, 400px map
- 1280px (desktop): 2-column grid, 400px map
- 991px (tablet): 2-column grid, reduced header
- 767px (mobile landscape): 1-column, hamburger visible
- 479px (mobile portrait): centered text, full-width form

**Step 3: Test Gallery Application page at all breakpoints**

Navigate to: <http://localhost:1313/gallery-application/>

Test at same breakpoints. Verify:

- HoneyBook widget loads
- Find Us section matches Contact page
- Typography is consistent

**Step 4: Test Header navigation**

Verify:

- Only 2 buttons: "Contact Us" and "Artists"
- Button padding looks correct (not too short)
- Mobile hamburger has larger touch target
- Menu animation works

**Step 5: Create summary commit**

```bash
git add .
git commit -m "feat: complete Webflow parity for Contact and Gallery Application pages"
```

---

## Summary of Changes

| File                                    | Changes                                                                                                                                                                  |
|-----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `assets/scss/_header.scss`              | Button padding 9px→12px, hamburger 30x24→44x44                                                                                                                           |
| `assets/scss/_contact.scss`             | Section title 32px→36px, labels 14px→12px, values Montserrat→Raleway 14px, map 300px→400px, breakpoint fix, mobile centering, form container dimensions, details spacing |
| `config/_default/menus.toml`            | Remove Blog from main menu                                                                                                                                               |
| `config/_default/params.toml`           | Hours text with `<br>`                                                                                                                                                   |
| `layouts/page/contact.html`             | Semantic `<address>` tags, `safeHTML` for hours                                                                                                                          |
| `layouts/page/gallery-application.html` | Full restructure, HoneyBook widget integration, shared styles                                                                                                            |

---

Plan complete and saved to `docs/plans/2026-01-20-webflow-parity-non-homepage.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
