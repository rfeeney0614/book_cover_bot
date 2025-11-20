import React from 'react';

export default function ExportModal({ isOpen, status, onClose }) {
  if (!isOpen) return null;

  const getStatusMessage = () => {
    switch (status) {
      case 'pending':
        return 'Starting export...';
      case 'processing':
        return 'Generating PDF...';
      case 'completed':
        return 'Export complete! Downloading...';
      case 'failed':
        return 'Export failed. Please try again.';
      default:
        return 'Processing...';
    }
  };

  const isProcessing = ['pending', 'processing'].includes(status);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: 32,
        borderRadius: 8,
        maxWidth: 400,
        width: '90%',
        textAlign: 'center'
      }}>
        <h2 style={{ marginTop: 0 }}>Exporting Print Queue</h2>
        
        {isProcessing && (
          <div style={{ margin: '24px 0' }}>
            <div style={{
              width: 40,
              height: 40,
              border: '4px solid #f0f0f0',
              borderTop: '4px solid #333',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        <p style={{ fontSize: 16, color: '#666' }}>
          {getStatusMessage()}
        </p>

        {status === 'failed' && (
          <button 
            onClick={onClose}
            style={{
              marginTop: 16,
              padding: '8px 24px',
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
