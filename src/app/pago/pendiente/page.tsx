'use client';

import { Alert, Button, Grid, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

const PaymentPendingPage = () => {
    const router = useRouter();
  
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, textAlign: 'center' }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Tu pago está pendiente de confirmación. Te notificaremos cuando se procese.
            </Alert>
            <Button variant="contained" color="primary" onClick={() => router.push('/')} sx={{ textTransform: 'capitalize' }}>
              Volver al inicio
            </Button>
          </Paper>
        </Grid>
      </Grid>
    );
  };
  
  export default PaymentPendingPage;