import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCover, updateCover, deleteCover } from '../api/covers';
import CoverForm from '../components/CoverForm';

export default function CoverShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchCover(id)
      .then((data) => { if (mounted) setCover(data); })
      .catch((e) => setError(e.message || String(e)))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  const handleUpdate = async (payload) => {
    setError(null);
    try {
      const updated = await updateCover(id, payload);
      setCover(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this cover?')) return;
    try {
      await deleteCover(id);
      navigate('/covers');
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  if (loading) return (
    <Container maxWidth="md" sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Container>
  );
  
  if (error) return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Alert severity="error">Error: {error}</Alert>
    </Container>
  );
  
  if (!cover) return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Alert severity="warning">Cover not found.</Alert>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          {cover.title || 'Untitled Cover'}
        </Typography>
      </Box>

      {!editing ? (
        <Card>
          <CardContent>
            {cover.image_url && (
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <img 
                  src={cover.image_url || cover.thumb_url} 
                  alt={cover.title || 'Cover'} 
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              </Box>
            )}
            
            <Typography variant="body1" gutterBottom>
              <strong>Book ID:</strong> {cover.book_id}
            </Typography>
            
            {cover.edition && (
              <Typography variant="body1" gutterBottom>
                <strong>Edition:</strong> {cover.edition}
              </Typography>
            )}
            
            {cover.format_id && (
              <Typography variant="body1" gutterBottom>
                <strong>Format ID:</strong> {cover.format_id}
              </Typography>
            )}
            
            {cover.construction_model && (
              <Typography variant="body1" gutterBottom>
                <strong>Construction Model:</strong> {cover.construction_model}
              </Typography>
            )}
            
            {cover.note && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Note:</strong>
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                  {cover.note}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <CoverForm 
              initial={cover} 
              onCancel={() => setEditing(false)} 
              onSubmit={handleUpdate} 
            />
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
