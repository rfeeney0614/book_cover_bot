---
name: Analytics - Real-time Dashboard
about: Implement Real-time Updates for Analytics Dashboard
title: 'Analytics: Implement Real-time Updates for Analytics Dashboard'
labels: enhancement, analytics, real-time, frontend, backend
assignees: ''
---

## Description
Add real-time updates to the analytics dashboard using WebSockets or similar technology.

## Requirements
- [ ] Display live metrics as data changes
- [ ] Show real-time notification of new job orders
- [ ] Update print export status in real-time
- [ ] Display current system activity
- [ ] Add auto-refresh capabilities
- [ ] Show connection status indicator

## Technical Implementation
- Implement WebSocket connection using Action Cable (Rails)
- Broadcast analytics updates on data changes
- Update React components to handle real-time data
- Consider performance impact of real-time updates
- Add connection status indicator and reconnection logic

## Action Cable Setup (Rails)
```ruby
# app/channels/analytics_channel.rb
class AnalyticsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "analytics"
  end
  
  def unsubscribed
    stop_all_streams
  end
end

# Broadcast from models or controllers
ActionCable.server.broadcast("analytics", {
  event: "job_order_created",
  data: {...}
})
```

## Frontend Implementation (React)
```javascript
// Use ActionCable or websocket library
import { createConsumer } from "@rails/actioncable"

const cable = createConsumer("ws://localhost:3000/cable")

cable.subscriptions.create("AnalyticsChannel", {
  received(data) {
    // Update React state with new data
  }
})
```

## Events to Broadcast
- `job_order_created`: New job order
- `print_export_started`: Export started
- `print_export_completed`: Export finished
- `print_export_failed`: Export failed
- `book_created`: New book added
- `cover_created`: New cover added

## Real-time Metrics to Update
- Total counts (books, covers, job orders, print exports)
- Recent activity feed
- Print export status changes
- Job order volume charts (with throttling)

## Performance Considerations
- Throttle chart updates to avoid excessive re-renders
- Batch multiple updates together
- Use debouncing for rapid changes
- Only broadcast relevant changes
- Consider using Redis for pub/sub at scale

## UI Components
- Connection status indicator (connected/disconnected/reconnecting)
- Live activity feed with smooth animations
- Real-time counter updates with transitions
- "Live" badge to indicate real-time mode
- Option to pause real-time updates

## Acceptance Criteria
- [ ] WebSocket connection establishes successfully
- [ ] Real-time updates appear without manual refresh
- [ ] Connection status is clearly indicated
- [ ] Reconnection works after network issues
- [ ] Performance remains acceptable with frequent updates
- [ ] Option to enable/disable real-time mode works
- [ ] Works correctly with multiple browser tabs/users

## Fallback Strategy
- Implement auto-refresh as fallback if WebSockets fail
- Gracefully degrade to polling if needed
- Show appropriate message if real-time unavailable

## Testing Considerations
- Test with multiple concurrent connections
- Test reconnection after network interruption
- Test performance with high frequency updates
- Test browser compatibility

## Dependencies
- Issue #1 (Basic Dashboard) must be completed first
- Redis may be needed for scaling Action Cable

## Estimated Effort
Medium-Large (5-7 days)
