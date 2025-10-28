import { Box, Button, Grid } from '@mui/material';
import {
  CheckboxElement,
  Controller,
  DatePickerElement,
  FieldError,
  FormContainer,
  SelectElement,
  TextFieldElement,
  useForm,
} from 'react-hook-form-mui';

import { useUserFormOptions } from '@/hooks';
import { IOptionSelect } from '@/types/forms';
import { IRegisterStudentForm, IRegisterStudentFormProps } from '@/types/users';

const parseError = (error: FieldError) => {
  if (error.type === 'pattern') {
    return 'Ingresa un e-mail válido';
  }
  return 'Este campo es requerido';
};

export function UserRegisterForm({ onSubmit }: IRegisterStudentFormProps) {
  const { watch, control, resetField } = useForm<IRegisterStudentForm>();
  const idRegionOption: IOptionSelect = watch('region_id') as unknown as IOptionSelect;
  const { comunasOpciones, generosOpciones, mediosOpciones, regionesOpciones, sedesOpciones } = useUserFormOptions({
    idRegion: idRegionOption?.id || 0,
  });

  return (
    <FormContainer onSuccess={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <TextFieldElement name="name" label="Nombre" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TextFieldElement name="last_name" label="Apellidos" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TextFieldElement name="run" label="R.U.N" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TextFieldElement name="phone" label="Teléfono" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TextFieldElement name="email" label="E-mail" type="email" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <DatePickerElement
            name="date_born"
            label="Fecha de nacimiento"
            required
            inputProps={{
              size: 'small',
            }}
            validation={{ required: 'Este campo es requerido' }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <SelectElement name="id_genre" label="Género" options={generosOpciones} required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TextFieldElement name="job" label="Profesión u oficio" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Controller
            name="special_observations"
            control={control}
            render={({ field }) => (
              <TextFieldElement
                {...field}
                name="special_observations"
                label="Observaciones especiales"
                multiline
                rows={3}
                fullWidth
                required
                parseError={parseError}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Controller
            name="allergy_medications"
            control={control}
            render={({ field }) => (
              <TextFieldElement
                {...field}
                name="allergy_medications"
                label="Medicamentos o alergias"
                multiline
                rows={3}
                fullWidth
                required
                parseError={parseError}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6} container justifyContent="center" alignItems="center">
          <CheckboxElement name="pregnancy" label="¿Estás embarazada?" parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={6} lg={6} container justifyContent="center" alignItems="center">
          <CheckboxElement name="visual_examination" label="Examen visual" parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextFieldElement name="months_pregnancy" label="Meses de embarazo" type="number" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextFieldElement name="address" label="Dirección" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Controller
            name="region_id"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectElement
                name="id_region"
                label="Región"
                options={regionesOpciones}
                objectOnChange={true}
                onChange={value => {
                  resetField('region_id');
                  onChange(value);
                }}
                required
                parseError={parseError}
                value={value}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Controller
            name="id_commune"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectElement
                name="id_commune"
                label="Comuna"
                options={comunasOpciones}
                objectOnChange={true}
                onChange={value => {
                  resetField('id_commune');
                  onChange(value);
                }}
                required
                parseError={parseError}
                value={value}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <SelectElement name="locations" label="Sede" required parseError={parseError} options={sedesOpciones} />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <SelectElement
            name="medium_enter"
            label="¿Por qué medio te enteraste de nosotros?"
            options={mediosOpciones}
            required
            parseError={parseError}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <CheckboxElement
            name="contrato"
            required
            parseError={parseError}
            label="He leído y aceptado las condiciones y políticas del curso, de privacidad y uso de información personal, y declaro ser mayor de edad y estar en pleno uso de mis facultades."
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button type="submit" variant="contained" sx={{ textTransform: 'capitalize' }}>
          Siguiente
        </Button>
      </Box>
    </FormContainer>
  );
}
