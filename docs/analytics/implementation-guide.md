# Analytics Implementation Guide

> Technical implementation details for Pike & West marketing analytics.

## GTM Container Structure

### Container: GTM-P8XR8C5S

The Google Tag Manager container manages all analytics tags for the Pike & West website.

### Tags

| Tag Name          | Type              | Trigger   | Purpose                     |
|-------------------|-------------------|-----------|-----------------------------|
| GA4 Configuration | GA4 Configuration | All Pages | Initialize GA4 tracking     |
| Conversion Linker | Conversion Linker | All Pages | Cross-domain cookie linking |

### Triggers

| Trigger Name | Type      | Conditions     |
|--------------|-----------|----------------|
| All Pages    | Page View | All page views |

### Variables

| Variable Name      | Type     | Value        |
|--------------------|----------|--------------|
| GA4 Measurement ID | Constant | G-Y9PFGHX5Z3 |

## Hugo Implementation

### File Structure

```text
layouts/
├── _default/
│   └── baseof.html          # Includes GTM partials
└── partials/
    ├── gtm-head.html        # GTM script (in <head>)
    └── gtm-body.html        # GTM noscript (after <body>)

config/
└── _default/
    └── params.toml          # GTM container ID
```

### baseof.html Integration

```html
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang }}">
<head>
    {{ partial "gtm-head.html" . }}
    <!-- other head content -->
</head>
<body>
    {{ partial "gtm-body.html" . }}
    <!-- page content -->
</body>
</html>
```

### gtm-head.html

```html
{{ if hugo.IsProduction }}
{{ with site.Params.analytics.googleTagManager }}
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','{{ . }}');</script>
<!-- End Google Tag Manager -->
{{ end }}
{{ end }}
```

### gtm-body.html

```html
{{ if hugo.IsProduction }}
{{ with site.Params.analytics.googleTagManager }}
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ . }}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
{{ end }}
{{ end }}
```

### Configuration

**config/\_default/params.toml:**

```toml
[analytics]
  googleTagManager = "GTM-P8XR8C5S"
```

## Cross-Domain Tracking Setup

### GA4 Configuration

1. Navigate to GA4 Admin > Data Streams > Web
2. Click on the web stream (G-Y9PFGHX5Z3)
3. Click "Configure tag settings"
4. Click "Configure your domains"
5. Add domain condition:
   - Match type: "Ends with"
   - Domain: "pikeandwest.com"

### GTM Conversion Linker

The Conversion Linker tag in GTM automatically:

- Reads `_gl` parameter on incoming URLs
- Appends `_gl` parameter to outgoing cross-domain links
- Maintains first-party cookies across subdomains

### TicketTailor Configuration

1. Log into TicketTailor admin
2. Navigate to Settings > Integrations > Google Analytics
3. Enter Measurement ID: `G-Y9PFGHX5Z3`
4. Enter Primary Domain: `pikeandwest.com`
5. Save changes

TicketTailor's native GA4 integration automatically:

- Reads the `_gl` parameter from incoming URLs
- Sends events to the same GA4 property
- Maintains session continuity

## Testing Procedures

### Local Development

GTM does not load in local development due to `hugo.IsProduction` check:

```bash
# Start dev server (no GTM)
hugo server

# Force production mode (GTM loads)
hugo server --environment production
```

### Debug Mode

Append `?debug_mode=true` to any URL to enable GA4 DebugView:

```text
https://beta.pikeandwest.com/?debug_mode=true
https://beta.pikeandwest.com/contact?debug_mode=true
```

Then open GA4 DebugView to see events in real-time:
<https://analytics.google.com/analytics/web/#/a300399219p424998364/admin/debugview>

### Network Request Verification

1. Open browser DevTools > Network tab
2. Filter by "google" or "analytics"
3. Look for these requests:

| Request                          | Indicates           |
|----------------------------------|---------------------|
| `googletagmanager.com/gtm.js`    | GTM loading         |
| `google.com/ccm/collect`         | GTM data collection |
| `analytics.google.com/g/collect` | GA4 events          |

### GA4 Request Parameters

When inspecting `g/collect` requests, look for:

| Parameter | Description             | Example            |
|-----------|-------------------------|--------------------|
| `tid`     | Measurement ID          | `G-Y9PFGHX5Z3`     |
| `en`      | Event name              | `page_view`        |
| `dl`      | Document location (URL) | Full page URL      |
| `dt`      | Document title          | Page title         |
| `cid`     | Client ID               | Random UUID        |
| `sid`     | Session ID              | Session identifier |

### Cross-Domain Verification

1. Navigate to main site
2. Find link to tix.pikeandwest.com
3. Hover over link and check URL in browser status bar
4. Should include `_gl=` parameter
5. Click link and verify in GA4 that session continues

## Custom Event Implementation

### Contact Form Event

To track contact form submissions:

**Option 1: dataLayer Push**

```html
<form id="contact-form" onsubmit="submitContactForm(event)">
  <!-- form fields -->
</form>

<script>
function submitContactForm(event) {
  // After successful submission
  dataLayer.push({
    'event': 'contact_request',
    'form_id': 'contact-form',
    'form_name': 'Contact Request'
  });
}
</script>
```

**Option 2: GTM Form Submission Trigger**

1. Create trigger: Form Submission
2. Trigger on: Form ID equals "contact-form"
3. Create tag: GA4 Event
4. Event name: `contact_request`

### E-commerce Events

TicketTailor handles e-commerce events natively:

- `begin_checkout` - When user starts checkout
- `purchase` - When transaction completes

These events include standard e-commerce parameters:

- `transaction_id`
- `value`
- `currency`
- `items[]`

## Deployment Checklist

### Before Go-Live

- [ ] Verify GTM container ID in `params.toml`
- [ ] Confirm gtm-head.html and gtm-body.html are included in baseof.html
- [ ] Test GTM loading in production build
- [ ] Verify GA4 receiving data in Realtime report
- [ ] Test cross-domain tracking with debug mode
- [ ] Confirm TicketTailor GA4 integration settings

### After Go-Live

- [ ] Monitor GA4 Realtime for first 24 hours
- [ ] Check for self-referrals from tix.pikeandwest.com
- [ ] Verify session continuity in User Explorer
- [ ] Test purchase event with real transaction
- [ ] Set up custom alerts for anomalies

## Troubleshooting

### GTM Not Loading

1. Check `hugo.IsProduction` - are you in production mode?
2. Verify `site.Params.analytics.googleTagManager` is set
3. Check browser console for errors
4. Verify no ad blockers are interfering

### GA4 Not Receiving Data

1. Verify GTM is loading (check Network tab)
2. Check GA4 Measurement ID matches
3. Use GA4 DebugView with `?debug_mode=true`
4. Check GTM Preview mode for tag firing

### Cross-Domain Not Working

1. Verify GA4 domain configuration
2. Check Conversion Linker tag is firing
3. Verify `_gl` parameter appears in URLs
4. Check TicketTailor GA4 settings match
5. Test with same browser/device (not incognito)

### Self-Referrals Appearing

If tix.pikeandwest.com appears as referral source:

1. Check GA4 cross-domain configuration
2. Verify TicketTailor primary domain setting
3. Add to GA4 "Unwanted Referrals" if needed

## Version History

| Date       | Change                                    | Commit  |
|------------|-------------------------------------------|---------|
| 2026-01-19 | Consolidated GTM into production partials | 49e6d04 |
| 2026-01-19 | Initial GTM/GA4 implementation            | -       |
