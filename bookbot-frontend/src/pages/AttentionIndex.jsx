import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import WarningIcon from '@mui/icons-material/Warning';
import ImageIcon from '@mui/icons-material/Image';
import BookIcon from '@mui/icons-material/Book';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchAttentionItems } from '../api/attention';
import { uploadCoverImage, deleteCover } from '../api/covers';
import { deleteBook } from '../api/books';

export default function AttentionIndex() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredCount, setFilteredCount] = useState(0);
  const [totalAllCount, setTotalAllCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingCoverId, setUploadingCoverId] = useState(null);
  const [draggingCoverId, setDraggingCoverId] = useState(null);
  const perPage = 20;

  useEffect(() => {
    loadItems();
  }, [page, selectedFilter]);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAttentionItems(page, perPage, selectedFilter);
      setItems(data.items || []);
      setTotalPages(data.total_pages || 1);
      setFilteredCount(data.count || 0);
      setTotalAllCount(data.total_count || 0);
      setCategoryCounts(data.category_counts || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (filterType) => {
    setSelectedFilter(filterType);
    setPage(1); // Reset to first page when filter changes
  };

  const handleImageUpload = async (coverId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadingCoverId(coverId);
    try {
      await uploadCoverImage(coverId, file);
      // Reload the current page
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingCoverId(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e, coverId) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCoverId(coverId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only clear if we're leaving the card entirely
    if (e.currentTarget === e.target) {
      setDraggingCoverId(null);
    }
  };

  const handleDrop = async (e, coverId) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCoverId(null);
    
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    setUploadingCoverId(coverId);
    try {
      await uploadCoverImage(coverId, file);
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingCoverId(null);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      if (itemToDelete.type === 'cover_missing_image') {
        await deleteCover(itemToDelete.cover_id);
      } else if (itemToDelete.type === 'book_missing_covers') {
        await deleteBook(itemToDelete.book_id);
      }
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      // Reload the current page
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // All items are already filtered by the API, no need to filter again
  const filteredItems = items;

  // Define category labels
  const categoryLabels = {
    'cover_missing_image': 'Missing Images',
    'book_missing_covers': 'Missing Covers',
  };

  const getIcon = (type) => {
    switch (type) {
      case 'cover_missing_image':
        return <ImageIcon sx={{ fontSize: 40, color: 'warning.main' }} />;
      case 'book_missing_covers':
        return <BookIcon sx={{ fontSize: 40, color: 'warning.main' }} />;
      default:
        return <WarningIcon sx={{ fontSize: 40, color: 'warning.main' }} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <WarningIcon sx={{ fontSize: 40, color: 'warning.main' }} />
        <Typography variant="h4" component="h1">
          Items Needing Attention
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography>Loading attention items...</Typography>
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>Error: {error}</Alert>}

      {!loading && items.length === 0 && (
        <Alert severity="success">
          No items need attention! Everything looks good.
        </Alert>
      )}

      {!loading && totalAllCount > 0 && (
        <>
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={`All (${totalAllCount})`}
              color={selectedFilter === 'all' ? 'primary' : 'default'}
              onClick={() => handleFilterChange('all')}
              sx={{ cursor: 'pointer' }}
            />
            {Object.entries(categoryCounts).map(([type, count]) => (
              <Chip 
                key={type}
                label={`${categoryLabels[type] || type} (${count})`}
                color={selectedFilter === type ? 'primary' : 'default'}
                onClick={() => handleFilterChange(type)}
                icon={getIcon(type)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredItems.map((item, index) => (
              <Card 
                key={`${item.type}-${item.id}-${index}`}
                onDragOver={item.type === 'cover_missing_image' ? handleDragOver : undefined}
                onDragEnter={item.type === 'cover_missing_image' ? (e) => handleDragEnter(e, item.cover_id) : undefined}
                onDragLeave={item.type === 'cover_missing_image' ? handleDragLeave : undefined}
                onDrop={item.type === 'cover_missing_image' ? (e) => handleDrop(e, item.cover_id) : undefined}
                sx={{
                  position: 'relative',
                  border: draggingCoverId === item.cover_id ? '3px dashed' : undefined,
                  borderColor: draggingCoverId === item.cover_id ? 'primary.main' : undefined,
                  bgcolor: draggingCoverId === item.cover_id ? 'action.hover' : undefined,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ flexShrink: 0 }}>
                      {getIcon(item.type)}
                    </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {item.description}
                    </Typography>
                    {item.type === 'cover_missing_image' && item.construction_model && (
                      <Typography variant="body2" color="primary" fontWeight="medium" sx={{ mt: 1 }}>
                        Model: {item.construction_model}
                      </Typography>
                    )}
                  </Box>
                  </Box>
                  {draggingCoverId === item.cover_id && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                        pointerEvents: 'none',
                      }}
                    >
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  {item.type === 'cover_missing_image' && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(item.cover_id, e)}
                        style={{ display: 'none' }}
                        id={`upload-${item.cover_id}`}
                        disabled={uploadingCoverId === item.cover_id}
                      />
                      <Button 
                        component="label"
                        htmlFor={`upload-${item.cover_id}`}
                        variant="contained"
                        color="primary"
                        startIcon={uploadingCoverId === item.cover_id ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                        disabled={uploadingCoverId === item.cover_id}
                      >
                        {uploadingCoverId === item.cover_id ? 'Uploading...' : 'Upload Image'}
                      </Button>
                      <Button 
                        component={Link}
                        to={`/books/${item.book_id}`}
                        variant="outlined"
                        color="primary"
                        startIcon={<MenuBookIcon />}
                      >
                        View Book
                      </Button>
                      <Button 
                        onClick={() => handleDeleteClick(item)}
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                      >
                        Delete Cover
                      </Button>
                    </>
                  )}
                  {item.type === 'book_missing_covers' && (
                    <Button 
                      onClick={() => handleDeleteClick(item)}
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Delete Book
                    </Button>
                  )}
                  <Button 
                    component={Link} 
                    to={item.link}
                    variant="outlined"
                    color="primary"
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        TransitionProps={{ timeout: 0 }}
      >
        <DialogTitle>
          {itemToDelete?.type === 'book_missing_covers' ? 'Delete Book?' : 'Delete Cover?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {itemToDelete?.type === 'book_missing_covers' 
              ? 'Are you sure you want to delete this book and all its covers? This action cannot be undone.'
              : 'Are you sure you want to delete this cover? This action cannot be undone.'}
          </DialogContentText>
          {itemToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>{itemToDelete.description}</strong>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
