#!/usr/bin/env bash
# Check URL index status via Google Search Console API
# Usage: ./check-url.sh "https://pikeandwest.com/some-page/"
#
# Prerequisites:
#   - gcloud CLI installed
#   - Run: gcloud auth application-default login
#   - Google Cloud project with Search Console API enabled
#   - Site verified in Google Search Console

set -euo pipefail

URL="${1:?Usage: $0 <url>}"
SITE_URL="${GSC_SITE_URL:-sc-domain:pikeandwest.com}"
QUOTA_PROJECT="${GSC_QUOTA_PROJECT:-pikewest-gsc}"

# Get access token from gcloud
ACCESS_TOKEN=$(gcloud auth application-default print-access-token 2>/dev/null) || {
	echo "Error: Could not get access token. Run: gcloud auth application-default login" >&2
	exit 1
}

# Call URL Inspection API
response=$(curl -s -X POST \
	"https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" \
	-H "Authorization: Bearer $ACCESS_TOKEN" \
	-H "Content-Type: application/json" \
	-H "x-goog-user-project: $QUOTA_PROJECT" \
	-d "{
    \"inspectionUrl\": \"$URL\",
    \"siteUrl\": \"$SITE_URL\"
  }")

# Check for errors
if echo "$response" | jq -e '.error' >/dev/null 2>&1; then
	echo "$response" | jq -r '.error.message' >&2
	exit 1
fi

# Extract relevant fields
echo "$response" | jq '{
  url: .inspectionResult.indexStatusResult.inspectedUrl,
  verdict: .inspectionResult.indexStatusResult.verdict,
  coverageState: .inspectionResult.indexStatusResult.coverageState,
  lastCrawlTime: .inspectionResult.indexStatusResult.lastCrawlTime,
  robotsTxtState: .inspectionResult.indexStatusResult.robotsTxtState,
  indexingState: .inspectionResult.indexStatusResult.indexingState,
  pageFetchState: .inspectionResult.indexStatusResult.pageFetchState,
  crawledAs: .inspectionResult.indexStatusResult.crawledAs
}'
