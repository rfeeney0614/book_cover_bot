---
name: Analytics - User Activity and Audit Trail
about: Implement User Activity Tracking and Audit Trail
title: 'Analytics: Implement User Activity Tracking and Audit Trail'
labels: enhancement, analytics, security, compliance
assignees: ''
---

## Description
Add analytics to track user actions and maintain an audit trail for compliance and usage analysis.

## Requirements
- [ ] Track create/update/delete operations on all resources
- [ ] Display activity timeline
- [ ] Show recent changes across the system
- [ ] Implement search and filter for audit logs
- [ ] Add export capability for audit reports

## Technical Implementation
- Consider using a gem like `paper_trail` or `audited` for Rails
- Create audit log viewer in frontend
- Add indexes for efficient querying of audit data
- Consider data retention policies for audit logs
- Ensure sensitive data is handled appropriately

## Gem Options
**Paper Trail** (Recommended)
```ruby
gem 'paper_trail'
```
- Tracks changes to models
- Stores versions in separate table
- Easy to query who changed what and when

**Audited**
```ruby
gem 'audited'
```
- Alternative to Paper Trail
- Similar functionality

## Database Schema
```ruby
# Paper Trail creates:
create_table :versions do |t|
  t.string   :item_type, null: false
  t.integer  :item_id,   null: false
  t.string   :event,     null: false
  t.string   :whodunnit
  t.text     :object
  t.text     :object_changes
  t.datetime :created_at
end
```

## API Endpoints
```
GET /api/analytics/activity?limit=50&resource_type=Book
Response:
{
  "activities": [
    {
      "id": 1,
      "action": "create",
      "resource_type": "Book",
      "resource_id": 1,
      "changes": {
        "title": [null, "New Book"],
        "author": [null, "John Doe"]
      },
      "timestamp": "2025-11-22T10:30:00Z",
      "user": "system"
    },
    ...
  ],
  "total": 1500
}

GET /api/analytics/activity/export?format=csv&from=2025-11-01&to=2025-11-30
Response: CSV file download
```

## UI Components
- Activity timeline/feed showing recent changes
- Filter panel (by resource type, action, date range)
- Detail view for individual changes
- Export functionality

## Models to Track
- [ ] Book
- [ ] Cover
- [ ] Format
- [ ] JobOrder
- [ ] PrintExport

## Acceptance Criteria
- [ ] All CRUD operations are logged
- [ ] Activity timeline displays correctly
- [ ] Search and filter work as expected
- [ ] Changes show old and new values
- [ ] Export generates valid audit reports
- [ ] Performance is acceptable with large audit logs
- [ ] Data retention policy is documented

## Security Considerations
- Don't log sensitive data (if any)
- Ensure audit logs cannot be modified
- Consider separate database/schema for audit data
- Implement appropriate access controls

## Dependencies
- None - Can be implemented independently
- User authentication system (if not yet implemented)

## Estimated Effort
Medium (4-6 days)
