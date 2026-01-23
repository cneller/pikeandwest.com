# GSC Monitoring Script Development Notes

> Working notes for building Playwright-based Google Search Console monitoring.

## Goal

Automate extraction of GSC Coverage Report metrics that aren't available via API:

- Total indexed pages count
- "Not indexed" breakdown
- Google-selected canonical status

## Session Log

### 2026-01-22: Initial Research & Dry Run

#### Requirements

- [ ] Login to Google Search Console
- [ ] Navigate to Coverage/Page Indexing Report
- [ ] Extract: indexed count, not-indexed count, error count
- [ ] Handle Google OAuth flow
- [ ] Store results for trend tracking

#### Best Practices Research

**Authentication Strategy** ([Playwright Auth Docs](https://playwright.dev/docs/auth)):

- Use `storageState()` to save/restore cookies and localStorage
- Save to `playwright/.auth` directory, add to `.gitignore`
- Run auth once, reuse state for subsequent runs
- Session cookies typically expire after 24 hours - need expiration checking

**Google OAuth Considerations** ([Google Auth with Playwright](https://adequatica.medium.com/google-authentication-with-playwright-8233b207b71a)):

- Google can detect automation via fingerprinting
- Authenticate as rarely as possible
- May need stealth plugin to avoid robot detection
- Risk of captcha challenges or account flags

**Scraping Behind Login** ([Checkly Guide](https://www.checklyhq.com/docs/learn/playwright/scraping-behind-login/)):

- Playwright handles redirects automatically (SSO flows)
- UI automation first to login, then scrape
- Use `globalSetup` for auth before tests

**Security**:

- Never commit auth state files to git
- State files contain sensitive session cookies

#### Playwright MCP Dry Run

**Navigation Flow (2026-01-22):**

1. **Start URL:** `https://search.google.com/search-console`
   - If logged in, redirects to: `?resource_id=sc-domain:pikeandwest.com`
   - Shows Overview page with summary data

2. **Overview Page Data Available:**
   - Indexed count: "3 indexed pages" (visible in Indexing card)
   - Not indexed count: "4 not indexed pages"
   - Can extract directly without navigating to full report

3. **Full Report URL:** `https://search.google.com/search-console/index?resource_id=sc-domain%3Apikeandwest.com`
   - Shows detailed breakdown with reasons table

**Accessibility Tree Selectors (from dry run):**

| Data Point        | Selector Pattern                                            | Example Value          |
|-------------------|-------------------------------------------------------------|------------------------|
| Not indexed count | `button[name*="Not indexed"]` → child `generic` with number | "4"                    |
| Indexed count     | `button[name*="Indexed"]` → child `generic` with number     | "3"                    |
| Last update       | `generic` containing "Last update:"                         | "Last update: 1/19/26" |
| Reasons table     | `table` with rows containing reason names                   | "Page with redirect"   |

**URL Drilldown:**

- Click reason row → navigates to: `/index/drilldown?...&item_key=CAMYCyAC`
- Shows affected URLs table with last crawled dates

**Current Site Status (as of dry run):**

- 3 indexed pages (the canonical URLs)
- 4 not indexed: all "Page with redirect" (www→non-www, http→https redirects)
- This is expected/healthy - redirects shouldn't be indexed

#### Challenges Discovered

1. **Authentication persistence**: Need to handle Google session expiry (~24hr)
2. **Dynamic element refs**: Playwright MCP uses `ref=eXXX` which change each load
3. **Accessibility tree preferred**: Using role-based selectors more stable than refs
4. **No login required this session**: Was already authenticated via existing browser state

## Architecture Notes

### Authentication Strategy

**Option A: Reuse existing browser profile (simplest)**

- Point Playwright at Chrome user data directory with active Google session
- Avoids automation detection entirely
- Requires manual re-auth if session expires

**Option B: Saved storage state**

- Login once manually via `headed` mode
- Save `storageState()` to file
- Load state on subsequent runs
- Add expiration checking (24hr typical)

**Option C: Headless with manual login prompt**

- Script detects if not logged in
- Opens headed browser for manual login
- Saves state after successful auth

**Recommendation:** Option B with fallback to C if state expired.

### Selector Strategy

**Use role-based selectors (most stable):**

```javascript
// Not indexed count
page.getByRole('button', { name: /Not indexed/ })
  .locator('generic').filter({ hasText: /^\d+$/ })

// Indexed count
page.getByRole('button', { name: /Indexed/ })
  .locator('generic').filter({ hasText: /^\d+$/ })

// Last update text
page.getByText(/Last update:/)
```

**Avoid:** Direct `ref=` references (change each page load)

### Data Extraction

**Output format (JSON):**

```json
{
  "timestamp": "2026-01-22T10:30:00Z",
  "property": "sc-domain:pikeandwest.com",
  "lastUpdate": "1/19/26",
  "indexed": 3,
  "notIndexed": 4,
  "reasons": [
    { "reason": "Page with redirect", "count": 4 }
  ]
}
```

**Storage options:**

- Append to JSONL file for trend tracking
- Update markdown monitoring doc
- Both

### Error Handling

| Error              | Detection            | Recovery                  |
|--------------------|----------------------|---------------------------|
| Session expired    | Login page redirect  | Prompt for manual re-auth |
| Property not found | No property selector | Fail with clear error     |
| Rate limited       | 429 or captcha       | Back off, retry later     |
| Element not found  | Timeout              | Retry with longer wait    |
| Network error      | Request failed       | Retry with backoff        |

## References

- [Playwright Auth Docs](https://playwright.dev/docs/auth)
- [Google Auth with Playwright](https://adequatica.medium.com/google-authentication-with-playwright-8233b207b71a)
- [Checkly Scraping Behind Login](https://www.checklyhq.com/docs/learn/playwright/scraping-behind-login/)
- [GSC Page Indexing Report](https://support.google.com/webmasters/answer/7440203)

## Next Steps

1. [ ] Create TypeScript Playwright script skeleton
2. [ ] Implement auth state management
3. [ ] Add extraction logic with stable selectors
4. [ ] Add JSONL output for trend tracking
5. [ ] Create slash command wrapper
6. [ ] Test with fresh browser context
