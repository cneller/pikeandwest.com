#!/usr/bin/env bash
#
# dns-switch.sh - Switch DNS between Webflow and Hugo configurations
#
# Usage:
#   ./scripts/dns-switch.sh webflow    # Switch to Webflow (CNAME to proxy.webflow.com)
#   ./scripts/dns-switch.sh hugo       # Switch to Hugo/Cloudflare Pages (CNAME to pages.dev)
#   ./scripts/dns-switch.sh status     # Show current DNS configuration
#
# Required environment variables (accepts either naming convention):
#   CF_API_TOKEN or CLOUDFLARE_API_TOKEN  - Cloudflare API token with DNS edit permissions
#   CF_ZONE_ID or CLOUDFLARE_ZONE_ID      - Cloudflare Zone ID for pikeandwest.com
#
# Optional environment variables:
#   CF_PAGES_DOMAIN - Cloudflare Pages domain (default: pikeandwest-com.pages.dev)
#
# IMPORTANT: This script only modifies CNAME records for the apex domain and www.
# MX, TXT, and other records are preserved.
#

set -euo pipefail

# Configuration
DOMAIN="pikeandwest.com"
CF_API_BASE="https://api.cloudflare.com/client/v4"
CF_PAGES_DOMAIN="${CF_PAGES_DOMAIN:-pikeandwest.pages.dev}"
WEBFLOW_PROXY="proxy.webflow.com"

# Accept both CF_ and CLOUDFLARE_ prefixed environment variables
CF_API_TOKEN="${CF_API_TOKEN:-${CLOUDFLARE_API_TOKEN:-}}"
CF_ZONE_ID="${CF_ZONE_ID:-${CLOUDFLARE_ZONE_ID:-}}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

check_requirements() {
	if ! command -v curl &>/dev/null; then
		log_error "curl is required but not installed"
		exit 1
	fi
	if ! command -v jq &>/dev/null; then
		log_error "jq is required but not installed. Install with: brew install jq"
		exit 1
	fi
	if [[ -z "${CF_API_TOKEN}" ]]; then
		log_error "CF_API_TOKEN or CLOUDFLARE_API_TOKEN environment variable is required"
		log_info "Create a token at: https://dash.cloudflare.com/profile/api-tokens"
		log_info "Required permissions: Zone.DNS (Edit)"
		exit 1
	fi
	if [[ -z "${CF_ZONE_ID}" ]]; then
		log_error "CF_ZONE_ID or CLOUDFLARE_ZONE_ID environment variable is required"
		log_info "Find your Zone ID in the Cloudflare dashboard → pikeandwest.com → Overview (right sidebar)"
		exit 1
	fi
}

cf_api() {
	local method="$1"
	local endpoint="$2"
	local data="${3:-}"

	local args=(
		-s
		-X "$method"
		-H "Authorization: Bearer $CF_API_TOKEN"
		-H "Content-Type: application/json"
	)

	if [[ -n "$data" ]]; then
		args+=(-d "$data")
	fi

	curl "${args[@]}" "${CF_API_BASE}${endpoint}"
}

get_dns_records() {
	local name="$1"
	cf_api GET "/zones/${CF_ZONE_ID}/dns_records?name=${name}"
}

get_cname_record_id() {
	local name="$1"
	local records=$(get_dns_records "$name")
	echo "$records" | jq -r '.result[] | select(.type == "CNAME") | .id' | head -1
}

get_cname_content() {
	local name="$1"
	local records=$(get_dns_records "$name")
	echo "$records" | jq -r '.result[] | select(.type == "CNAME") | .content' | head -1
}

delete_dns_record() {
	local record_id="$1"
	cf_api DELETE "/zones/${CF_ZONE_ID}/dns_records/${record_id}"
}

create_dns_record() {
	local type="$1"
	local name="$2"
	local content="$3"
	local proxied="${4:-true}"

	local data=$(jq -n \
		--arg type "$type" \
		--arg name "$name" \
		--arg content "$content" \
		--argjson proxied "$proxied" \
		'{type: $type, name: $name, content: $content, proxied: $proxied, ttl: 1}')

	cf_api POST "/zones/${CF_ZONE_ID}/dns_records" "$data"
}

update_dns_record() {
	local record_id="$1"
	local type="$2"
	local name="$3"
	local content="$4"
	local proxied="${5:-true}"

	local data=$(jq -n \
		--arg type "$type" \
		--arg name "$name" \
		--arg content "$content" \
		--argjson proxied "$proxied" \
		'{type: $type, name: $name, content: $content, proxied: $proxied, ttl: 1}')

	cf_api PATCH "/zones/${CF_ZONE_ID}/dns_records/${record_id}" "$data"
}

