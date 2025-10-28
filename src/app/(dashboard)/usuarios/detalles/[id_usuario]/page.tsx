'use client';
import { useGetUserDetail } from '@/api/users';
import { UserDetail } from '@/components/UserDetail';
import { IUserDetail } from '@/types/users';
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import Link from 'next/link';

const DetailUserPage = ({ params }: { params: { id_usuario: number } }) => {
  const { data, isLoading, isError } = useGetUserDetail(params.id_usuario);

  const defaultUserData: IUserDetail = {
    consecutive: 0,
    name: '-',
    last_name: '',
    run: '-',
    id_genre: 0,
    genre: '-',
    date_born: new Date(),
    phone: '-',
    email: '-',
    password: null,
    address: '-',
    address_detail: '-',
    region_id: 0,
    region: '-',
    id_province_: 0,
    province: '-',
    id_commune: 0,
    commune: '-',
    job: '-',
    special_observations: '-',
    allergy_medications: '-',
    pregnancyncy: false,
    visual_examination: false,
    months_pregnancy: 0,
    medium_enter: 0,
    roles: [],
    locations: []
  };

  const userData = data?.entity ? data.entity[0] : defaultUserData;

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      {isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 6 }}>
          <CircularProgress />
          <Typography variant="h6" fontWeight={600} color={grey[500]}>
            Cargando la información del usuario
          </Typography>
        </Box>
      )}
      {!isLoading && !isError && (
        <Paper sx={{ padding: 4, borderRadius: 2 }} variant="outlined">
          <Typography variant="h5" color="primary" fontWeight={600} mb={4}>
            Detalles del usuario
          </Typography>
          <UserDetail userData={userData} />
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4, justifyContent: 'space-between' }}>
            <Link href="/usuarios">
              <Button type="button" variant="outlined" sx={{ textTransform: 'capitalize' }}>
                Volver
              </Button>
            </Link>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default DetailUserPage;
