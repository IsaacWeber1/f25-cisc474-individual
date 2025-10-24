#!/bin/bash
# Reset passwords for existing Auth0 users
# Usage: ./scripts/reset-user-passwords.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load Management API credentials
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
    source "$SCRIPT_DIR/.env"
else
    echo -e "${RED}❌ Error: scripts/.env not found${NC}"
    exit 1
fi

echo -e "${BLUE}🔑 Auth0 Password Reset Tool${NC}"
echo "================================================"
echo ""

# Get access token
echo -e "${BLUE}Getting Management API token...${NC}"
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
    exit 1
fi

echo -e "${GREEN}✅ Token obtained${NC}"
echo ""

# Function to get user ID by email
get_user_id() {
    local email=$1
    local response=$(curl -s "https://${AUTH0_MGMT_DOMAIN}/api/v2/users-by-email?email=${email}" \
        -H "Authorization: Bearer ${ACCESS_TOKEN}")

    echo "$response" | grep -o '"user_id":"[^"]*' | head -1 | cut -d'"' -f4
}

# Function to reset password
reset_password() {
    local email=$1
    local password=$2

    echo -e "${BLUE}Resetting password for:${NC} $email"

    # Get user ID
    user_id=$(get_user_id "$email")

    if [ -z "$user_id" ]; then
        echo -e "${RED}❌ User not found:${NC} $email"
        return 1
    fi

    # Update password
    response=$(curl -s -w "\n%{http_code}" -X PATCH "https://${AUTH0_MGMT_DOMAIN}/api/v2/users/${user_id}" \
        -H "Authorization: Bearer ${ACCESS_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{
            \"password\": \"${password}\",
            \"connection\": \"Username-Password-Authentication\"
        }")

    http_code=$(echo "$response" | tail -n1)

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ Password reset successful${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed (HTTP ${http_code})${NC}"
        return 1
    fi
}

# Reset passwords for demo users
echo -e "${BLUE}📋 Resetting passwords for demo users...${NC}"
echo ""

SUCCESS=0
FAILED=0

# Array of users
declare -a users=(
    "john.student@example.edu|TestPass123!"
    "dr.bart@example.edu|TestPass123!"
    "mike.ta@example.edu|TestPass123!"
    "jane.doe@example.edu|TestPass123!"
)

for user in "${users[@]}"; do
    IFS='|' read -r email password <<< "$user"

    if reset_password "$email" "$password"; then
        ((SUCCESS++))
    else
        ((FAILED++))
    fi

    sleep 0.5
    echo ""
done

# Summary
echo "================================================"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All passwords reset successfully! (${SUCCESS}/4)${NC}"
    echo ""
    echo "🔑 You can now login with:"
    echo "   Email: john.student@example.edu (or others)"
    echo "   Password: TestPass123!"
    echo ""
    echo "🌐 Test at: http://localhost:3001"
else
    echo -e "${YELLOW}⚠️  ${SUCCESS} succeeded, ${FAILED} failed${NC}"
fi
echo "================================================"

exit $FAILED