show_status() {
	log_info "Current DNS configuration for ${DOMAIN}:"
	echo ""

	echo -e "${YELLOW}Naked Domain (${DOMAIN}):${NC}"
	local apex_records=$(get_dns_records "$DOMAIN")
	echo "$apex_records" | jq -r '.result[] | "  \(.type)\t\(.content)\t(proxied: \(.proxied))"'

	echo ""
	echo -e "${YELLOW}WWW Alias (www.${DOMAIN}):${NC}"
	local www_records=$(get_dns_records "www.${DOMAIN}")
	echo "$www_records" | jq -r '.result[] | "  \(.type)\t\(.content)\t(proxied: \(.proxied))"'

	echo ""

	# Detect current mode based on CNAME target
	local apex_cname=$(echo "$apex_records" | jq -r '.result[] | select(.type == "CNAME") | .content' | head -1)

	if [[ "$apex_cname" == *"webflow"* ]]; then
		log_info "Detected configuration: ${GREEN}WEBFLOW${NC} (CNAME → ${apex_cname})"
	elif [[ "$apex_cname" == *"pages.dev"* ]]; then
		log_info "Detected configuration: ${GREEN}HUGO${NC} (CNAME → ${apex_cname})"
	elif [[ -z "$apex_cname" ]]; then
		local apex_a=$(echo "$apex_records" | jq -r '.result[] | select(.type == "A") | .content' | head -1)
		if [[ -n "$apex_a" ]]; then
			log_warn "Configuration uses A records (${apex_a}) - not standard CNAME setup"
		else
			log_warn "No CNAME or A records found for apex domain"
		fi
	else
		log_warn "Unknown CNAME target: ${apex_cname}"
	fi
}

switch_cname() {
	local name="$1"
	local target="$2"
	local display_name="$3"

	local record_id=$(get_cname_record_id "$name")

	if [[ -n "$record_id" ]]; then
		log_info "Updating CNAME record for ${display_name}..."
		local result=$(update_dns_record "$record_id" "CNAME" "$name" "$target" "true")
		if echo "$result" | jq -e '.success' >/dev/null 2>&1; then
			log_success "Updated CNAME: ${name} → ${target}"
		else
			log_error "Failed to update CNAME for ${name}"
			echo "$result" | jq .
			return 1
		fi
	else
		log_info "Creating CNAME record for ${display_name}..."
		local result=$(create_dns_record "CNAME" "$name" "$target" "true")
		if echo "$result" | jq -e '.success' >/dev/null 2>&1; then
			log_success "Created CNAME: ${name} → ${target}"
		else
			log_error "Failed to create CNAME for ${name}"
			echo "$result" | jq .
			return 1
		fi
	fi
}

switch_to_webflow() {
	log_info "Switching to WEBFLOW configuration..."
	log_info "Target: ${WEBFLOW_PROXY}"
	echo ""

	switch_cname "$DOMAIN" "$WEBFLOW_PROXY" "naked domain"
	switch_cname "www.${DOMAIN}" "$WEBFLOW_PROXY" "www alias"

	echo ""
	log_success "Switched to WEBFLOW configuration"
	log_info "MX and TXT records were preserved"
}

switch_to_hugo() {
	log_info "Switching to HUGO configuration..."
	log_info "Target: ${CF_PAGES_DOMAIN}"
	echo ""

	switch_cname "$DOMAIN" "$CF_PAGES_DOMAIN" "naked domain"
	switch_cname "www.${DOMAIN}" "$CF_PAGES_DOMAIN" "www alias"

	echo ""
	log_success "Switched to HUGO configuration"
	log_info "MX and TXT records were preserved"
}

show_usage() {
	cat <<EOF
Usage: $0 <command>

Commands:
  webflow    Switch to Webflow (CNAME to proxy.webflow.com)
  hugo       Switch to Hugo/Cloudflare Pages (CNAME to ${CF_PAGES_DOMAIN})
  status     Show current DNS configuration

Required environment variables:
  CF_API_TOKEN or CLOUDFLARE_API_TOKEN  - Cloudflare API token with DNS edit permissions
  CF_ZONE_ID or CLOUDFLARE_ZONE_ID      - Cloudflare Zone ID for pikeandwest.com

Optional environment variables:
  CF_PAGES_DOMAIN - Cloudflare Pages domain (default: pikeandwest-com.pages.dev)

Note: This script only modifies CNAME records. MX, TXT, and other records are preserved.

Examples:
  # Check current configuration
  ./scripts/dns-switch.sh status

  # Switch to Hugo
  ./scripts/dns-switch.sh hugo

  # Switch back to Webflow
  ./scripts/dns-switch.sh webflow
EOF
}

main() {
	local command="${1:-}"

	if [[ -z "$command" ]]; then
		show_usage
		exit 1
	fi

	case "$command" in
	webflow)
		check_requirements
		switch_to_webflow
		;;
	hugo)
		check_requirements
		switch_to_hugo
		;;
	status)
		check_requirements
		show_status
		;;
	-h | --help | help)
		show_usage
		;;
	*)
		log_error "Unknown command: $command"
		show_usage
		exit 1
		;;
	esac
}

main "$@"
