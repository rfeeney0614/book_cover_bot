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
import WarningIcon from '@mui/icons-material/Warning';
import ImageIcon from '@mui/icons-material/Image';
import BookIcon from '@mui/icons-material/Book';
import { fetchAttentionItems } from '../api/attention';

export default function AttentionIndex() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAttentionItems();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

      {!loading && items.length > 0 && (
        <>
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={`${items.length} item${items.length !== 1 ? 's' : ''} need attention`} 
              color="warning"
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item, index) => (
              <Card key={`${item.type}-${item.id}-${index}`}>
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
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
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
        </>
      )}
    </Container>
  );
}
