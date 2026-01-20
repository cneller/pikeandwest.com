# Analytics Monitoring Checklist

> Ongoing verification procedures for Pike & West analytics.

## Quick Reference

| Check              | Frequency | Tool                    |
|--------------------|-----------|-------------------------|
| GTM Loading        | On deploy | Browser DevTools        |
| GA4 Realtime       | Daily     | GA4 Realtime Report     |
| Self-Referrals     | Weekly    | GA4 Traffic Acquisition |
| Purchase Events    | Per event | GA4 Events Report       |
| Session Continuity | Monthly   | GA4 User Explorer       |

## Daily Checks (First Week)

- [ ] Verify GA4 Realtime shows active users during business hours
- [ ] Check for any console errors on production site
- [ ] Confirm GTM container is loading (Network tab)

## Weekly Checks (First Month)

### Traffic Acquisition Review

- [ ] Open GA4 > Reports > Acquisition > Traffic Acquisition
- [ ] Look for `tix.pikeandwest.com` in referral sources
- [ ] If present, cross-domain tracking may not be working
- [ ] Check that organic search, direct, and referral traffic appear

### Event Verification

- [ ] Open GA4 > Reports > Engagement > Events
- [ ] Verify `page_view` events are tracking
- [ ] Check `scroll` and `user_engagement` events
- [ ] When events are live, verify `purchase` events

### Real-Time Spot Check

- [ ] Visit the live site in a new browser session
- [ ] Open GA4 Realtime report
- [ ] Confirm your session appears
- [ ] Navigate to different pages, verify page views tracked

## Monthly Checks

### Session Continuity Analysis

- [ ] Open GA4 > Explore > User Explorer
- [ ] Find sessions that include both pikeandwest.com and tix.pikeandwest.com
- [ ] Verify sessions are not splitting at domain boundary
- [ ] Check average session duration is reasonable

### Conversion Attribution

- [ ] Open GA4 > Reports > Engagement > Conversions
- [ ] Review `purchase` event attribution
- [ ] Compare purchase counts with TicketTailor reports
- [ ] Investigate any significant discrepancies

### Data Quality Audit

- [ ] Check for spam traffic or bot sessions
- [ ] Review bounce rate for anomalies
- [ ] Verify geographic distribution matches expectations
- [ ] Check device/browser breakdown for issues

## Post-Deployment Checks

Run these checks after any deployment:

### Immediate (Within 5 minutes)

- [ ] Visit deployed site
- [ ] Open DevTools > Network
- [ ] Filter for "gtm" - verify `gtm.js` loads
- [ ] Filter for "collect" - verify GA4 requests fire
- [ ] Check Console for any errors

### Within 1 Hour

- [ ] Check GA4 Realtime for traffic
- [ ] Use debug mode to verify events
- [ ] Test one cross-domain link if available

## Troubleshooting Triggers

Investigate immediately if you observe:

| Symptom                         | Possible Cause                            |
|---------------------------------|-------------------------------------------|
| Zero traffic in GA4             | GTM not loading, wrong measurement ID     |
| High bounce rate (>90%)         | Tracking on entry but not subsequent      |
| tix.pikeandwest.com as referral | Cross-domain tracking broken              |
| Purchase count mismatch         | TicketTailor GA4 misconfigured            |
| Sudden traffic drop             | Site down, GTM removed, filter issue      |
| Sudden traffic spike            | Bot traffic, viral content, referral spam |

## Admin Quick Links

Open these for monitoring:

- [GA4 Realtime](https://analytics.google.com/analytics/web/#/a300399219p424998364/realtime/overview)
- [GA4 Traffic Acquisition](https://analytics.google.com/analytics/web/#/a300399219p424998364/reports/lifecycle-acquisition-v2)
- [GA4 Events](https://analytics.google.com/analytics/web/#/a300399219p424998364/reports/lifecycle-engagement-events)
- [GA4 DebugView](https://analytics.google.com/analytics/web/#/a300399219p424998364/admin/debugview)
- [GTM Container](https://tagmanager.google.com/#/container/accounts/6297497052/containers/212421428)

## Checklist Archive

### 2026-01-20 - Beta Subdomain Launch

- [x] Custom domain beta.pikeandwest.com active
- [x] SSL certificate provisioned
- [x] GTM loading verified via Network requests
- [x] GA4 receiving data (g/collect requests with tid=G-Y9PFGHX5Z3)
- [x] Debug mode working (?debug_mode=true)
- [ ] Cross-domain \_gl parameter (blocked: no events on TicketTailor)
- [ ] Purchase event tracking (blocked: no events on TicketTailor)

### Next Steps

1. **When TicketTailor has events:** Test full cross-domain flow from beta.pikeandwest.com to tix.pikeandwest.com
2. **After 24-48 hours:** Check GA4 Traffic Acquisition for self-referrals
3. **First ticket sale:** Verify purchase event fires and attributes correctly
