---
name: Analytics - Book and Cover Usage Statistics
about: Track and Display Book Cover Usage Metrics
title: 'Analytics: Track and Display Book Cover Usage Metrics'
labels: enhancement, analytics, frontend, backend, optimization
assignees: ''
---

## Description
Add analytics to track which books and covers are most frequently used in job orders.

## Requirements
- [ ] Track number of job orders per cover
- [ ] Track total quantity printed per cover
- [ ] Display top 10 most popular books
- [ ] Display top 10 most popular covers
- [ ] Add sorting and filtering capabilities
- [ ] Show usage trends over time (daily/weekly/monthly)

## Technical Implementation
- Add analytics queries to retrieve aggregated data from `job_orders` joined with `covers` and `books`
- Create visualization components using a charting library (Chart.js or Recharts)
- Consider adding a `usage_count` counter cache to optimize queries
- Create new API endpoint: `GET /api/analytics/book_usage`
- Create new API endpoint: `GET /api/analytics/cover_usage`

## Database Optimization
Consider adding:
```ruby
# Migration to add counter cache
add_column :covers, :job_orders_count, :integer, default: 0
add_column :covers, :total_quantity_printed, :integer, default: 0
```

## API Endpoints
```
GET /api/analytics/book_usage?period=month&limit=10
Response:
{
  "popular_books": [
    {
      "id": 1,
      "title": "Book Title",
      "author": "Author Name",
      "job_order_count": 50,
      "total_quantity": 500
    },
    ...
  ],
  "trends": [...]
}

GET /api/analytics/cover_usage?book_id=1&period=week
Response:
{
  "popular_covers": [
    {
      "id": 1,
      "edition": "First Edition",
      "book_title": "Book Title",
      "job_order_count": 25,
      "total_quantity": 250
    },
    ...
  ]
}
```

## Acceptance Criteria
- [ ] Top 10 lists display correctly with accurate data
- [ ] Charts render properly and are interactive
- [ ] Filtering by date range works
- [ ] Sorting options work correctly
- [ ] Performance is acceptable with large datasets (consider pagination)
- [ ] Data is cached appropriately to avoid slow queries

## Dependencies
- Issue #1 (Basic Dashboard) should be completed first
- Charting library needs to be added to dependencies

## Estimated Effort
Large (5-7 days)
