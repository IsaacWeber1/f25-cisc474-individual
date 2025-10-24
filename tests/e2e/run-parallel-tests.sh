#!/bin/bash

# Parallel Test Runner with Sharding
# Optimized for maximum speed with increased Supabase connection pool

echo "🚀 Running Authentication Tests in Parallel Mode"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detect number of CPU cores
CORES=$(sysctl -n hw.ncpu 2>/dev/null || nproc 2>/dev/null || echo 4)
echo -e "${BLUE}ℹ️  Detected $CORES CPU cores${NC}"

# Calculate optimal shard count (using 80% of cores)
SHARDS=$((CORES * 8 / 10))
if [ $SHARDS -lt 2 ]; then
    SHARDS=2
fi

echo -e "${GREEN}✨ Running tests with $SHARDS parallel shards${NC}"
echo ""

# Clear previous test results
rm -rf test-results playwright-report 2>/dev/null

# Start timer
START_TIME=$(date +%s)

# Run tests in parallel shards
echo "Starting parallel test execution..."
echo "-----------------------------------"

# Method 1: Using Playwright's built-in sharding
if [ "$1" = "shard" ]; then
    echo "Using Playwright sharding strategy..."

    # Run shards in background
    for i in $(seq 1 $SHARDS); do
        echo -e "${YELLOW}▶ Starting shard $i/$SHARDS${NC}"
        npx playwright test --shard=$i/$SHARDS &
    done

    # Wait for all shards to complete
    wait

else
    # Method 2: Direct parallel execution with optimized config
    echo "Using optimized parallel configuration..."
    npx playwright test tests/e2e/auth --workers=$CORES
fi

# End timer
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "================================================"
echo -e "${GREEN}✅ Tests completed in $DURATION seconds${NC}"
echo ""

# Generate summary
echo "Test Summary:"
echo "-------------"

# Count results
if [ -d "test-results" ]; then
    FAILED=$(find test-results -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
    echo "❌ Failed screenshots: $FAILED"
fi

# Show report location
echo ""
echo "📊 View detailed report: npx playwright show-report"
echo ""

# Optional: Auto-open report
if [ "$2" = "report" ]; then
    npx playwright show-report
fi