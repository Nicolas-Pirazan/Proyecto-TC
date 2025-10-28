'use client';
import {
    Alert,
    Backdrop,
    Box,
    CircularProgress,
    Grid,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';

import Logo from '@/images/logoPimeraMarcha.svg';

import { PaymentFormMP } from '@/components/PaymentForm';
import { UserRegisterForm } from '@/components/UserRegisterForm';
import { IRegisterStudentForm, IUser } from '@/types/users';

import { PaperStyled } from './RegisterPage.styled';

import { useCreateUser } from '@/api/users';

function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [showAlert, setShowAlert] = useState(true);

  const { mutate, isLoading, isError, isSuccess } = useCreateUser();
  const [run, setRun] = useState("");

  const handleNext = (data: IRegisterStudentForm) => {
    delete data.contrato;
    
    const newData: IUser = {
      ...data,
      roles: [1],
      locations: [data.locations],
      password: '',
      user_creation: data.run,
      address_detail: '',
    };

    mutate(newData, {
      onSuccess: () => {
        setActiveStep(1);
        setRun(data.run);
      },
    });

    if (!isLoading) {
      setShowAlert(true);
    }
  };

  return (
    <>
      <Grid container alignContent="center" justifyContent="center">
        <Grid item xs={12} md={8} lg={5}>
          <PaperStyled variant="outlined">
            <Box mb={6} display="flex" justifyContent="center">
              <Image src={Logo} alt="Logotipo primera marcha" width={200} />
            </Box>
            <Typography textAlign="center" variant="h5" mb={6} fontWeight={600} color="primary">
              Formulario de registro
            </Typography>
            <Stepper activeStep={activeStep}>
              <Step key="Datos personales">
                <StepLabel>Datos personales</StepLabel>
              </Step>
              <Step key="Medio de pago">
                <StepLabel>Medio de pago</StepLabel>
              </Step>
            </Stepper>
            <Box px={1} pt={4}>
              {activeStep === 0 && <UserRegisterForm onSubmit={handleNext} />}

              {activeStep === 1 && <PaymentFormMP run={run} total={100} description="Descripción predeterminada" />}
            </Box>
          </PaperStyled>
        </Grid>
      </Grid>
      <Snackbar
        open={showAlert && isSuccess}
        autoHideDuration={5000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowAlert(false)} severity="success" sx={{ width: '100%' }} variant="filled">
          ¡Información registrada con exito!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showAlert && isError}
        autoHideDuration={5000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowAlert(false)} severity="error" sx={{ width: '100%' }} variant="filled">
          ¡Ocurrió un error al guardar la información!
        </Alert>
      </Snackbar>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default RegisterPage;
