# Google Search Console URL Inspection

Scripts to check URL index status via the GSC API.

## Prerequisites

1. **gcloud CLI** installed ([installation guide](https://cloud.google.com/sdk/docs/install))
2. **Google Cloud project** with Search Console API enabled
3. **Site verified** in Google Search Console
4. **jq** installed for JSON parsing (`brew install jq`)

## Setup

### 1. Enable the Search Console API

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable the API
gcloud services enable searchconsole.googleapis.com
```

### 2. Authenticate

```bash
gcloud auth application-default login
```

This opens a browser for Google OAuth. Select the account that owns the Search Console property.

### 3. Verify Access

```bash
cd scripts/gsc
./check-url.sh "https://pikeandwest.com/"
```

You should see JSON output with index status.

## Usage

### Single URL

```bash
./check-url.sh "https://pikeandwest.com/contact/"
```

### Multiple URLs

Create a file with URLs (one per line):

```bash
cat > urls.txt << 'EOF'
https://pikeandwest.com/contact/
https://pikeandwest.com/gallery/
https://pikeandwest.com/blog/
# This is a comment (ignored)
EOF
```

Run bulk check:

```bash
./bulk-check.sh urls.txt > results.jsonl
```

### Custom Site Property

By default, scripts use `sc-domain:pikeandwest.com`. To check a different property:

```bash
GSC_SITE_URL="sc-domain:example.com" ./check-url.sh "https://example.com/page/"
```

## Output Format

### Single URL Response

```json
{
  "url": "https://pikeandwest.com/contact/",
  "verdict": "PASS",
  "coverageState": "Submitted and indexed",
  "lastCrawlTime": "2025-12-15T10:30:00Z",
  "robotsTxtState": "ALLOWED",
  "indexingState": "INDEXING_ALLOWED",
  "pageFetchState": "SUCCESSFUL",
  "crawledAs": "DESKTOP"
}
```

### Verdict Values

| Verdict               | Meaning                                     |
|-----------------------|---------------------------------------------|
| `PASS`                | URL is indexed and appears in Google Search |
| `NEUTRAL`             | URL could be indexed but isn't currently    |
| `FAIL`                | URL cannot be indexed due to an error       |
| `VERDICT_UNSPECIFIED` | No data available                           |

### Coverage States

| State                                | Meaning                |
|--------------------------------------|------------------------|
| `Submitted and indexed`              | In sitemap and indexed |
| `Indexed, not submitted in sitemap`  | Found via crawling     |
| `Discovered - currently not indexed` | Known but not indexed  |
| `Crawled - currently not indexed`    | Crawled but excluded   |
| `URL is unknown to Google`           | Never seen             |

## Rate Limits

| Limit               | Value              |
|---------------------|--------------------|
| Requests per day    | 2,000 per property |
| Requests per minute | 600                |

The bulk script adds 100ms delay between requests to stay well under limits.

## Troubleshooting

### "Could not get access token"

Re-authenticate:

```bash
gcloud auth application-default login
```

### "Request had insufficient authentication scopes"

Your credentials don't include Search Console access. Re-run login and ensure you grant all requested permissions.

### "User does not have sufficient permission"

Your Google account doesn't have access to the Search Console property. Verify:

1. Go to [Search Console](https://search.google.com/search-console)
2. Check you can see the property
3. Verify you have Owner or Full access

### "API has not been used in project"

Enable the API:

```bash
gcloud services enable searchconsole.googleapis.com
```

### Empty or null fields

Some fields are only populated after Google has crawled the URL. New or never-crawled URLs may have null values.

## Integration with Sitemap Architect

The sitemap-architect agent uses these scripts to check index status during URL migration analysis. If the scripts aren't configured, the agent falls back to other risk signals (internal links, git history, sitemap presence).

## Related

- [URL Migration Patterns](../../docs/architecture/patterns/url-migration-patterns.md)
- [Google URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)
- [Search Console API Reference](https://developers.google.com/webmaster-tools/v1/api_reference_index)
