# Pike & West Marketing Analytics Strategy

> Comprehensive analytics implementation for tracking user behavior across the Pike & West website and ticket purchasing flow.

## Overview

Pike & West uses Google Tag Manager (GTM) and Google Analytics 4 (GA4) to track user engagement, conversions, and cross-domain behavior between the main website and TicketTailor ticket purchasing platform.

### Analytics Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                     Google Tag Manager                          │
│                     GTM-P8XR8C5S                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐      ┌──────────────────┐                │
│  │  GA4 Config Tag  │      │ Conversion Linker│                │
│  │  G-Y9PFGHX5Z3    │      │  (Cross-Domain)  │                │
│  └────────┬─────────┘      └────────┬─────────┘                │
│           │                         │                           │
└───────────┼─────────────────────────┼───────────────────────────┘
            │                         │
            ▼                         ▼
┌───────────────────────┐    ┌───────────────────────┐
│  pikeandwest.com      │    │  tix.pikeandwest.com  │
│  (Hugo/Cloudflare)    │────│  (TicketTailor)       │
│                       │ _gl│                       │
│  - page_view          │────│  - page_view          │
│  - scroll             │    │  - purchase           │
│  - user_engagement    │    │  - begin_checkout     │
│  - contact_request    │    │                       │
└───────────────────────┘    └───────────────────────┘
```

## Configuration Summary

| Component          | Value          | Purpose                       |
|--------------------|----------------|-------------------------------|
| GTM Container ID   | `GTM-P8XR8C5S` | Tag management container      |
| GA4 Measurement ID | `G-Y9PFGHX5Z3` | Analytics property identifier |
| GA4 Property ID    | `424998364`    | GA4 admin property            |
| GA4 Stream ID      | `6676080268`   | Web data stream               |

## Tracked Domains

| Domain               | Platform        | Analytics Method        |
|----------------------|-----------------|-------------------------|
| <www.pikeandwest.com>  | Hugo/Cloudflare | GTM container           |
| beta.pikeandwest.com | Hugo/Cloudflare | GTM container (staging) |
| tix.pikeandwest.com  | TicketTailor    | Native GA4 integration  |

## Key Events & Conversions

### Configured Key Events

| Event Name        | Trigger                 | Attribution |
|-------------------|-------------------------|-------------|
| `purchase`        | Ticket sale completed   | Revenue     |
| `contact_request` | Contact form submission | Lead        |

### Automatic Events

GA4 automatically tracks these events via Enhanced Measurement:

- `page_view` - Page loads
- `scroll` - 90% scroll depth
- `user_engagement` - Active time on page
- `session_start` - New session begins
- `first_visit` - First-time visitors

## Cross-Domain Tracking

Cross-domain tracking enables session continuity when users navigate from the main website to TicketTailor for ticket purchases.

### How It Works

1. **User visits pikeandwest.com** - GTM loads GA4 with client ID
2. **User clicks ticket link** - Conversion Linker appends `_gl` parameter
3. **User arrives at tix.pikeandwest.com** - TicketTailor reads `_gl` parameter
4. **Session continues** - Same session ID maintained
5. **Purchase completes** - `purchase` event attributed to original session

### Configuration

**GA4 Admin > Data Streams > Configure tag settings > Configure your domains:**

- Match type: "Ends with"
- Domain: "pikeandwest.com"

This configuration matches both `www.pikeandwest.com` and `tix.pikeandwest.com`.

### TicketTailor Integration

TicketTailor has native GA4 support configured in their admin panel:

- **Measurement ID:** G-Y9PFGHX5Z3
- **Primary domain:** <www.pikeandwest.com>

See [TicketTailor GA4 Integration Guide](../plans/2026-01-19-tickettailor-ga4-integration.md) for setup details.

## Implementation Details

### Hugo Integration

GTM is implemented via Hugo partials that only load in production builds:

**`layouts/partials/gtm-head.html`** - GTM script in `<head>`:

```html
{{ if hugo.IsProduction }}
{{ with site.Params.analytics.googleTagManager }}
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','{{ . }}');</script>
{{ end }}
{{ end }}
```

**`layouts/partials/gtm-body.html`** - GTM noscript fallback:

```html
{{ if hugo.IsProduction }}
{{ with site.Params.analytics.googleTagManager }}
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ . }}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
{{ end }}
{{ end }}
```

**Configuration** (`config/_default/params.toml`):

```toml
[analytics]
  googleTagManager = "GTM-P8XR8C5S"
```

### Production vs Development

- **Production:** GTM loads and tracks all events
- **Development:** GTM does not load (`hugo.IsProduction` check)
- **Debug mode:** Append `?debug_mode=true` to URLs for GA4 DebugView

## Deployment Environments

| Environment | URL                      | GTM Loads | Purpose        |
|-------------|--------------------------|-----------|----------------|
| Production  | <www.pikeandwest.com>      | Yes       | Live site      |
| Staging     | beta.pikeandwest.com     | Yes       | Pre-production |
| Preview     | \*.pikeandwest.pages.dev | Yes       | PR previews    |
| Local       | localhost:1313           | No        | Development    |

## Admin URLs

| Resource           | URL                                                                                |
|--------------------|------------------------------------------------------------------------------------|
| GA4 Admin          | <https://analytics.google.com/analytics/web/#/a300399219p424998364/admin>            |
| GA4 DebugView      | <https://analytics.google.com/analytics/web/#/a300399219p424998364/admin/debugview>  |
| GA4 Realtime       | <https://analytics.google.com/analytics/web/#/a300399219p424998364/admin/realtime>   |
| GTM Container      | <https://tagmanager.google.com/#/container/accounts/6297497052/containers/212421428> |
| TicketTailor Admin | <https://www.tickettailor.com/manage/>                                               |

## Monitoring Procedures

See [Monitoring Checklist](./monitoring-checklist.md) for ongoing verification procedures.

### Quick Health Checks

1. **GTM Loading:** Check browser DevTools Network tab for `gtm.js` request
2. **GA4 Firing:** Look for `analytics.google.com/g/collect` requests
3. **Realtime:** Visit GA4 Realtime report while browsing site
4. **DebugView:** Append `?debug_mode=true` to URLs and check GA4 DebugView

## Related Documentation

- [Implementation Guide](./implementation-guide.md) - Technical setup details
- [Monitoring Checklist](./monitoring-checklist.md) - Ongoing verification procedures
- [Cross-Domain Verification](../cross-domain-tracking-verification.md) - Testing results
- [TicketTailor Integration](../plans/2026-01-19-tickettailor-ga4-integration.md) - TicketTailor setup
- [Cloudflare Deployment Testing](../plans/2026-01-19-cloudflare-deployment-ga4-testing.md) - Deployment plan

## Future Enhancements

### Planned

- [ ] Contact form `contact_request` event implementation
- [ ] E-commerce enhanced measurement for ticket purchases
- [ ] Custom dimensions for event types (wedding, corporate, party)
- [ ] User ID tracking for repeat visitors

### Considerations

- **Google Search Console** - Link to GA4 for search query data
- **Microsoft Clarity** - Session recordings for UX insights
- **HubSpot** - CRM integration for lead tracking
- **UTM Strategy** - Campaign tracking conventions
