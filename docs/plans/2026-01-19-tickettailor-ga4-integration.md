# TicketTailor + GA4 Cross-Domain Tracking Integration

> Integrating tix.pikeandwest.com (TicketTailor) with Pike & West GA4 for complete visitor journey tracking.

## Overview

This document outlines how to configure cross-domain tracking between your main website (`www.pikeandwest.com`) and your TicketTailor custom domain (`tix.pikeandwest.com`) to ensure seamless user journey tracking in Google Analytics 4.

## Current GA4 Configuration

| Setting                | Value                          |
|------------------------|--------------------------------|
| **GA4 Measurement ID** | `G-Y9PFGHX5Z3`                 |
| **Property ID**        | `424998364`                    |
| **Account ID**         | `300399219`                    |
| **Stream ID**          | `6676080268`                   |
| **Stream URL**         | `https://www.pikeandwest.com/` |

### Current Cross-Domain Configuration

Your GA4 property already has cross-domain linking configured:

- **Match Type**: Ends with
- **Domain**: `pikeandwest.com`

This configuration automatically covers:

- `www.pikeandwest.com` (main site)
- `tix.pikeandwest.com` (TicketTailor)
- Any other subdomains ending in `pikeandwest.com`

## How Cross-Domain Tracking Works

Cross-domain measurement allows Analytics to accurately attribute activity to a single user as they navigate between domains. Here's the technical overview from [Google's official documentation](https://support.google.com/analytics/answer/10071811):

### The `_gl` Linker Parameter

When a user clicks a link from one domain to another, GA4 appends a `_gl` parameter to the URL:

```text
https://tix.pikeandwest.com/events?_gl=1*1abc2de*_ga*MTIzNDU2Nzg5MC4xNjQwMDAwMDAw
```

This parameter contains encoded cookie data that identifies the user. The destination domain reads this parameter and uses it to maintain the same session.

### Key Technical Details

| Aspect                           | Detail                                                               |
|----------------------------------|----------------------------------------------------------------------|
| **Parameter expiration**         | Linker parameters expire after **2 minutes**                         |
| **Trigger mechanism**            | Parameters are added at click time via document-level event listener |
| **Same Measurement ID required** | All domains must use the same `G-` ID from the same data stream      |
| **Conditions limit**             | Up to 100 domain conditions can be configured                        |
| **Required permission**          | Editor role or above required to configure                           |

### URL Position Options

By default, the `_gl` parameter appears as a query parameter (`?_gl=...`). For applications using hash-based routing, it can be configured to use a fragment instead (`#_gl=...`).

| Position        | URL Example              | When to Use                        |
|-----------------|--------------------------|------------------------------------|
| Query (default) | `example.com/?_gl=1*abc` | Standard websites                  |
| Fragment        | `example.com#_gl=1*abc`  | Single-page apps with hash routing |

### Form Submissions

Standard cross-domain linking only works for `<a>` tag link clicks. For form submissions across domains, additional configuration is needed:

- **GTM**: Use the Conversion Linker tag with "Link domains" configured
- **gtag.js**: Set `decorate_forms: true` in the linker configuration

```javascript
gtag('set', 'linker', {
  'domains': ['pikeandwest.com', 'tix.pikeandwest.com'],
  'decorate_forms': true
});
```

### What Doesn't Work Automatically

Cross-domain measurement **will not work** for:

- JavaScript-triggered navigation (e.g., `window.location.href = '...'`)
- Button clicks that don't use `<a>` tags
- Server-side redirects that strip query parameters
- Form submissions (without `decorate_forms` enabled)

## Why Cross-Domain Tracking Matters

Without proper cross-domain tracking:

- Users visiting `www.pikeandwest.com` then purchasing on `tix.pikeandwest.com` appear as **two separate sessions**
- Attribution is lost - you can't see which marketing campaigns drive ticket sales
- Conversion funnels break - you see 100% drop-off when users leave for checkout
- `tix.pikeandwest.com` appears as a referral source, polluting your traffic reports

With proper cross-domain tracking:

- Single unified session across both domains
- Complete user journey visibility (landing page → ticket purchase)
- Accurate campaign attribution
- Clean funnel reporting

## Implementation Steps

### Step 1: Configure TicketTailor Google Analytics Integration

1. **Log into TicketTailor** at [dashboard.tickettailor.com](https://dashboard.tickettailor.com)

2. **Navigate to Box Office Settings**:
   - Click your account menu (top right)
   - Select "Box office settings"
   - Click "Connect apps" from the left menu
   - Click "Google Analytics"

3. **Add Your GA4 Measurement ID**:

   ```text
   Measurement ID: G-Y9PFGHX5Z3
   ```

4. **Configure Cross-Domain Tracking**:
   - In the field labeled **"Primary domain for cross-domain tracking"**, enter:

     ```text
     www.pikeandwest.com
     ```

   - This tells TicketTailor to link sessions coming from your main website

5. **Save Settings**

### Step 2: Understand Your Current Analytics Setup

After configuring TicketTailor, you'll see this message:

> "You must add the Google Analytics tracking code below to your website."

**IMPORTANT**: This message assumes you're using direct gtag.js. However, your site uses **Google Tag Manager (GTM)**, which changes the approach.

#### Your Current Setup (Webflow)

```html
<!-- HEAD: Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P8XR8C5S');</script>

<!-- FOOTER: GTM noscript + Metricool -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P8XR8C5S"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

| Component     | ID             | Purpose                   |
|---------------|----------------|---------------------------|
| GTM Container | `GTM-P8XR8C5S` | Tag management            |
| GA4 Property  | `G-Y9PFGHX5Z3` | Analytics (fired via GTM) |
| Metricool     | `a245e19f...`  | Social media analytics    |

#### Why You Should NOT Add TicketTailor's gtag Code

TicketTailor provides this code:

```javascript
gtag('set', 'linker', {'domains': ['tickettailor.com']});
gtag('config', 'G-Y9PFGHX5Z3');
```

**Do NOT add this to your site.** Here's why:

1. **Conflict with GTM**: Adding direct gtag alongside GTM can cause duplicate pageviews and data inconsistencies
2. **Subdomain advantage**: Since `tix.pikeandwest.com` is a **subdomain** of your main domain, GA4 handles cookie sharing automatically
3. **GA4 Admin already configured**: Your "Ends with pikeandwest.com" rule already covers all subdomains

#### The Subdomain Advantage

According to [Analytics Mania](https://www.analyticsmania.com/post/cross-domain-tracking-in-google-analytics-4/):

> "If you want to track different websites that belong to the same domain (e.g. blog.yourwebsite.com and <www.yourwebsite.com>), Google Analytics 4 will handle that automatically."

Since `tix.pikeandwest.com` is a subdomain:

- GA4 cookies are written to `.pikeandwest.com` (accessible to all subdomains)
- No special linker configuration is required for subdomain-to-subdomain tracking
- The `_gl` parameter provides additional session continuity as a safety net

#### What You DO Need to Verify in GTM

1. **Log into GTM** at [tagmanager.google.com](https://tagmanager.google.com)
2. **Open container** `GTM-P8XR8C5S`
3. **Find your GA4 Configuration tag** (likely named "GA4 Configuration" or similar)
4. **Verify the Measurement ID** is `G-Y9PFGHX5Z3`
5. **Optional**: Under "Fields to Set", you can add cross-domain settings, but it's not required since GA4 Admin handles it

#### If You Also Use Google Ads Remarketing

If you have Google Ads conversion tracking in GTM, add a **Conversion Linker** tag:

1. In GTM, create new tag → "Conversion Linker"
2. Under "Link domains", add: `tickettailor.com, tix.pikeandwest.com`
3. Trigger: All Pages
4. Save and publish

This ensures Google Ads conversion data is preserved across domains.

#### For Hugo Migration

When migrating to Hugo, keep the same GTM implementation:

```html
<!-- layouts/partials/gtm-head.html -->
{{ if hugo.IsProduction }}
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P8XR8C5S');</script>
{{ end }}

<!-- layouts/partials/gtm-body.html (immediately after <body>) -->
{{ if hugo.IsProduction }}
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P8XR8C5S"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
{{ end }}
```

All cross-domain and GA4 configuration stays in GTM—no code changes needed on the site.

### Step 3: Verify GA4 Cross-Domain Configuration (Already Done)

Your GA4 property already has the correct configuration:

**Location**: Admin → Data Streams → Pike & West Website → Configure tag settings → Configure your domains

**Current Setting**:

| Match Type | Domain            |
|------------|-------------------|
| Ends with  | `pikeandwest.com` |

This is correct and covers both domains. No changes needed.

### Step 4: Verify Implementation

#### Method 1: Check URL Parameters

1. Visit `www.pikeandwest.com`
2. Click a link to `tix.pikeandwest.com`
3. Check the destination URL for a `_gl=` parameter

Example:

```text
https://tix.pikeandwest.com/events?_gl=1*1abc2de*_ga*MTIzNDU2Nzg5MC4xNjQwMDAwMDAw
```

If you see the `_gl=` parameter, cross-domain linking is working.

#### Method 2: GA4 DebugView

1. Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable it and visit both domains
3. In GA4, go to **Admin → DebugView**
4. Verify the same `client_id` appears across both domains

#### Method 3: Realtime Report

1. Open GA4 → Reports → Realtime
2. Navigate from `www.pikeandwest.com` to `tix.pikeandwest.com`
3. Verify the session continues (same user, incrementing page views)

### Step 5: Test the Complete Funnel

1. Start a new browser session (incognito/private)
2. Visit `www.pikeandwest.com`
3. Navigate to an event page
4. Click "Buy Tickets" to go to `tix.pikeandwest.com`
5. Complete (or nearly complete) a ticket purchase
6. Check GA4 to verify the entire journey is tracked as one session

## Event Tracking

### Standard Events from TicketTailor

TicketTailor automatically sends these events to GA4:

| Event                       | When Fired                     |
|-----------------------------|--------------------------------|
| `page_view`                 | Each page load on TicketTailor |
| Enhanced measurement events | Scrolls, outbound clicks, etc. |

### Recommended Custom Events

Consider tracking these events via GTM or TicketTailor's integration:

| Event            | Trigger          | Purpose              |
|------------------|------------------|----------------------|
| `view_item`      | Event page view  | Track event interest |
| `begin_checkout` | Checkout started | Funnel tracking      |
| `purchase`       | Order complete   | Conversion tracking  |

### Setting Up Purchase Tracking

TicketTailor may push ecommerce data to the dataLayer. To capture purchases:

1. **Check if TicketTailor provides dataLayer events**:
   - Use browser DevTools on a TicketTailor checkout page
   - Check `window.dataLayer` for purchase events

2. **If using GTM**:
   - Create a GA4 Event tag for `purchase`
   - Set up a dataLayer trigger for TicketTailor's purchase event
   - Include transaction parameters:

     ```javascript
     {
       transaction_id: 'T12345',
       value: 150.00,
       currency: 'USD',
       items: [{
         item_id: 'event-123',
         item_name: 'Gallery Opening Night',
         price: 75.00,
         quantity: 2
       }]
     }
     ```

3. **Mark as Key Event**:
   - In GA4: Admin → Events → Find `purchase` → Toggle "Mark as key event"

## Funnel Exploration Setup

Create a funnel to visualize the ticket purchase journey:

1. **Go to**: GA4 → Explore → Create new exploration → Funnel exploration

2. **Configure Steps**:

   | Step               | Event/Condition                                                             |
   |--------------------|-----------------------------------------------------------------------------|
   | 1. Homepage Visit  | `page_view` where `page_location` contains `pikeandwest.com` and path = `/` |
   | 2. Event Page View | `page_view` where `page_location` contains `tix.pikeandwest.com`            |
   | 3. Begin Checkout  | `begin_checkout` or checkout page view                                      |
   | 4. Purchase        | `purchase` event                                                            |

3. **Settings**:
   - Funnel type: Open (allows entry at any step)
   - Date range: Last 30 days

## Troubleshooting

### Issue: `_gl=` Parameter Not Appearing

**Causes**:

- Links use JavaScript redirects instead of standard `<a>` tags
- Links open in new tabs without linker parameters
- Server-side redirects strip the parameter
- Domain mismatch between configured domains and actual URLs

**Solutions**:

- Ensure links use standard HTML anchor (`<a>`) tags
- For JavaScript navigation, manually append linker parameters using `gtag('get')`:

  ```javascript
  gtag('get', 'G-Y9PFGHX5Z3', 'client_id', (clientId) => {
    // Manually construct URL with linker parameter
  });
  ```

- Configure server to preserve query parameters during redirects
- Verify the domain in GA4 "Configure your domains" exactly matches your site URLs
- Use the [Redirect Path Chrome extension](https://chrome.google.com/webstore/detail/redirect-path/aomidfkchockcldhbkggjokdkkebmdll) to detect redirects stripping parameters

### Issue: Linker Parameter Expired

**Cause**: The `_gl` parameter expires after **2 minutes**. If users take longer to navigate or if redirects delay page load, the parameter may be invalid.

**Solutions**:

- Minimize redirect chains between domains
- Ensure destination pages load quickly
- For slow-loading pages, consider server-side session handling

### Issue: tix.pikeandwest.com Appears as Referral

**Cause**: Cross-domain tracking not working; sessions split

**Solutions**:

1. Verify TicketTailor has GA4 Measurement ID configured
2. Check "Configure your domains" in GA4 includes the TicketTailor domain
3. Clear browser cookies and retest

### Issue: Duplicate Transactions

**Cause**: Both TicketTailor and your site fire purchase events

**Solutions**:

- Use unique `transaction_id` for deduplication
- Ensure only TicketTailor fires purchase events (since that's where checkout completes)

### Issue: Missing Purchase Data

**Cause**: TicketTailor's ecommerce tracking may not be enabled or configured

**Solutions**:

1. Contact TicketTailor support to verify GA4 ecommerce data is being sent
2. Inspect dataLayer on thank-you page for purchase events
3. Consider server-side tracking via Measurement Protocol if client-side fails

## UTM Best Practices

When promoting events, use consistent UTM parameters:

```text
https://tix.pikeandwest.com/event/gallery-opening?utm_source=instagram&utm_medium=social&utm_campaign=us_gallery-opening_2026_launch
```

### UTM Naming Convention

| Parameter      | Format                     | Example                                    |
|----------------|----------------------------|--------------------------------------------|
| `utm_source`   | Platform name              | `instagram`, `facebook`, `google`, `email` |
| `utm_medium`   | Marketing channel          | `social`, `cpc`, `email`, `referral`       |
| `utm_campaign` | `region_event_year_detail` | `us_gallery-opening_2026_instagram`        |
| `utm_content`  | Ad variation               | `story_ad`, `carousel_1`, `header_link`    |

### Example URLs

| Purpose             | URL                                                                                                                         |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------|
| Instagram bio link  | `https://tix.pikeandwest.com?utm_source=instagram&utm_medium=social&utm_campaign=us_general_2026_bio`                       |
| Facebook event post | `https://tix.pikeandwest.com/event/xyz?utm_source=facebook&utm_medium=social&utm_campaign=us_event-name_2026_post`          |
| Email newsletter    | `https://tix.pikeandwest.com/event/xyz?utm_source=newsletter&utm_medium=email&utm_campaign=us_event-name_2026_announcement` |

## Privacy Considerations

### Cookie Consent

If you implement a Cookie Consent Banner on `www.pikeandwest.com`:

1. Ensure consent state is shared with TicketTailor (via URL parameter or cookie)
2. Use GA4's Consent Mode:

   ```javascript
   gtag("consent", "default", {
     analytics_storage: "denied",
   });

   // After user consents:
   gtag("consent", "update", {
     analytics_storage: "granted",
   });
   ```

### Data Retention

In GA4 Admin → Data retention:

- Set to **14 months** for maximum historical data (standard limit)
- Enable BigQuery export for long-term storage

## Meta Pixel Integration (Bonus)

TicketTailor also supports Meta (Facebook) Pixel:

1. **Requirement**: Must have custom domain enabled (you do: `tix.pikeandwest.com`)
2. **Setup**: Box office settings → Connect apps → Meta Pixel
3. **Enter**: Your Meta Pixel ID
4. **Enable**: Conversions API for server-side tracking (more reliable)

This allows tracking ticket purchases as Facebook conversions for ad optimization.

## Quick Reference

### GA4 URLs

| Resource     | URL                                                                                                   |
|--------------|-------------------------------------------------------------------------------------------------------|
| GA4 Admin    | [analytics.google.com](https://analytics.google.com/analytics/web/#/a300399219p424998364/admin)       |
| Data Streams | [Data Streams](https://analytics.google.com/analytics/web/#/a300399219p424998364/admin/streams/table) |
| DebugView    | [DebugView](https://analytics.google.com/analytics/web/#/a300399219p424998364/admin/debugview)        |
| Realtime     | [Realtime Report](https://analytics.google.com/analytics/web/#/a300399219p424998364/reports/realtime) |

### TicketTailor URLs

| Resource      | URL                                                                                                            |
|---------------|----------------------------------------------------------------------------------------------------------------|
| Dashboard     | [dashboard.tickettailor.com](https://dashboard.tickettailor.com)                                               |
| GA Setup Help | [TicketTailor Help](https://help.tickettailor.com/en/articles/2283227-how-to-set-up-google-analytics-tracking) |

### Key IDs

```text
GTM Container ID:   GTM-P8XR8C5S
GA4 Measurement ID: G-Y9PFGHX5Z3
GA4 Property ID:    424998364
GA4 Stream ID:      6676080268
Main Domain:        www.pikeandwest.com
Ticket Domain:      tix.pikeandwest.com
```

## Implementation Checklist

### TicketTailor Configuration

- [ ] Add GA4 Measurement ID (`G-Y9PFGHX5Z3`) to TicketTailor
- [ ] Set primary domain for cross-domain tracking (`www.pikeandwest.com`) in TicketTailor
- [ ] **Ignore** the gtag code snippet TicketTailor shows (you use GTM, not direct gtag)

### GTM Verification

- [ ] Log into GTM container `GTM-P8XR8C5S`
- [ ] Verify GA4 Configuration tag uses Measurement ID `G-Y9PFGHX5Z3`
- [ ] (If using Google Ads) Add Conversion Linker tag with domains: `tickettailor.com, tix.pikeandwest.com`

### Testing

- [ ] Verify `_gl=` parameter appears when navigating from main site to TicketTailor
- [ ] Test complete user journey in GA4 Realtime
- [ ] Verify sessions aren't splitting (no self-referrals from `tix.pikeandwest.com`)
- [ ] Check that same `client_id` persists across both domains

### Conversions & Reporting

- [ ] Set up purchase event as Key Event in GA4
- [ ] Create funnel exploration to monitor conversion rates
- [ ] Document UTM conventions for event promotion

### Optional Enhancements

- [ ] Set up Meta Pixel in TicketTailor for Facebook/Instagram ad tracking
- [ ] Configure Metricool to track TicketTailor referrals

## Sources

### Official Google Documentation

- [GA4 Set up cross-domain measurement](https://support.google.com/analytics/answer/10071811) - Primary reference for GA4 cross-domain setup
- [Cross-domain measurement - Google Tag Platform](https://developers.google.com/tag-platform/devguides/cross-domain) - Technical developer documentation
- [Configure tag settings](https://support.google.com/tagmanager/answer/12131703) - Google Tag Manager configuration reference
- [GA4 Ecommerce Setup](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce) - Purchase event implementation

### TicketTailor Documentation

- [TicketTailor Google Analytics Setup](https://help.tickettailor.com/en/articles/2283227-how-to-set-up-google-analytics-tracking)
- [TicketTailor Custom Domain Tips](https://help.tickettailor.com/en/articles/9361210-top-tips-for-using-a-widget-and-a-custom-domain)

### Community Resources

- [GA4 Cross-Domain Tracking - Analytics Mania](https://www.analyticsmania.com/post/cross-domain-tracking-in-google-analytics-4/)
- [Cross-Domain Tracking for Event Ticket Sales - Symphony Online](https://www.symphonyonline.co.uk/blog/how-to-set-up-a-goal-funnel-in-ga4-with-cross-domain-tracking-for-event-ticket-sales/)
- [Cross-Domain Tracking in GA4 - Simo Ahava](https://www.simoahava.com/gtm-tips/cross-domain-tracking-google-analytics-4/)
