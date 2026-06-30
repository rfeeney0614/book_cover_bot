---
name: Analytics - Basic Dashboard
about: Create Analytics Dashboard with Key Metrics
title: 'Analytics: Create Basic Dashboard with Key Metrics'
labels: enhancement, analytics, frontend, backend
assignees: ''
---

## Description
Implement a basic analytics dashboard that displays key metrics for the book cover management system.

## Requirements
- [ ] Display total counts for:
  - [ ] Books
  - [ ] Covers
  - [ ] Job Orders
  - [ ] Print Exports
- [ ] Show recent activity timeline
- [ ] Display status breakdown for print exports (completed vs. failed)
- [ ] Add date range filter for analytics data

## Technical Implementation
- Create new `AnalyticsController` in `bookbot-api/app/controllers/api/`
- Add analytics API routes in `config/routes.rb`
- Create React component for dashboard view in `bookbot-frontend/src/pages/`
- Use existing models to aggregate data
- Consider caching for performance

## API Endpoints
```
GET /api/analytics/dashboard
Response:
{
  "total_books": 100,
  "total_covers": 250,
  "total_job_orders": 1500,
  "total_print_exports": 75,
  "print_export_stats": {
    "completed": 65,
    "failed": 10
  },
  "recent_activity": [...]
}
```

## Acceptance Criteria
- [ ] Dashboard displays all required metrics
- [ ] Data updates when navigating to the page
- [ ] Date range filter works correctly
- [ ] Loading states are shown while fetching data
- [ ] Error states are handled gracefully
- [ ] Responsive design works on mobile devices

## Dependencies
None - This is the foundation for other analytics features

## Estimated Effort
Medium (3-5 days)
