'use client';

import { useEditUser, useGetUserDetail } from '@/api/users';
import AlertNotification from '@/components/Alert/AlertNotification';
import Spinner from '@/components/Spinner';
import { UserCreateForm } from '@/components/UserCreateForm';
import { IRegisterUserForm, IUser } from '@/types/users';
import { Container, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { FormContainer } from 'react-hook-form-mui';

const EditUserPage = ({ params }: { params: { id_usuario: number } }) => {
  const [showAlert, setShowAlert] = useState(true);
  const { data: userData, isLoading: userdataIsLoading } = useGetUserDetail(params.id_usuario);
  const { mutate, isLoading, isError, isSuccess } = useEditUser(params.id_usuario);

  const userDetail = userData?.entity[0];
  const defaultValues: IRegisterUserForm = {
    last_name: userDetail?.last_name || '',
    address: userDetail?.address || '',
    email: userDetail?.email || '',
    date_born: new Date(`${userDetail?.date_born}`),
    id_commune: userDetail?.id_commune || 0,
    id_genre: userDetail?.id_genre || 0,
    region_id: userDetail?.region_id || 0,
    name: userDetail?.name || '',
    job: userDetail?.job || '',
    roles:
      userDetail?.roles.map(user => {
        return { id: user.id_rol, label: user.name };
      }) || [],
    run: userDetail?.run || '',
    locations:
      userDetail?.locations.map(Sede => {
        return { id: Sede.id_location, label: Sede.location_name};
      }) || [],
    phone: userDetail?.phone || '',
    medium_enter: 0,
    user_modification: '',
    special_observations: userDetail?.special_observations || '',
    allergy_medications: userDetail?.allergy_medications || '',
    pregnancyncy: userDetail?.pregnancyncy || false,
    visual_examination: userDetail?.visual_examination || false,
    months_pregnancy: userDetail?.months_pregnancy || 0,
  };

  const createUser = (data: IRegisterUserForm) => {
    const newData: IUser = {
      ...data,
      roles: data.roles.map(rol => Number(rol.id)),
      password: '',
      user_creation: '',
      address_detail: '',
      locations: data.locations.map(sede => Number(sede.id)),
      medium_enter: 0,
    };

    mutate(newData);

    if (!isLoading) {
      setShowAlert(true);
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
        <Paper sx={{ padding: 4, borderRadius: 2 }} variant="outlined">
          <Typography variant="h5" color="primary" fontWeight={600} mb={4}>
            Registro de usuario
          </Typography>
          {!userdataIsLoading ? (
            <FormContainer onSuccess={createUser} values={defaultValues}>
              <UserCreateForm isSuccess={isSuccess} />
            </FormContainer>
          ) : (
            <h2>Cargando...</h2>
          )}
        </Paper>
      </Container>

      <AlertNotification
        key="alerta-guardado-exitoso"
        isOpen={showAlert && isSuccess}
        onClose={() => setShowAlert(false)}
        severity="success"
        message="Usuario registrado con exito!"
      />

      <AlertNotification
        key="alerta-error-guardado"
        isOpen={showAlert && isError}
        onClose={() => setShowAlert(false)}
        severity="error"
        message="¡Ocurrió un error al guardar el usuario!"
      />
      <Spinner isOpen={isLoading} />
    </>
  );
};

export default EditUserPage;
