import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { fetchPrintQueue, incrementJobOrder, decrementJobOrder } from '../api/printQueue';
import { deleteJobOrder } from '../api/job_orders';
import { triggerExport, checkExportStatus, getDownloadUrl } from '../api/printExport';
import { uploadCoverImage } from '../api/covers';
import PrintQueueItem from '../components/PrintQueueItem';
import ExportModal from '../components/ExportModal';
import Modal from '../components/Modal';

export default function PrintQueueIndex() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);
  const [exportId, setExportId] = useState(null);
  const [progressText, setProgressText] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadQueue();
  }, []);

  useEffect(() => {
    if (!exportId || !exportStatus || exportStatus === 'completed' || exportStatus === 'failed') {
      return;
    }

    // Poll for export status
    const pollInterval = setInterval(async () => {
      try {
        const result = await checkExportStatus(exportId);
        setExportStatus(result.status);
        setProgressText(result.progress_text);
        setErrorMessage(result.error_message);

        if (result.status === 'completed') {
          // Download the file
          window.location.href = getDownloadUrl(exportId);
          setTimeout(() => {
            setExportStatus(null);
            setExportId(null);
            setProgressText(null);
            setErrorMessage(null);
          }, 2000);
        } else if (result.status === 'failed') {
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Error checking export status:', err);
        setExportStatus('failed');
        setErrorMessage('Unable to check export status');
        clearInterval(pollInterval);
      }
    }, 500);

    return () => clearInterval(pollInterval);
  }, [exportId, exportStatus]);

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

  const openDeleteModal = (item) => {
    setDeletingItem(item);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteJobOrder(deletingItem.job_order_id);
      setDeleteOpen(false);
      setDeletingItem(null);
      loadQueue();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteOpen(false);
    setDeletingItem(null);
  };

  const handleExport = async () => {
    try {
      setError(null);
      const result = await triggerExport();
      setExportId(result.id);
      setExportStatus(result.status || 'pending');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    setExportStatus(null);
    setExportId(null);
    setProgressText(null);
    setErrorMessage(null);
  };

  const handleImageUpload = async (coverId, file) => {
    try {
      // Optimistically update the queue with a preview URL
      const previewUrl = URL.createObjectURL(file);
      setQueue(prevQueue => 
        prevQueue.map(item => 
          item.id === coverId 
            ? { ...item, image_url: previewUrl, thumb_url: previewUrl, _uploading: true }
            : item
        )
      );

      // Upload the image
      const response = await uploadCoverImage(coverId, file);
      
      // Update with server URLs without full reload
      setQueue(prevQueue => 
        prevQueue.map(item => 
          item.id === coverId
            ? { 
                ...item, 
                image_url: response.image_url || previewUrl, 
                thumb_url: response.thumb_url || previewUrl,
                _uploading: false 
              }
            : item
        )
      );
      
      // Clean up the preview URL after a delay
      setTimeout(() => URL.revokeObjectURL(previewUrl), 1000);
    } catch (err) {
      // Revert optimistic update on error
      setQueue(prevQueue => 
        prevQueue.map(item => 
          item.id === coverId && item._uploading
            ? { ...item, image_url: null, thumb_url: null, _uploading: false }
            : item
        )
      );
      setError(err.message);
      throw err;
    }
  };

  // Sort queue: items with images first, then items without images
  const sortedQueue = [...queue].sort((a, b) => {
    const aHasImage = !!(a.image_url || a.thumb_url);
    const bHasImage = !!(b.image_url || b.thumb_url);
    if (aHasImage === bHasImage) return 0;
    return aHasImage ? -1 : 1;
  });

  // Calculate counts only for items with images
  const queueWithImages = queue.filter(item => item.image_url || item.thumb_url);
  const totalItems = queueWithImages.reduce((sum, item) => sum + item.print_quantity, 0);
  const coverCount = queueWithImages.length;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Print Queue
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {queue.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={`${coverCount} cover${coverCount !== 1 ? 's' : ''}`} />
              <Chip label={`${totalItems} total print${totalItems !== 1 ? 's' : ''}`} color="primary" />
            </Box>
          )}
          {queue.length > 0 && (
            <Button
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExport}
              disabled={!!exportStatus}
            >
              Export to PDF
            </Button>
          )}
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography>Loading print queue...</Typography>
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>Error: {error}</Alert>}
      
      {!loading && !error && queue.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography color="text.secondary">
            No covers in print queue
          </Typography>
        </Box>
      )}

      {!loading && queue.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {sortedQueue.map(item => (
            <PrintQueueItem 
              key={item.id} 
              item={item} 
              onQuantityChange={handleQuantityChange}
              onDelete={openDeleteModal}
              onImageUpload={handleImageUpload}
            />
          ))}
        </Box>
      )}

      <Modal open={deleteOpen} onClose={cancelDelete} title="Confirm delete" width={520}>
        {deletingItem ? (
          <Box>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to remove{' '}
              <strong>"{deletingItem.book_title || 'Unknown book'}"</strong>
              {deletingItem.edition && (
                <span> — Edition: <strong>{deletingItem.edition}</strong></span>
              )}
              {' '}from the print queue?
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button variant="contained" color="error" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Removing…' : 'Remove'}
              </Button>
              <Button variant="outlined" onClick={cancelDelete}>Cancel</Button>
            </Box>
          </Box>
        ) : (
          <Typography>Nothing selected.</Typography>
        )}
      </Modal>

      <ExportModal 
        isOpen={!!exportStatus}
        status={exportStatus}
        progressText={progressText}
        errorMessage={errorMessage}
        onClose={handleCloseModal}
      />
    </Container>
  );
}
