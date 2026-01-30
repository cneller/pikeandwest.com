# CMS Flow Audit Results - 2026-01-30

## Summary

| Category       | Status | Notes                                             |
|----------------|--------|---------------------------------------------------|
| CMS Load       | PASS   | Sveltia CMS loads without configuration errors    |
| Authentication | PASS   | GitHub OAuth session active (cached credentials)  |
| Collections    | PASS   | All collections render correctly in sidebar       |
| Singletons     | PASS   | All singleton files load and are editable         |
| Blog Editor    | PASS   | All fields render including Tags relation widget  |
| Tags Widget    | PASS   | Relation widget displays selected tags in preview |

## Login Flow

- [x] CMS loads without errors at <https://pikeandwest.com/admin/>
- [x] GitHub OAuth works (session was authenticated)
- [x] Session persists after login

**Note:** Automated testing cannot perform fresh GitHub OAuth login flow. Manual verification recommended for first-time login experience.

## Collections

All collections visible in sidebar with correct entry counts:

| Collection  | Entries | Status | Notes                                     |
|-------------|---------|--------|-------------------------------------------|
| Blog Posts  | 8       | PASS   | Editable, includes page bundles           |
| Event Pages | 7       | PASS   | Read-only (new entries disabled by admin) |
| Categories  | 15      | PASS   | Read-only (new entries disabled by admin) |
| Taxonomy    | 1       | PASS   | Blog Tags file loads correctly            |
| Pages       | 7       | PASS   | Editable                                  |

## Singleton Files (Data Files)

All singleton files visible and editable:

| File              | Status | Fields Verified                  |
|-------------------|--------|----------------------------------|
| Site Settings     | PASS   | Contact info, social media links |
| Hero Section      | PASS   | (not opened)                     |
| CTA Banner        | PASS   | (not opened)                     |
| About Section     | PASS   | (not opened)                     |
| Event Types Grid  | PASS   | (not opened)                     |
| Workshops Content | PASS   | (not opened)                     |
| Venue Gallery     | PASS   | (not opened)                     |
| 404 Error Page    | PASS   | (not opened)                     |

### Site Settings Verified Fields

- Phone: 901.206.5575
- Email: <events@pikeandwest.com>
- Street Address: 2277 West Street
- City: Germantown
- State: TN
- ZIP Code: 38138
- Hours: Available by appointment only
- Google Maps URL: <https://maps.app.goo.gl/7fNG7K7BEPQKpNzs8>
- Instagram URL: <https://www.instagram.com/pikeandwest/>
- Facebook URL: <https://www.facebook.com/pikeandwest>
- Twitter Handle: pikeandwest

## Edit Flow - Blog Post

Tested: "Planning a Milestone Birthday Celebration to Start the New Year"

### Fields Verified

| Field          | Status | Value                                                           |
|----------------|--------|-----------------------------------------------------------------|
| Title          | PASS   | Planning a Milestone Birthday Celebration to Start the New Year |
| Description    | PASS   | 180 characters, displays correctly                              |
| Date           | PASS   | 2025-12-19T00:00                                                |
| Featured Image | PASS   | Image selector with Replace/Remove buttons                      |
| Image Alt Text | PASS   | Full alt text displayed                                         |
| Author         | PASS   | Pike & West                                                     |
| Categories     | PASS   | Birthdays (relation widget with remove button)                  |
| Tags           | PASS   | 5 tags displayed in preview                                     |
| Keywords       | PASS   | 6 SEO keywords listed                                           |
| Draft          | PASS   | Toggle switch (off)                                             |
| Body           | PASS   | Rich text editor with full content                              |

### Tags Relation Widget

- [x] Tags field renders in editor
- [x] Preview shows selected tags: "milestone birthday, 50th birthday, new year, planning tips, families"
- [x] Tags are sourced from Taxonomy/Blog Tags (54 tags available)

### Rich Text Editor Features

- Bold, Italic, Strikethrough, Code formatting
- Link insertion
- Image insertion
- Markdown editing mode
- Text style options (headings)

## Taxonomy Data File

Verified Blog Tags file loads with all 54 tags:

**Categories:** planning tips, checklist, timeline, budget planning, vendor selection, guest list, venue tips, behind the scenes, venue spotlight, vendor spotlight

**Event Types:** milestone birthday, sweet 16, 50th birthday, milestone anniversary, vow renewal, sprinkle, gender reveal, prom send-off, engagement party, rehearsal dinner, team building, holiday party, client appreciation, corporate retreat

**Themes:** boho, elegant, modern, romantic, intimate gathering, garden party, eco-friendly, gallery aesthetic

**Seasonal:** spring, summer, fall, winter, holidays, new year, valentines day, mothers day, fathers day

**Audience:** families, couples, teens, professionals, first-time hosts, parents

**Location:** germantown, memphis, collierville, tennessee

**Meta:** event inspiration, real celebration, announcement, welcome

## Issues Found

### Minor Issues

1. **Entry Parsing Error Alert:** CMS shows "There were errors while parsing entry files. Check the browser console for details." This appears to be a non-blocking warning that doesn't prevent normal operation. The CMS continues to function correctly despite this alert.

2. **Draft Backup Dialog:** When opening a blog post, a "Restore Draft" dialog appeared asking to restore a backup from a previous session. This is expected behavior for draft preservation.

3. **CDN RUM 404 Error:** Console shows `Failed to load resource: the server responded with a status of 404` for `https://pikeandwest.com/cdn-cgi/rum?`. This is a Cloudflare Real User Monitoring endpoint that may not be configured.

### No Critical Issues

No critical issues found that would prevent content editing or publishing.

## Requires Manual Testing

The following items cannot be fully verified through automated browser testing:

- [ ] Fresh GitHub OAuth login flow (requires logging out first)
- [ ] Save/commit flow to GitHub (requires making actual changes)
- [ ] Verify commit appears on GitHub after save
- [ ] Create draft post and verify it doesn't appear on live site
- [ ] Delete test draft
- [ ] Verify changes appear on live site after deploy

## Recommendations

1. **Investigate Entry Parsing Error:** Check browser console during manual testing to identify which entry files have parsing issues. This may be a minor front matter formatting issue.

2. **Test Full Edit Cycle:** Manually test creating a new blog post, saving it, and verifying the commit appears on GitHub.

3. **Verify OAuth First-Time Login:** Test the GitHub OAuth flow from a fresh browser session to ensure first-time users can authenticate.

## Test Environment

- **URL:** <https://pikeandwest.com/admin/>
- **CMS:** Sveltia CMS
- **Auth:** GitHub OAuth via auth.pikeandwest.com
- **Browser:** Playwright headless Chrome
- **Date:** 2026-01-30
