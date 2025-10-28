'use client';

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from 'next/navigation';

export default function PaymentFailurePage() {
  const router = useRouter();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Alert severity="error">
        Tu pago no se pudo procesar. Intenta nuevamente o usa otro método de pago.
      </Alert>
      <Button variant="contained" color="primary" onClick={() => router.push('/')}>
        Volver al inicio
      </Button>
    </Box>
  );
}
