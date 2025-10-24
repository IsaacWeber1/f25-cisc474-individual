#!/bin/bash
# Create Auth0 users using Management API (proper password setting)
# Usage: ./scripts/create-users-mgmt-api.sh [users-config.json]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load Management API credentials from scripts/.env
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
    source "$SCRIPT_DIR/.env"
else
    echo -e "${RED}❌ Error: scripts/.env not found${NC}"
    echo "Create scripts/.env with your Auth0 Management API credentials:"
    echo "  AUTH0_MGMT_CLIENT_ID=your_client_id"
    echo "  AUTH0_MGMT_CLIENT_SECRET=your_client_secret"
    echo "  AUTH0_MGMT_DOMAIN=dev-3ak1hbs2abxn01ak.us.auth0.com"
    exit 1
fi

# Validate credentials
if [ -z "$AUTH0_MGMT_CLIENT_ID" ] || [ -z "$AUTH0_MGMT_CLIENT_SECRET" ] || [ -z "$AUTH0_MGMT_DOMAIN" ]; then
    echo -e "${RED}❌ Error: Missing Management API credentials in scripts/.env${NC}"
    exit 1
fi

CONNECTION="${AUTH0_CONNECTION:-Username-Password-Authentication}"
USERS_CONFIG="${1:-$SCRIPT_DIR/test-users.json}"

echo -e "${BLUE}🔐 Auth0 Management API User Creation${NC}"
echo "================================================"
echo -e "Domain:     ${GREEN}${AUTH0_MGMT_DOMAIN}${NC}"
echo -e "Client ID:  ${GREEN}${AUTH0_MGMT_CLIENT_ID:0:20}...${NC}"
echo -e "Connection: ${GREEN}${CONNECTION}${NC}"
echo "================================================"
echo ""

# Step 1: Get Management API access token
echo -e "${BLUE}🔑 Getting Management API access token...${NC}"

TOKEN_RESPONSE=$(curl -s -X POST "https://${AUTH0_MGMT_DOMAIN}/oauth/token" \
    -H "Content-Type: application/json" \
    -d "{
        \"client_id\": \"${AUTH0_MGMT_CLIENT_ID}\",
        \"client_secret\": \"${AUTH0_MGMT_CLIENT_SECRET}\",
        \"audience\": \"https://${AUTH0_MGMT_DOMAIN}/api/v2/\",
        \"grant_type\": \"client_credentials\"
    }")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}❌ Failed to get access token${NC}"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Access token obtained${NC}"
echo ""

# Function to create a single user
create_user() {
    local email=$1
    local password=$2
    local name=$3

    echo -e "${BLUE}Creating:${NC} $email"

    response=$(curl -s -w "\n%{http_code}" -X POST "https://${AUTH0_MGMT_DOMAIN}/api/v2/users" \
        -H "Authorization: Bearer ${ACCESS_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"${email}\",
            \"password\": \"${password}\",
            \"name\": \"${name}\",
            \"connection\": \"${CONNECTION}\",
            \"email_verified\": true,
            \"verify_email\": false
        }")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    if [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ Success:${NC} $email created"
        return 0
    elif echo "$body" | grep -q "already exists"; then
        echo -e "${YELLOW}⚠️  Warning:${NC} $email already exists"
        return 0
    else
        echo -e "${RED}❌ Failed:${NC} $email"
        echo -e "${RED}   HTTP ${http_code}:${NC} $(echo "$body" | head -c 200)"
        return 1
    fi
}

# Function to create users from JSON config
create_users_from_json() {
    local config_file=$1

    if [ ! -f "$config_file" ]; then
        echo -e "${RED}❌ Error: Config file not found: $config_file${NC}"
        exit 1
    fi

    echo -e "${BLUE}📄 Loading users from:${NC} $config_file"
    echo ""

    # Check if jq is available
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}❌ Error: 'jq' not found${NC}"
        echo "Install jq: brew install jq (macOS) or apt-get install jq (Linux)"
        exit 1
    fi

    # Parse JSON and create users
    success_count=0
    fail_count=0

    while IFS= read -r user; do
        email=$(echo "$user" | jq -r '.email')
        password=$(echo "$user" | jq -r '.password')
        name=$(echo "$user" | jq -r '.name')

        if create_user "$email" "$password" "$name"; then
            ((success_count++))
        else
            ((fail_count++))
        fi

        # Rate limiting - wait between requests
        sleep 0.5
        echo ""
    done < <(jq -c '.users[]' "$config_file")

    return $fail_count
}

# Function to create default demo users
create_default_users() {
    echo -e "${BLUE}📋 Creating default demo users...${NC}"
    echo ""

    success_count=0
    fail_count=0

    # Default users array
    declare -a users=(
        "john.student@example.edu|TestPass123!|John Student"
        "dr.bart@example.edu|TestPass123!|Dr. Bart"
        "mike.ta@example.edu|TestPass123!|Mike TA"
        "jane.doe@example.edu|TestPass123!|Jane Doe"
    )

    for user in "${users[@]}"; do
        IFS='|' read -r email password name <<< "$user"

        if create_user "$email" "$password" "$name"; then
            ((success_count++))
        else
            ((fail_count++))
        fi

        sleep 0.5
        echo ""
    done

    return $fail_count
}

# Main execution
if [ -f "$USERS_CONFIG" ]; then
    create_users_from_json "$USERS_CONFIG"
    exit_code=$?
else
    echo -e "${YELLOW}ℹ️  No config file found: $USERS_CONFIG${NC}"
    echo "Creating default demo users instead..."
    echo ""
    create_default_users
    exit_code=$?
fi

# Summary
echo "================================================"
if [ $exit_code -eq 0 ]; then
    echo -e "${GREEN}✅ All users created successfully!${NC}"
    echo ""
    echo "🔑 Default credentials (if using defaults):"
    echo "   Password: TestPass123!"
    echo ""
    echo "🌐 Test at: http://localhost:3001"
else
    echo -e "${YELLOW}⚠️  Completed with some errors (see above)${NC}"
fi
echo "================================================"

exit $exit_code
