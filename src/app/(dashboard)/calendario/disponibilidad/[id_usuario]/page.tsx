'use client';
import { useGetUserDetail } from '@/api/users';
import Calendar from '@/components/Calendar';
import DisponibilityProvider from '@/context/useDisponibility';
import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import DisponibilidadForm from './disponibilidadForm';

const CreateDisponibilidadPage = ({ params }: { params: { id_usuario: number } }) => {
  const { data: userData, isLoading: userdataIsLoading } = useGetUserDetail(params.id_usuario);

  return (
    <DisponibilityProvider>
      <Grid container spacing={2} padding={3}>
        <Grid item xs={4}>
          <Paper
            sx={{ padding: 4, borderRadius: 2, minHeight: '100%', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
            variant="outlined"
          >
            <Typography variant="h5" color="primary" fontWeight={600} mb={2}>
              Asignar disponibilidad (page)
            </Typography>
            <Box padding={'0 0 20px 0'} display={'flex'}>
              <Typography fontWeight={'600'} marginRight={1}>
                Instructor:
              </Typography>
              <Typography>
                {userData?.entity ? `${userData?.entity[0].name} ${userData?.entity[0].last_name}` : '-'}
              </Typography>
            </Box>
            <DisponibilidadForm idUsuario={params.id_usuario} />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Box>
            {userdataIsLoading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 6 }}>
                <CircularProgress />
                <Typography variant="h6" fontWeight={600} color={grey[500]}>
                  Cargando información
                </Typography>
              </Box>
            ) : (
              <Calendar />
            )}
          </Box>
        </Grid>
      </Grid>
    </DisponibilityProvider>
  );
};

export default CreateDisponibilidadPage;
