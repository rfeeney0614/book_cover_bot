---
name: Analytics - Format Popularity Analysis
about: Add Analytics for Format Usage and Trends
title: 'Analytics: Add Format Usage and Popularity Analytics'
labels: enhancement, analytics, backend
assignees: ''
---

## Description
Implement analytics to understand which formats are most popular and track format usage over time.

## Requirements
- [ ] Display usage statistics per format
- [ ] Show which formats are used most frequently
- [ ] Track format selection trends over time
- [ ] Identify underutilized formats
- [ ] Display average job order quantities by format
- [ ] Show format distribution pie chart

## Technical Implementation
- Query `covers` and `job_orders` grouped by `format_id`
- Create format analytics API endpoint
- Add visualization for format distribution (pie/bar chart)
- Consider adding insights/recommendations based on usage patterns
- Join with `formats` table to get format names and dimensions

## API Endpoints
```
GET /api/analytics/format_usage?period=month
Response:
{
  "format_stats": [
    {
      "id": 1,
      "name": "Standard",
      "height": 9.0,
      "cover_count": 150,
      "job_order_count": 450,
      "total_quantity": 4500,
      "average_quantity_per_order": 10,
      "percentage_of_total": 45.5
    },
    ...
  ],
  "trends": [
    {
      "date": "2025-11-01",
      "format_id": 1,
      "count": 50
    },
    ...
  ],
  "underutilized_formats": [...]
}
```

## Visualizations
- Pie chart showing format distribution by usage
- Bar chart showing format trends over time
- Table listing all formats with statistics

## Acceptance Criteria
- [ ] All format statistics calculate correctly
- [ ] Charts display format data accurately
- [ ] Trends show changes over time
- [ ] Underutilized formats are identified with reasonable threshold
- [ ] Default formats are clearly indicated
- [ ] Handles case where format is NULL on covers

## Dependencies
- Issue #1 (Basic Dashboard) recommended but not required

## Estimated Effort
Small (2-3 days)
