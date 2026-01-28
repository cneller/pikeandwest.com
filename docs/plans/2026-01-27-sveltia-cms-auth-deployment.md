# Sveltia CMS Auth Deployment Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy GitHub OAuth authentication for Sveltia CMS so 2-3 editors can sign in at `pikeandwest.com/admin/` using their GitHub accounts.

**Architecture:** Cloudflare Worker (`sveltia-cms-auth`) handles the OAuth flow between the browser and GitHub. Custom domain `auth.pikeandwest.com` for a clean callback URL. Each editor is a GitHub collaborator on the repo with write access.

**Tech Stack:** Cloudflare Workers (wrangler CLI), GitHub OAuth Apps, Sveltia CMS

---

## Task 1: Register GitHub OAuth App

**Requires:** Human action (browser)

**Steps:**

1. Go to <https://github.com/settings/developers>
2. Click **OAuth Apps > New OAuth App**
3. Fill in:
   - **Application name:** `Sveltia CMS - Pike & West`
   - **Homepage URL:** `https://pikeandwest.com`
   - **Authorization callback URL:** `https://auth.pikeandwest.com/callback`
4. Click **Register application**
5. Copy the **Client ID** (visible on the app page)
6. Click **Generate a new client secret** and copy it immediately (shown only once)
7. Store both values securely (you'll need them in Task 2)

---

## Task 2: Deploy the Cloudflare Auth Worker

**Requires:** Human action (terminal), wrangler CLI, Cloudflare account

**Step 1: Clone and enter the auth Worker repo**

```bash
git clone https://github.com/sveltia/sveltia-cms-auth.git
cd sveltia-cms-auth
```

**Step 2: Login to Cloudflare**

```bash
npx wrangler login
```

This opens a browser window for Cloudflare authentication.

**Step 3: Set OAuth secrets**

```bash
npx wrangler secret put GITHUB_CLIENT_ID
# Paste the Client ID from Task 1 when prompted

npx wrangler secret put GITHUB_CLIENT_SECRET
# Paste the Client Secret from Task 1 when prompted
```

**Step 4: Deploy the Worker**

```bash
npx wrangler deploy
```

Note the Worker URL printed after deployment (e.g., `https://sveltia-cms-auth.<subdomain>.workers.dev`).

**Step 5: Verify the Worker is running**

```bash
curl -s https://sveltia-cms-auth.<subdomain>.workers.dev | head -5
```

Should return an HTML page or redirect (not a 404 or error).

---

## Task 3: Add Custom Domain to Worker

**Requires:** Human action (Cloudflare dashboard)

1. Go to **Cloudflare dashboard > Workers & Pages**
2. Click on **sveltia-cms-auth**
3. Go to **Settings > Domains & Routes**
4. Click **Add > Custom Domain**
5. Enter: `auth.pikeandwest.com`
6. Cloudflare will auto-create the DNS CNAME record and provision an SSL certificate
7. Wait for the domain status to show **Active** (usually under a minute)

**Verify:**

```bash
curl -s https://auth.pikeandwest.com | head -5
```

---

## Task 4: Update config.yml with Auth Worker URL

**Requires:** Claude (code change)

**File:** `static/admin/config.yml`

**Step 1: Uncomment and set `base_url`**

Change:

```yaml
  # base_url will be set after deploying sveltia-cms-auth Worker (Phase 6)
  # base_url: https://sveltia-cms-auth.<subdomain>.workers.dev
```

To:

```yaml
  base_url: https://auth.pikeandwest.com
  auth_endpoint: auth
```

**Step 2: Verify Hugo build**

```bash
hugo --gc --minify 2>&1
```

Expected: Clean build with 0 errors.

**Step 3: Commit**

```bash
git add static/admin/config.yml
git commit -m "feat: configure Sveltia CMS auth Worker URL for GitHub OAuth"
```

---

## Task 5: Add GitHub Collaborators

**Requires:** Human action (browser)

For each editor:

1. Go to <https://github.com/cneller/pikeandwest.com/settings/access>
2. Click **Add people**
3. Enter their GitHub username or email
4. Set role to **Write**
5. Click **Add**
6. They'll receive an email invitation to accept

If editors don't have GitHub accounts, they'll need to create one first at <https://github.com/signup>.

---

## Task 6: End-to-End Test

**Requires:** Human action (browser)

### Test 1: OAuth Login

1. Visit `https://pikeandwest.com/admin/`
2. Click **Sign in with GitHub**
3. A popup should open showing the GitHub authorization page
4. Click **Authorize**
5. Popup should close and you should see the CMS dashboard

### Test 2: Edit Content

1. Navigate to **Site Settings** in the CMS sidebar
2. Change the phone number temporarily (e.g., add a space)
3. Click **Save** (or **Publish**)
4. Wait for the GitHub commit to appear
5. Verify the Cloudflare Pages build triggers
6. Revert the phone number change

### Test 3: Blog Post

1. Create a new blog post with a title like "Test Post - Delete Me"
2. Set `draft: true`
3. Add a test image upload
4. Save the post
5. Verify the commit appears in GitHub
6. Delete the test post from the CMS

### Test 4: Repeat with Each Editor

1. Have each collaborator visit `/admin/` and sign in
2. Have them make a small edit and save
3. Verify commits are attributed to their GitHub account

---

## Rollback Plan

If something goes wrong:

- **OAuth popup fails:** Check that `base_url` in `config.yml` matches the Worker URL exactly
- **Worker returns errors:** Check secrets are set (`npx wrangler secret list`)
- **Custom domain not resolving:** Verify DNS record in Cloudflare dashboard
- **Collaborator can't edit:** Check they have **Write** access (not Read)
- **Quick fallback:** Editors can use PAT auth (no Worker needed) by removing `base_url` from config
