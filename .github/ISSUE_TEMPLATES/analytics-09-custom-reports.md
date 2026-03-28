---
name: Analytics - Custom Report Builder
about: Add Custom Report Builder with Advanced Filtering
title: 'Analytics: Add Custom Report Builder with Advanced Filtering'
labels: enhancement, analytics, reporting, frontend, backend
assignees: ''
---

## Description
Create a flexible report builder that allows users to create custom analytics reports.

## Requirements
- [ ] Add report builder interface
- [ ] Support custom date ranges
- [ ] Allow filtering by multiple criteria (book, format, status, etc.)
- [ ] Enable saving of custom report configurations
- [ ] Support scheduled report generation
- [ ] Add sharing capabilities for reports

## Technical Implementation
- Design flexible query builder system
- Store report configurations in database
- Implement background job for scheduled reports (Solid Queue)
- Add email notifications for scheduled reports (Action Mailer)
- Create intuitive UI for report building

## Database Schema
```ruby
create_table :report_templates do |t|
  t.string :name, null: false
  t.text :description
  t.string :report_type # 'books', 'covers', 'job_orders', etc.
  t.json :filters # Store filter configuration
  t.json :columns # Which columns to include
  t.string :schedule # Cron expression for scheduled reports
  t.boolean :active, default: true
  t.timestamps
end

create_table :report_executions do |t|
  t.references :report_template
  t.datetime :executed_at
  t.string :status # 'pending', 'running', 'completed', 'failed'
  t.text :error_message
  t.string :file_path # Path to generated report
  t.integer :record_count
  t.timestamps
end
```

## Report Builder UI Components
**Filter Builder**
- Date range picker
- Multi-select for books, formats, etc.
- Status filters
- Quantity range filters
- Custom field filters

**Column Selector**
- Checkboxes for available columns
- Drag and drop to reorder columns
- Preview of selected columns

**Schedule Options**
- One-time report
- Daily/Weekly/Monthly schedule
- Specific day/time selection
- Email recipients

## API Endpoints
```
POST /api/reports/templates
GET /api/reports/templates
GET /api/reports/templates/:id
PUT /api/reports/templates/:id
DELETE /api/reports/templates/:id

POST /api/reports/execute/:id
GET /api/reports/executions
GET /api/reports/executions/:id/download
```

## Report Types
1. **Book Summary Report**
   - Books with cover counts
   - Job order totals
   - Most/least popular books

2. **Job Order Detail Report**
   - All job orders in date range
   - Book and cover details
   - Quantities and formats

3. **Print Export Summary Report**
   - Export success rates
   - Performance metrics
   - Error analysis

4. **Format Analysis Report**
   - Format usage statistics
   - Trends over time
   - Recommendations

5. **Custom Query Report**
   - User-defined columns
   - User-defined filters
   - Flexible output

## Background Job Implementation
```ruby
class GenerateReportJob < ApplicationJob
  queue_as :reports
  
  def perform(report_template_id, options = {})
    template = ReportTemplate.find(report_template_id)
    execution = ReportExecution.create(
      report_template: template,
      status: 'running'
    )
    
    # Generate report
    data = fetch_report_data(template)
    file_path = generate_file(data, template)
    
    execution.update(
      status: 'completed',
      file_path: file_path,
      record_count: data.size
    )
    
    # Send email if configured
    ReportMailer.report_ready(execution).deliver_later if template.email_enabled?
  rescue => e
    execution.update(status: 'failed', error_message: e.message)
  end
end
```

## Scheduled Reports
- Use Solid Queue recurring tasks
- Store cron schedule in report template
- Execute via background job
- Email results to recipients

## Report Output Formats
- CSV (primary)
- Excel (using `caxlsx`)
- PDF (using `prawn`)
- JSON (for API access)

## Acceptance Criteria
- [ ] Report builder UI is intuitive and easy to use
- [ ] Filters work correctly and combine properly (AND/OR logic)
- [ ] Report templates save and load correctly
- [ ] One-time report generation works
- [ ] Scheduled reports execute on time
- [ ] Email notifications are sent with reports
- [ ] Report files are accessible for download
- [ ] Large reports generate without timeout
- [ ] Old report files are cleaned up (retention policy)

## Advanced Features (Future)
- Report template sharing between users
- Public/private report templates
- Report template marketplace
- Visual query builder with drag-and-drop
- Chart/visualization options
- Dashboard widgets from reports

## Dependencies
- Issue #7 (Analytics API) recommended for data access
- Background job system (Solid Queue already in place)
- Email system configuration

## Estimated Effort
Large (8-10 days)
