# Cross-Domain Tracking Verification Results

**Date:** 2026-01-19
**Status:** Verified and Complete

## Configuration Summary

| Component          | Value                              |
|--------------------|------------------------------------|
| GTM Container ID   | GTM-P8XR8C5S                       |
| GA4 Measurement ID | G-Y9PFGHX5Z3                       |
| GA4 Property ID    | 424998364                          |
| GA4 Stream ID      | 6676080268                         |
| Main Domain        | pikeandwest.com                    |
| Ticket Domain      | tix.pikeandwest.com (TicketTailor) |

## Verification Results

### 1. TicketTailor GA4 Integration

- **Status:** Verified
- **Configuration:**
  - Measurement ID: G-Y9PFGHX5Z3
  - Primary domain: pikeandwest.com
  - GA4 tracking enabled in TicketTailor admin

### 2. GTM GA4 Configuration Tag

- **Status:** Verified
- **Tag quality:** Excellent
- **Data flowing:** Yes

### 3. Conversion Linker

- **Status:** Present in GTM
- **Purpose:** Enables cross-domain cookie linking via `_gl` parameter

### 4. Hugo GTM Implementation

- **Status:** Implemented
- **Files created:**
  - `layouts/partials/gtm-head.html` - GTM script for `<head>`
  - `layouts/partials/gtm-body.html` - GTM noscript fallback
- **Features:**
  - Production-only (`hugo.IsProduction` check)
  - Configured via `site.Params.analytics.googleTagManager`
- **Commit:** 49e6d04

### 5. Cross-Domain Configuration in GA4

- **Status:** Verified
- **Configuration:**
  - Match type: "Ends with"
  - Domain: "pikeandwest.com"
- **Effect:** Matches both pikeandwest.com and tix.pikeandwest.com
- **Screenshot:** `.playwright-mcp/ga4-cross-domain-config.png`

### 6. GA4 Realtime Verification

- **Status:** Active data flowing
- **Observations:**
  - 2 active users in last 30 minutes
  - Page views from both main site and ticket site detected
  - Events tracked: page_view, scroll, user_engagement, session_start
- **Screenshot:** `.playwright-mcp/ga4-realtime-overview.png`

### 7. Self-Referrals Check

- **Status:** Verified
- **Configuration:** No unwanted referrals configured (cross-domain linking handles this)
- **Screenshot:** `.playwright-mcp/ga4-unwanted-referrals.png`

### 8. Key Events Configuration

- **Status:** Verified
- **Key events configured:**
  - `purchase` - For tracking ticket sales
  - `contact_request` - For tracking contact form submissions
- **Screenshot:** `.playwright-mcp/ga4-key-events.png`

## How Cross-Domain Tracking Works

1. **User visits pikeandwest.com** - GTM loads GA4 with Measurement ID G-Y9PFGHX5Z3
2. **User clicks "Buy Tickets"** - Link to tix.pikeandwest.com has `_gl` parameter appended
3. **User lands on TicketTailor** - TicketTailor's GA4 integration reads `_gl` parameter
4. **Session continues** - Same session ID maintained across domains
5. **User completes purchase** - `purchase` event fired, attributed to original session

## Files Changed

```text
layouts/partials/gtm-head.html (created)
layouts/partials/gtm-body.html (created)
layouts/_default/baseof.html (modified - added GTM partials)
layouts/partials/head.html (modified - removed duplicate GTM code)
layouts/partials/scripts.html (modified - removed duplicate GTM code)
```

## Testing Notes

- Cross-domain tracking relies on the `_gl` linker parameter
- Both domains share cookies because they're subdomains of pikeandwest.com
- TicketTailor natively supports GA4 integration
- GTM tag quality shows "Excellent" status

## Beta Subdomain Testing (2026-01-20)

### Deployment Configuration

| Component                | Status  | Details                         |
|--------------------------|---------|---------------------------------|
| Cloudflare Pages Project | Active  | `pikeandwest`                   |
| Production URL           | Working | <https://pikeandwest.pages.dev> |
| Custom Domain            | Active  | <https://beta.pikeandwest.com>  |
| SSL                      | Enabled | Auto-provisioned by Cloudflare  |
| GitHub Actions           | Working | Auto-deploy on push to main     |

### GTM/GA4 Verification at beta.pikeandwest.com

| Check        | Status   | Evidence                                                 |
|--------------|----------|----------------------------------------------------------|
| GTM Loading  | Verified | `www.google.com/ccm/collect` requests                    |
| GA4 Tracking | Verified | `analytics.google.com/g/collect` with `tid=G-Y9PFGHX5Z3` |
| Page Views   | Verified | `en=page_view` events firing                             |
| Debug Mode   | Verified | `?debug_mode=true` parameter works                       |

### Cross-Domain Subdomain Verification

| Subdomain            | DNS Status                      | SSL    | Service               |
|----------------------|---------------------------------|--------|-----------------------|
| beta.pikeandwest.com | CNAME → pikeandwest.pages.dev   | Active | Hugo/Cloudflare Pages |
| tix.pikeandwest.com  | CNAME → custom.tickettailor.com | Active | TicketTailor          |

### Testing Limitations

- **No events currently listed** on tix.pikeandwest.com
- Cross-domain `_gl` parameter handoff cannot be tested until events are published
- Purchase event testing requires a live event with tickets

### Screenshots

- Homepage at beta subdomain: `.playwright-mcp/beta-pikeandwest-homepage.png`

## Recommendations

1. **Monitor for self-referrals:** Check GA4 traffic acquisition reports periodically to ensure tix.pikeandwest.com doesn't appear as a referral source
2. **Test actual purchase flow:** Complete a test purchase to verify `purchase` event fires correctly
3. **Verify in GA4 DebugView:** Use GA4 DebugView during testing to see events in real-time
4. **Retest cross-domain when events are live:** Once TicketTailor has events, test the full flow from beta.pikeandwest.com to tix.pikeandwest.com to verify `_gl` parameter is appended

## Monitoring Checklist

### Weekly Checks (First Month)

- [ ] Check GA4 Traffic Acquisition for self-referrals from tix.pikeandwest.com
- [ ] Verify purchase events are being captured (when events are live)
- [ ] Check Realtime report during business hours for active tracking

### Monthly Checks

- [ ] Review GA4 attribution reports for accuracy
- [ ] Check for session continuity issues across domains
- [ ] Compare conversion counts with TicketTailor reports

### Key URLs for Monitoring

| Resource                   | URL                                                                                  |
|----------------------------|--------------------------------------------------------------------------------------|
| Cloudflare Pages Dashboard | <https://dash.cloudflare.com/pages>                                                  |
| GA4 Admin                  | <https://analytics.google.com/analytics/web/#/a300399219p424998364/admin>            |
| GA4 DebugView              | <https://analytics.google.com/analytics/web/#/a300399219p424998364/admin/debugview>  |
| GTM Container              | <https://tagmanager.google.com/#/container/accounts/6297497052/containers/212421428> |
| GitHub Actions             | <https://github.com/cneller/pikeandwest.com/actions>                                 |
| Production Site            | <https://beta.pikeandwest.com>                                                       |
| Ticket Site                | <https://tix.pikeandwest.com>                                                        |
