# DNS Configuration

> Last verified: 2026-01-21 (via Cloudflare API)

## Canonical Domain

**Canonical URL: `https://pikeandwest.com/`** (naked domain)

Changed from `www.pikeandwest.com` on 2026-01-21. See [migration analysis](./canonical-domain-migration-analysis.md) for rationale.

Google Search Console domain property (`sc-domain:pikeandwest.com`) covers all variants. The www version now 301 redirects to naked domain via Cloudflare Redirect Rules (zone-level).

---

## Current Configuration (Hugo on Cloudflare Pages)

The site is proxied through Cloudflare with CNAME records pointing to Cloudflare Pages.

### Naked Domain (`pikeandwest.com`)

| Type  | Value                                                                  | Proxied |
|-------|------------------------------------------------------------------------|---------|
| CNAME | `pikeandwest.pages.dev`                                                | Yes     |
| MX    | `aspmx.l.google.com` (priority 1)                                      | No      |
| MX    | `alt1.aspmx.l.google.com` (priority 5)                                 | No      |
| MX    | `alt2.aspmx.l.google.com` (priority 5)                                 | No      |
| MX    | `aspmx2.googlemail.com` (priority 10)                                  | No      |
| MX    | `aspmx3.googlemail.com` (priority 10)                                  | No      |
| TXT   | `v=spf1 include:_spf.google.com ~all`                                  | No      |
| TXT   | `google-site-verification=uQ3Y6FTDWnTV0NjkbY3uHn6HuBmein-vcm2fbUU-jZ0` | No      |

### WWW Alias (`www.pikeandwest.com`)

| Type  | Value                   | Proxied |
|-------|-------------------------|---------|
| CNAME | `pikeandwest.pages.dev` | Yes     |

### Important Notes

- **CNAME flattening:** Cloudflare automatically flattens CNAME records at the apex (naked domain) to A records when queried externally. Running `dig pikeandwest.com` returns A records (`104.21.12.3`, `172.67.150.230`) even though the actual Cloudflare DNS record is a CNAME.
- **Email:** MX records route to Google Workspace. These must be preserved during any DNS changes.
- **SPF:** TXT record for email authentication must be preserved.
- **Google verification:** Site verification TXT record for Google Search Console.

---

## Redirect Configuration (Redirect Rules)

Cross-domain redirects (www → naked) use **Cloudflare Redirect Rules** at the zone level. This is simpler than Bulk Redirects and is the recommended approach for single-domain www redirects.

**Current Configuration:**

| Setting               | Value                                |
|-----------------------|--------------------------------------|
| Rule name             | Redirect from WWW to root [Template] |
| Request URL pattern   | `https://www.*`                      |
| Target URL            | `https://${1}`                       |
| Status code           | 301                                  |
| Preserve query string | Yes                                  |

**How it works:** The wildcard pattern `https://www.*` captures everything after `www.` and the `${1}` replacement inserts it into the target URL. For example, `https://www.pikeandwest.com/contact/` becomes `https://pikeandwest.com/contact/`.

**Setup via Cloudflare Dashboard:**

1. Go to Zone → pikeandwest.com → Rules → Overview
2. Use the "Redirect from WWW to root" template
3. Enable "Preserve query string"
4. Deploy

**Test redirect:**

```bash
curl -I https://www.pikeandwest.com/
# Expected: HTTP/2 301, location: https://pikeandwest.com/
```

Reference: [Cloudflare Redirect Rules documentation](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/)

---

## Verification Commands

```bash
# Check actual Cloudflare records (requires API token)
./scripts/dns-switch.sh status

# External DNS query (shows flattened A records due to Cloudflare proxy)
dig pikeandwest.com +short
dig www.pikeandwest.com +short

# Check MX records (email routing)
dig pikeandwest.com MX +short

# Check TXT records (SPF, verification)
dig pikeandwest.com TXT +short

# Check SSL certificate
echo | openssl s_client -servername pikeandwest.com -connect pikeandwest.com:443 2>/dev/null | openssl x509 -noout -dates -subject
```
