'use client';

import { GetPreference } from '@/api/payment';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface PaymentFormProps {
  run: string;
  total: number;
  description: string;
}

export function PaymentFormMP({ run, total, description }: PaymentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading, isError, error } = GetPreference(run, total, description);

  useEffect(() => {
    initMercadoPago(
      process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || 
      'APP_USR-f945aa27-1a03-43d4-a9e1-0ef5aca022e0'
    );
  }, []);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'approved') {
      router.push('/pago/exitoso');
    } else if (status === 'pending') {
      router.push('/pago/pending');
    } else if (status === 'failure') {
      router.push('/pago/fallo');
    }
  }, [searchParams, router]);

  const handleRedirectToMercadoPago = async () => {
    if (data?.entity) {
      const mercadoPagoUrl = data.entity;   // `https://www.mercadopago.com/checkout/v1/redirect?preference_id=${data.entity}`;
      window.location.href = mercadoPagoUrl;
    }
  };

  if (!data?.entity && !isLoading && !isError) {
    return (
      <Box sx={{ padding: 4 }}>
        <Alert severity="warning">No se encontró una preferencia de pago válida.</Alert>
      </Box>
    );
  }

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            padding: 4,
          }}
        >
          <CircularProgress />
          <Typography>Cargando medio de pago...</Typography>
        </Box>
      )}

      {isError && (
        <Box sx={{ padding: 4 }}>
          <Alert severity="error">
            Error al cargar la preferencia de pago: {error instanceof Error ? error.message : 'Desconocido'}
          </Alert>
        </Box>
      )}

      {!isLoading && !isError && data?.entity && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
          }}
        >
          <Button variant="contained" color="primary" onClick={handleRedirectToMercadoPago}>
            Pagar con MercadoPago
          </Button>
        </Box>
      )}
    </>
  );
}
