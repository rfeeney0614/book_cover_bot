import React, { useState, useEffect } from 'react';
import { fetchPrintQueue, incrementJobOrder, decrementJobOrder } from '../api/printQueue';
import PrintQueueItem from '../components/PrintQueueItem';

export default function PrintQueueIndex() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPrintQueue();
      setQueue(data.print_queue || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (jobOrderId, action) => {
    try {
      const result = action === 'increment' 
        ? await incrementJobOrder(jobOrderId)
        : await decrementJobOrder(jobOrderId);
      
      if (result.deleted) {
        // Item was removed, reload the queue
        loadQueue();
      }
      // No need to update state here - the component manages its own local quantity
    } catch (err) {
      setError(err.message);
      // Reload on error to ensure consistency
      loadQueue();
    }
  };

  const totalItems = queue.reduce((sum, item) => sum + item.print_quantity, 0);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Print Queue</h1>
        {queue.length > 0 && (
          <div style={{ fontSize: 16, color: '#666' }}>
            {queue.length} cover{queue.length !== 1 ? 's' : ''} • {totalItems} total print{totalItems !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {loading && <div>Loading print queue...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      
      {!loading && !error && queue.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
          <p>No covers in print queue</p>
        </div>
      )}

      {!loading && queue.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {queue.map(item => (
            <PrintQueueItem 
              key={item.id} 
              item={item} 
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
