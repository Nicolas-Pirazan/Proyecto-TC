'use client';

import { Alert, Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Pagina de Exito
const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paymentId = searchParams.get('payment_id');
  const preferenceId = searchParams.get('preference_id');

  useEffect(() => {
    const updateUserPayment = async () => {
      if (!paymentId || !preferenceId) {
        setError('Información de pago incompleta.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Payment/success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, preferenceId }),
        });

        if (!response.ok) throw new Error('Error al actualizar el estado del pago.');
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error inesperado.');
        setLoading(false);
      }
    };

    updateUserPayment();
  }, [paymentId, preferenceId]);

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="h6" mt={2}>Procesando su pago...</Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            <Button variant="contained" color="primary" onClick={() => router.push('/')} sx={{ textTransform: 'capitalize' }}>
              Volver al inicio
            </Button>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 2 }}>¡Pago realizado con éxito!</Alert>
          <Button variant="contained" color="primary" onClick={() => router.push('/')} sx={{ textTransform: 'capitalize' }}>
            Volver al inicio
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PaymentSuccessPage;