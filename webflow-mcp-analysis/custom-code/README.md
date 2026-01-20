# Pike & West Custom Code

Extracted from Webflow export on 2026-01-20.

## Summary

| Code Type                 | Location    | Purpose                                  |
|---------------------------|-------------|------------------------------------------|
| Google Tag Manager        | Head + Body | Analytics tracking (GTM-P8XR8C5S)        |
| Adobe Fonts (Typekit)     | Head        | Le Mores Collection serif font (jxr6fkv) |
| Google Fonts (WebFont.js) | Head        | Montserrat + Oswald fonts                |

## Files

- `site-head.html` - Code for `<head>` section (all pages)
- `site-body.html` - Code for `<body>` opening (all pages)

## Google Tag Manager

- **Container ID:** GTM-P8XR8C5S
- **Implementation:** Standard GTM snippet (head) + noscript fallback (body)

## Fonts

### Adobe Fonts (Typekit)

- **Kit ID:** jxr6fkv
- **Font:** Le Mores Collection (serif, used for headlines)
- **Note:** Requires active Adobe Fonts subscription

### Google Fonts

Loaded via WebFont.js loader:

| Font       | Weights                         |
|------------|---------------------------------|
| Montserrat | 100-900 (all weights + italics) |
| Oswald     | 200, 300, 400, 500, 600, 700    |

## Hugo Migration Notes

1. **GTM:** Already implemented in Hugo via `layouts/partials/analytics/gtm-*.html`
2. **Adobe Fonts:** Need to verify Typekit kit is accessible or use self-hosted fonts
3. **Google Fonts:** Can use Hugo's built-in Google Fonts support or keep WebFont.js

## Page-Level Custom Code

No page-specific custom code was found. All custom code is applied site-wide.
