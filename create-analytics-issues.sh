#!/bin/bash
# Script to create all analytics issues in GitHub
# Usage: ./create-analytics-issues.sh

set -e

echo "Creating Analytics Issues for Book Cover Bot..."
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "Error: Not authenticated with GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

# Change to script directory
cd "$(dirname "$0")"

# Issue 1
echo "Creating Issue 1: Basic Dashboard Analytics..."
gh issue create \
  --title "Analytics: Create Basic Dashboard with Key Metrics" \
  --body-file .github/ISSUE_TEMPLATES/analytics-01-basic-dashboard.md \
  --label "enhancement,analytics,frontend,backend"

# Issue 2
echo "Creating Issue 2: Book and Cover Usage Statistics..."
gh issue create \
  --title "Analytics: Track and Display Book Cover Usage Metrics" \
  --body-file .github/ISSUE_TEMPLATES/analytics-02-book-cover-usage.md \
  --label "enhancement,analytics,frontend,backend,optimization"

# Issue 3
echo "Creating Issue 3: Format Popularity Analysis..."
gh issue create \
  --title "Analytics: Add Format Usage and Popularity Analytics" \
  --body-file .github/ISSUE_TEMPLATES/analytics-03-format-popularity.md \
  --label "enhancement,analytics,backend"

# Issue 4
echo "Creating Issue 4: Print Export Performance Metrics..."
gh issue create \
  --title "Analytics: Track Print Export Success Rate and Performance" \
  --body-file .github/ISSUE_TEMPLATES/analytics-04-print-export-metrics.md \
  --label "enhancement,analytics,monitoring,backend"

# Issue 5
echo "Creating Issue 5: Job Order Analytics and Reporting..."
gh issue create \
  --title "Analytics: Create Comprehensive Job Order Analytics and Reporting" \
  --body-file .github/ISSUE_TEMPLATES/analytics-05-job-order-analytics.md \
  --label "enhancement,analytics,reporting,backend"

# Issue 6
echo "Creating Issue 6: User Activity and Audit Trail..."
gh issue create \
  --title "Analytics: Implement User Activity Tracking and Audit Trail" \
  --body-file .github/ISSUE_TEMPLATES/analytics-06-audit-trail.md \
  --label "enhancement,analytics,security,compliance"

# Issue 7
echo "Creating Issue 7: Analytics API and Data Export..."
gh issue create \
  --title "Analytics: Create Comprehensive Analytics API and Data Export" \
  --body-file .github/ISSUE_TEMPLATES/analytics-07-api-export.md \
  --label "enhancement,analytics,api,backend"

# Issue 8
echo "Creating Issue 8: Real-time Dashboard..."
gh issue create \
  --title "Analytics: Implement Real-time Updates for Analytics Dashboard" \
  --body-file .github/ISSUE_TEMPLATES/analytics-08-real-time-dashboard.md \
  --label "enhancement,analytics,real-time,frontend,backend"

# Issue 9
echo "Creating Issue 9: Custom Report Builder..."
gh issue create \
  --title "Analytics: Add Custom Report Builder with Advanced Filtering" \
  --body-file .github/ISSUE_TEMPLATES/analytics-09-custom-reports.md \
  --label "enhancement,analytics,reporting,frontend,backend"

# Issue 10
echo "Creating Issue 10: Performance Optimization..."
gh issue create \
  --title "Analytics: Optimize Database Queries and Add Caching" \
  --body-file .github/ISSUE_TEMPLATES/analytics-10-performance-optimization.md \
  --label "enhancement,analytics,performance,optimization,backend"

echo ""
echo "✓ All 10 analytics issues created successfully!"
echo ""
echo "View issues at: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/issues"
