import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import WarningIcon from '@mui/icons-material/Warning';

export default function ExportModal({ isOpen, status, progressText, errorMessage, onClose }) {

  const getStatusMessage = () => {
    if (errorMessage) return errorMessage;
    if (progressText) return progressText;
    
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
  const isFailed = status === 'failed';

  return (
    <Dialog 
      open={isOpen} 
      onClose={isFailed ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        {isFailed && <WarningIcon color="error" sx={{ fontSize: 40, mb: 1 }} />}
        <Typography variant="h6" component="div">
          {isFailed ? 'Export Failed' : 'Exporting Print Queue'}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', py: 3 }}>
        {isProcessing && (
          <Box sx={{ mb: 2 }}>
            <CircularProgress />
          </Box>
        )}

        <Typography 
          variant="body1" 
          color={isFailed ? 'error' : 'text.secondary'}
          fontWeight={isFailed ? 'bold' : 'normal'}
        >
          {getStatusMessage()}
        </Typography>
      </DialogContent>

      {isFailed && (
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button 
            variant="contained"
            color="error"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
