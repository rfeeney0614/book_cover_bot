---
name: Analytics - Performance Optimization
about: Optimize Database Queries and Add Caching for Analytics
title: 'Analytics: Optimize Database Queries and Add Caching'
labels: enhancement, analytics, performance, optimization, backend
assignees: ''
---

## Description
Improve performance of analytics queries through optimization and caching strategies.

## Requirements
- [ ] Identify slow analytics queries
- [ ] Add appropriate database indexes
- [ ] Implement query result caching
- [ ] Create materialized views for complex aggregations
- [ ] Add database query monitoring
- [ ] Set up query performance benchmarks

## Technical Implementation
- Use Rails query profiling tools (Bullet, Rack Mini Profiler)
- Implement Redis caching for analytics data
- Consider creating summary tables for complex metrics
- Add database indexes based on query patterns
- Monitor query performance in production
- Document optimization decisions

## Performance Profiling Tools
```ruby
# Gemfile
gem 'bullet', group: :development
gem 'rack-mini-profiler', group: :development
gem 'memory_profiler', group: :development
```

## Database Indexes to Consider
```ruby
# Migration: Add indexes for common analytics queries
class AddAnalyticsIndexes < ActiveRecord::Migration[8.0]
  def change
    # Job orders by date
    add_index :job_orders, :created_at
    add_index :job_orders, [:cover_id, :created_at]
    
    # Print exports by status and date
    add_index :print_exports, [:finished, :created_at]
    
    # Covers by book and format
    add_index :covers, [:book_id, :format_id]
    
    # Books for full-text search (if needed)
    add_index :books, :title, using: :gin, opclass: :gin_trgm_ops
    add_index :books, :author, using: :gin, opclass: :gin_trgm_ops
  end
end
```

## Caching Strategy
**Redis Cache Implementation**
```ruby
# config/environments/production.rb
config.cache_store = :redis_cache_store, {
  url: ENV['REDIS_URL'],
  expires_in: 5.minutes
}

# Example usage in controller
def analytics_summary
  Rails.cache.fetch(
    "analytics/summary/#{Date.current}", 
    expires_in: 5.minutes
  ) do
    {
      total_books: Book.count,
      total_covers: Cover.count,
      total_job_orders: JobOrder.count,
      # ... more metrics
    }
  end
end
```

## Summary Tables (Materialized Views)
```ruby
# Create a summary table updated periodically
create_table :daily_analytics_summaries do |t|
  t.date :summary_date, null: false, index: { unique: true }
  t.integer :job_orders_count
  t.integer :total_quantity
  t.integer :print_exports_count
  t.integer :successful_exports_count
  t.json :popular_books # Top 10 as JSON
  t.json :popular_formats # Distribution as JSON
  t.timestamps
end

# Background job to update daily
class UpdateAnalyticsSummaryJob < ApplicationJob
  def perform(date = Date.yesterday)
    summary = DailyAnalyticsSummary.find_or_initialize_by(summary_date: date)
    summary.update(
      job_orders_count: JobOrder.where(created_at: date.all_day).count,
      total_quantity: JobOrder.where(created_at: date.all_day).sum(:quantity),
      # ... more aggregations
    )
  end
end
```

## Query Optimization Techniques
1. **Use `select` to limit columns**
   ```ruby
   Book.select(:id, :title, :author)
   ```

2. **Use `includes` to avoid N+1 queries**
   ```ruby
   JobOrder.includes(cover: :book)
   ```

3. **Use `pluck` for simple data**
   ```ruby
   Book.pluck(:id, :title)
   ```

4. **Use database aggregation**
   ```ruby
   JobOrder.group(:cover_id).sum(:quantity)
   ```

5. **Use counter caches**
   ```ruby
   add_column :books, :covers_count, :integer, default: 0
   ```

## Performance Benchmarks
Create benchmarks for key analytics queries:
```ruby
# test/performance/analytics_performance_test.rb
class AnalyticsPerformanceTest < ActionDispatch::PerformanceTest
  test "dashboard summary query performance" do
    assert_performance_under(100, 0.5) do # 100ms, 0.5s
      AnalyticsController.new.dashboard_summary
    end
  end
end
```

## Monitoring Setup
**Production Monitoring**
- Set up APM (Application Performance Monitoring)
- Monitor slow query log
- Track cache hit rates
- Monitor memory usage

**Alerts**
- Query time > 1 second
- Cache hit rate < 80%
- Database connection pool saturation

## Documentation
Create performance documentation:
```markdown
# Analytics Performance Guide

## Cached Queries
- Dashboard summary: 5 min cache
- Book usage stats: 15 min cache
- Format distribution: 30 min cache

## Indexes
- job_orders(created_at): For date range queries
- job_orders(cover_id, created_at): For cover-specific analytics

## Summary Tables
- daily_analytics_summaries: Updated by job at 1 AM daily
- Provides fast access to historical data
```

## Acceptance Criteria
- [ ] All analytics queries complete in < 500ms (p95)
- [ ] Dashboard loads in < 1 second
- [ ] Cache hit rate > 80%
- [ ] No N+1 queries in analytics endpoints
- [ ] Database indexes are documented
- [ ] Performance benchmarks are in place
- [ ] Monitoring alerts are configured
- [ ] Performance documentation is complete

## Testing
- [ ] Load testing with large datasets (10k+ records)
- [ ] Benchmark before and after optimization
- [ ] Test cache invalidation strategies
- [ ] Verify index usage with `EXPLAIN ANALYZE`

## Dependencies
- Redis for caching
- Other analytics issues for query patterns

## Estimated Effort
Medium (4-6 days)
