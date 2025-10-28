'use client';

import { useGetFileUrl, useUploadFile } from '@/api/fileManagment';
import AlertNotification from '@/components/Alert/AlertNotification';
import Spinner from '@/components/Spinner';
import { UploadMenuForm } from '@/components/uploadMenu/UploadMenuForm';
import { Box, Container, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const UploadPDFPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const { mutate } = useUploadFile();
  const { data: fileUrlResponse, isSuccess: isFileUrlSuccess } = useGetFileUrl('contrato_de_inscripcion.pdf');

  useEffect(() => {
    if (fileUrlResponse && isFileUrlSuccess) {
      setFileUrl(fileUrlResponse.entity);
    }
  }, [fileUrlResponse, isFileUrlSuccess]);

  const uploadPDF = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await mutate(formData, {
        onSuccess: (response: { entity: string }) => {
          setFileUrl(response.entity); // Actualiza la URL del archivo subido
          setIsSuccess(true);
          setIsError(false);
        },
        onError: () => {
          setIsSuccess(false);
          setIsError(true);
        },
        onSettled: () => {
          setIsLoading(false);
          setShowAlert(true);
        },
      });
    } catch (error) {
      setIsSuccess(false);
      setIsError(true);
      setIsLoading(false);
      setShowAlert(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Paper sx={{ padding: 4, borderRadius: 2 }} variant="outlined">
        <Typography textAlign="center" variant="h5" color="primary" fontWeight={600} mb={4}>
          Subir y Visualizar Contrato
        </Typography>
        <Box px={1} pt={4}>
          <UploadMenuForm onSubmit={uploadPDF} />
        </Box>
      </Paper>
      {fileUrl && (
        <Box mt={4}>
          <Typography variant="h6">Contrato actual</Typography>
          <Box sx={{ border: '1px solid #ccc', height: '500px' }}>
            <iframe src={fileUrl} width="100%" height="100%" style={{ border: 'none' }}></iframe>
          </Box>
        </Box>
      )}
      <AlertNotification
        key="alerta-guardado-exitoso"
        isOpen={showAlert && isSuccess}
        onClose={() => setShowAlert(false)}
        severity="success"
        message="¡Archivo PDF subido con éxito!"
      />
      <AlertNotification
        key="alerta-error-guardado"
        isOpen={showAlert && isError}
        onClose={() => setShowAlert(false)}
        severity="error"
        message="¡Ocurrió un error al subir el archivo PDF!"
      />
      <Spinner isOpen={isLoading} />
    </Container>
  );
};

export default UploadPDFPage;
