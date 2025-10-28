import { IUserDetail } from '@/types/users';
import { Grid, Typography } from '@mui/material';

export const UserDetail = ({ userData }: { userData?: IUserDetail }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          Nombre(s) y apellidos(s):
        </Typography>
        <Typography variant="subtitle1">{`${userData?.name} ${userData?.last_name}`}</Typography>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          R.U.N:
        </Typography>
        <Typography variant="subtitle1">{userData?.run}</Typography>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          Teléfono:
        </Typography>
        <Typography variant="subtitle1">{userData?.phone}</Typography>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          E-mail:
        </Typography>
        <Typography variant="subtitle1">{userData?.email}</Typography>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          Fecha de nacimiento:
        </Typography>
        <Typography variant="subtitle1">{new Date(`${userData?.date_born}`).toLocaleDateString()}</Typography>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          Género:
        </Typography>
        <Typography variant="subtitle1">{userData?.genre}</Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          Profesión u oficio:
        </Typography>
        <Typography variant="subtitle1">{userData?.job}</Typography>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          Observaciones especiales:
        </Typography>
        <Typography variant="subtitle1">{userData?.special_observations}</Typography>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          Medicamentos o alergias:
        </Typography>
        <Typography variant="subtitle1">{userData?.allergy_medications}</Typography>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          ¿Está embarazada?:
        </Typography>
        <Typography variant="subtitle1">{userData?.pregnancyncy ? 'Sí' : 'No'}</Typography>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          Meses de embarazo:
        </Typography>
        <Typography variant="subtitle1">{userData?.months_pregnancy}</Typography>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          Examen visual:
        </Typography>
        <Typography variant="subtitle1">{userData?.visual_examination ? 'Sí' : 'No'}</Typography>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          Dirección:
        </Typography>
        <Typography variant="subtitle1">{userData?.address}</Typography>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          Región:
        </Typography>
        <Typography variant="subtitle1">{userData?.region}</Typography>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="subtitle2" fontWeight={600} color="GrayText">
          Comuna:
        </Typography>
        <Typography variant="subtitle1">{userData?.commune}</Typography>
      </Grid>
      {userData?.locations.map(sede => (
        <Grid key={sede.id_location} item xs={12} md={6} lg={6}>
          <Typography variant="subtitle2" fontWeight={600} color="GrayText">
            Sede:
          </Typography>
          <Typography variant="subtitle1">{sede.location_name}</Typography>
        </Grid>
      ))}
    </Grid>
  );
};
