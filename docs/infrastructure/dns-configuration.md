# DNS Configuration

> Last verified: 2026-01-21 (via Cloudflare API)

## Canonical Domain

**Canonical URL: `https://pikeandwest.com/`** (naked domain)

Changed from `www.pikeandwest.com` on 2026-01-21. See [migration analysis](./canonical-domain-migration-analysis.md) for rationale.

Google Search Console domain property (`sc-domain:pikeandwest.com`) covers all variants. The www version now 301 redirects to naked domain via Cloudflare Pages `_redirects` file.

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

## Rollback Configuration (Webflow)

If rollback to Webflow is needed, change CNAME records back to Webflow's proxy servers. Email and verification records remain untouched.

### Records to Change for Rollback

| Domain                | Current Target          | Rollback Target     |
|-----------------------|-------------------------|---------------------|
| `pikeandwest.com`     | `pikeandwest.pages.dev` | `proxy.webflow.com` |
| `www.pikeandwest.com` | `pikeandwest.pages.dev` | `proxy.webflow.com` |

### Records to Preserve (Do Not Modify)

| Type | Name              | Value                    |
|------|-------------------|--------------------------|
| MX   | `pikeandwest.com` | All 5 Google MX records  |
| TXT  | `pikeandwest.com` | SPF record               |
| TXT  | `pikeandwest.com` | Google site verification |

### Migration Steps

> **IMPORTANT:** Step 1 MUST be completed before switching DNS, or you'll get **Error 1014 (CNAME Cross-User Banned)**. Cloudflare blocks CNAME records pointing to `*.pages.dev` unless the custom domain is registered in the Pages project first.

1. **Add custom domain in Cloudflare Pages dashboard** (REQUIRED FIRST)
   - Go to Cloudflare Dashboard → Pages → `pikeandwest-com` project
   - Click **Custom domains** tab
   - Add `pikeandwest.com` and `www.pikeandwest.com`
   - Verification is instant since DNS is already in the same Cloudflare account

2. **Update CNAME records only**
   - Change naked domain CNAME from `proxy.webflow.com` to `pikeandwest.pages.dev`
   - Change www CNAME from `proxy.webflow.com` to `pikeandwest.pages.dev`
   - Keep proxy enabled (orange cloud)
   - **Do NOT touch MX or TXT records**

3. **Configure redirects**
   - Set up www → naked redirect in `static/_redirects` or Cloudflare Page Rules
   - Required: `www.pikeandwest.com` → `pikeandwest.com` (naked domain is canonical)

4. **Verify SSL**
   - Cloudflare Pages automatically provisions SSL
   - Verify certificate covers both domains

### Redirect Configuration

Add to `static/_redirects` for Cloudflare Pages:

```text
# Redirect www to naked domain (naked domain is canonical)
https://www.pikeandwest.com/* https://pikeandwest.com/:splat 301
```

Or configure via Cloudflare Page Rules for more control.

---

## Automated DNS Switching

Use the [`scripts/dns-switch.sh`](../../scripts/dns-switch.sh) script to toggle between configurations.

**Important:** The script only modifies CNAME records for the naked domain and <www>. It preserves MX and TXT records.

### Prerequisites

1. **Cloudflare API Token** with DNS edit permissions
   - Token name: `pikeandwest-github-actions`
   - Required permission: `Zone.DNS (Edit)`

2. **Zone ID:** `99695c1c04b837158e1c2beceb18ba14`

3. **jq** installed (`brew install jq`)

### Usage

```bash
# Credentials are loaded via direnv from .envrc
direnv allow

# Check current configuration
./scripts/dns-switch.sh status

# Switch to Hugo (Cloudflare Pages)
./scripts/dns-switch.sh hugo

# Switch back to Webflow
./scripts/dns-switch.sh webflow
```

### Environment Variables

| Variable               | Value                              | Description                    |
|------------------------|------------------------------------|--------------------------------|
| `CLOUDFLARE_API_TOKEN` | (in `.envrc`)                      | API token with DNS edit access |
| `CLOUDFLARE_ZONE_ID`   | `99695c1c04b837158e1c2beceb18ba14` | Zone ID for pikeandwest.com    |
| `CF_PAGES_DOMAIN`      | `pikeandwest.pages.dev`            | Cloudflare Pages target        |

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

---

## Rollback Procedure

If issues occur after switching to Hugo, revert to Webflow:

```bash
./scripts/dns-switch.sh webflow
```

This changes CNAME targets back to `proxy.webflow.com`. DNS propagation is typically immediate since Cloudflare manages both the DNS and the proxy.
