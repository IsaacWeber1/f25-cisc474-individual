#!/bin/bash

# Authentication Testing Suite Runner
# Executes comprehensive tests for the Auth0 integration

echo "================================================"
echo "🔐 Authentication Testing Suite"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if servers are running
check_server() {
    local port=$1
    local name=$2
    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $name is running on port $port"
        return 0
    else
        echo -e "${RED}✗${NC} $name is not running on port $port"
        return 1
    fi
}

echo "Checking servers..."
frontend_running=$(check_server 3001 "Frontend")
backend_running=$(check_server 3000 "Backend API")

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Warning: Servers not running. Starting them now...${NC}"
    npm run dev &
    SERVER_PID=$!
    sleep 10 # Wait for servers to start
fi

echo ""
echo "================================================"
echo "Running Frontend Integration Tests"
echo "================================================"

# Run frontend integration tests
npx playwright test tests/e2e/auth/frontend-integration.spec.ts --reporter=list

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend integration tests passed${NC}"
else
    echo -e "${RED}✗ Frontend integration tests failed${NC}"
fi

echo ""
echo "================================================"
echo "Checking for Test Credentials"
echo "================================================"

if [ -z "$TEST_AUTH0_EMAIL" ] || [ -z "$TEST_AUTH0_PASSWORD" ]; then
    echo -e "${YELLOW}⚠️  Test credentials not set${NC}"
    echo "To run full authentication flow tests, set:"
    echo "  export TEST_AUTH0_EMAIL='your-test-email@example.com'"
    echo "  export TEST_AUTH0_PASSWORD='your-test-password'"
    echo ""
    echo "Skipping complete auth flow tests..."
else
    echo -e "${GREEN}✓ Test credentials found${NC}"
    echo ""
    echo "================================================"
    echo "Running Complete Authentication Flow Tests"
    echo "================================================"

    npx playwright test tests/e2e/auth/complete-auth-flow.spec.ts --reporter=list

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Complete auth flow tests passed${NC}"
    else
        echo -e "${RED}✗ Complete auth flow tests failed${NC}"
    fi
fi

echo ""
echo "================================================"
echo "API Security Check"
echo "================================================"

# Quick API security check
echo "Testing endpoint protection..."

# Test each protected endpoint
endpoints=("/courses" "/grades" "/submissions" "/links" "/assignments" "/users/me")

for endpoint in "${endpoints[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$endpoint)
    if [ "$response" == "401" ]; then
        echo -e "${GREEN}✓${NC} $endpoint is protected (returns 401)"
    else
        echo -e "${RED}✗${NC} $endpoint returned $response (expected 401)"
    fi
done

echo ""
echo "================================================"
echo "Test Summary"
echo "================================================"

# Generate HTML report
echo "Generating test report..."
npx playwright show-report

echo ""
echo -e "${GREEN}Testing complete!${NC}"
echo ""
echo "📊 View detailed report: npx playwright show-report"
echo "🎭 Run tests interactively: npx playwright test --ui"
echo ""

# Clean up server if we started it
if [ ! -z "$SERVER_PID" ]; then
    echo "Stopping test servers..."
    kill $SERVER_PID
fi