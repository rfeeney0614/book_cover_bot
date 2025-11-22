---
name: Analytics - Print Export Performance Metrics
about: Implement Print Export Success Rate and Performance Tracking
title: 'Analytics: Track Print Export Success Rate and Performance'
labels: enhancement, analytics, monitoring, backend
assignees: ''
---

## Description
Add analytics to monitor print export performance, success rates, and identify issues.

## Requirements
- [ ] Track print export success vs. failure rate
- [ ] Display average export completion time
- [ ] Show error frequency and types
- [ ] Identify patterns in failed exports
- [ ] Display export volume over time
- [ ] Add alerts for unusual failure rates

## Technical Implementation
- Add timestamp tracking for export duration
  - Migration to add `started_at` timestamp to `print_exports`
  - Calculate duration as `finished_at - started_at`
- Parse and categorize error messages
- Create performance metrics API endpoint
- Consider adding monitoring/alerting system
- Store historical metrics for trend analysis

## Database Changes
```ruby
# Migration
add_column :print_exports, :started_at, :datetime
add_column :print_exports, :status, :string, default: 'pending'
add_index :print_exports, :status
add_index :print_exports, :created_at
```

## API Endpoints
```
GET /api/analytics/print_export_performance?period=week
Response:
{
  "summary": {
    "total_exports": 100,
    "successful": 85,
    "failed": 15,
    "success_rate": 85.0,
    "average_duration_seconds": 45.5,
    "total_jobs_processed": 1250
  },
  "error_breakdown": [
    {
      "error_type": "PDF Generation Failed",
      "count": 10,
      "percentage": 66.7
    },
    ...
  ],
  "daily_stats": [
    {
      "date": "2025-11-22",
      "total": 15,
      "successful": 12,
      "failed": 3,
      "avg_duration": 42.3
    },
    ...
  ]
}
```

## Visualizations
- Success rate gauge chart
- Export volume over time (line chart)
- Error type distribution (pie chart)
- Average duration trend (line chart)

## Acceptance Criteria
- [ ] Success rate calculates correctly
- [ ] Duration tracking works for all exports
- [ ] Error messages are parsed and categorized
- [ ] Historical data is preserved
- [ ] Charts display performance metrics accurately
- [ ] Alert thresholds can be configured (bonus)

## Dependencies
- None - Can be implemented independently

## Estimated Effort
Medium (4-5 days)
