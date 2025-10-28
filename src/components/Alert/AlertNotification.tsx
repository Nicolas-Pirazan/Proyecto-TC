import { Alert, Snackbar } from '@mui/material';
import React from 'react';

type AlertProps = {
  isOpen: boolean;
  onClose: () => void;
  autoHideDuration?: number;
  severity: 'error' | 'info' | 'success' | 'warning';
  message: string;
};

const AlertNotification = ({ isOpen, onClose, message, severity, autoHideDuration }: AlertProps) => {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHideDuration ? autoHideDuration : 5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertNotification;
