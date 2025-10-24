#!/bin/bash
# Create Auth0 test users for development and testing
# Usage: ./scripts/create-test-users.sh [users-config.json]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables from apps/web-start/.env
if [ -f "apps/web-start/.env" ]; then
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
        # Remove quotes from value
        value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/' | sed "s/^'\(.*\)'$/\1/")
        # Export the variable
        export "$key=$value"
    done < apps/web-start/.env
fi

# Configuration (can be overridden by environment variables)
AUTH0_DOMAIN="${VITE_AUTH0_DOMAIN:-${AUTH0_DOMAIN}}"
CLIENT_ID="${VITE_AUTH0_CLIENT_ID:-${AUTH0_CLIENT_ID}}"
CONNECTION="${AUTH0_CONNECTION:-Username-Password-Authentication}"

# Users configuration file
USERS_CONFIG="${2:-scripts/test-users.json}"

# Validate required environment variables
if [ -z "$AUTH0_DOMAIN" ] || [ -z "$CLIENT_ID" ]; then
    echo -e "${RED}❌ Error: Missing Auth0 configuration${NC}"
    echo "Required environment variables:"
    echo "  - VITE_AUTH0_DOMAIN or AUTH0_DOMAIN"
    echo "  - VITE_AUTH0_CLIENT_ID or AUTH0_CLIENT_ID"
    echo ""
    echo "Make sure .env or apps/web-start/.env contains Auth0 configuration"
    exit 1
fi

echo -e "${BLUE}🔐 Auth0 User Creation Script${NC}"
echo "================================================"
echo -e "Domain:     ${GREEN}${AUTH0_DOMAIN}${NC}"
echo -e "Client ID:  ${GREEN}${CLIENT_ID:0:20}...${NC}"
echo -e "Connection: ${GREEN}${CONNECTION}${NC}"
echo "================================================"
echo ""

# Function to create a single user
create_user() {
    local email=$1
    local password=$2
    local name=$3

    echo -e "${BLUE}Creating:${NC} $email"

    response=$(curl -s -w "\n%{http_code}" -X POST "https://${AUTH0_DOMAIN}/dbconnections/signup" \
        -H "Content-Type: application/json" \
        -d "{
            \"client_id\": \"${CLIENT_ID}\",
            \"email\": \"${email}\",
            \"password\": \"${password}\",
            \"connection\": \"${CONNECTION}\",
            \"name\": \"${name}\"
        }")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ Success:${NC} $email created"
        return 0
    elif echo "$body" | grep -q "user already exists"; then
        echo -e "${YELLOW}⚠️  Warning:${NC} $email already exists (skipping)"
        return 0
    else
        echo -e "${RED}❌ Failed:${NC} $email"
        echo -e "${RED}   HTTP ${http_code}:${NC} $body"
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

    # Parse JSON and create users
    users=$(cat "$config_file" | jq -c '.users[]' 2>/dev/null)

    if [ -z "$users" ]; then
        echo -e "${RED}❌ Error: Invalid JSON or no users found in config file${NC}"
        exit 1
    fi

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
    done <<< "$users"

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
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}⚠️  Warning: 'jq' not found. Cannot parse JSON config.${NC}"
        echo "Install jq: brew install jq (macOS) or apt-get install jq (Linux)"
        echo ""
        echo "Falling back to default users..."
        echo ""
        create_default_users
        exit_code=$?
    else
        create_users_from_json "$USERS_CONFIG"
        exit_code=$?
    fi
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
    echo "🌐 Test at: http://localhost:3002"
else
    echo -e "${YELLOW}⚠️  Completed with some errors (see above)${NC}"
fi
echo "================================================"

exit $exit_code
