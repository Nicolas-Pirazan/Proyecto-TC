import { useEffect } from 'react';
import {
  AutocompleteElement,
  CheckboxElement,
  Controller,
  DatePickerElement,
  FieldError,
  SelectElement,
  TextFieldElement,
  useFormContext,
} from 'react-hook-form-mui';

import { useUserFormOptions } from '@/hooks';
import { IOptionSelect } from '@/types/forms';
import { IRegisterUserForm, IRegisterUserFormProps } from '@/types/users';
import { Box, Button, Grid } from '@mui/material';
import Link from 'next/link';

const parseError = (error: FieldError) => {
  if (error.type === 'pattern') {
    return 'Ingresa un e-mail válido';
  }
  return 'Este campo es requerido';
};

interface UserCreateFormProps extends IRegisterUserFormProps {
  onComplete?: (data: IRegisterUserForm) => void;
  showNextButton?: boolean;
}

export function UserCreateForm({ isSuccess, onComplete, showNextButton = false }: UserCreateFormProps) {
  const { reset, formState, watch, control, setValue, getFieldState, handleSubmit, getValues } =
    useFormContext<IRegisterUserForm>();

  useEffect(() => {
    setValue('roles', [{ id: 5, label: 'Alumno' }], { shouldDirty: true });
  }, [setValue]);

  const idRegionOption: IOptionSelect = watch('region_id') as unknown as IOptionSelect;
  const { comunasOpciones, generosOpciones, regionesOpciones, sedesOpciones } = useUserFormOptions({
    idRegion: idRegionOption?.id || formState.defaultValues?.region_id || 0,
  });
  const { isDirty: isDirtyRegion } = getFieldState('region_id');
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() - 12 * 17);

  useEffect(() => {
    if (isSuccess) {
      reset({});
    }
    setValue('months_pregnancy', 0);
  }, [isSuccess, reset, setValue]);

  const handleNextStep = () => {
    const formData = getValues();
    if (onComplete) {
      onComplete(formData);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <AutocompleteElement
            multiple
            showCheckbox
            name="roles"
            label="Rol"
            required
            parseError={parseError}
            options={[{ id: 5, label: 'Alumno' }]}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextFieldElement name="name" label="Nombre" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextFieldElement name="last_name" label="Apellidos" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextFieldElement name="run" label="R.U.N" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextFieldElement name="phone" label="Teléfono" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextFieldElement name="email" label="E-mail" type="email" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <DatePickerElement
            name="date_born"
            label="Fecha de nacimiento"
            required
            inputProps={{ size: 'small' }}
            validation={{ required: 'Este campo es requerido' }}
            maxDate={maxDate}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <SelectElement
            name="id_genre"
            label="Género"
            options={generosOpciones}
            required
            parseError={parseError}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
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
        <Grid
          item
          xs={12}
          md={4}
          lg={4}
          container
          justifyContent="center"
          alignItems="center"
        >
          <CheckboxElement name="pregnancy" label="¿Estás embarazada?" parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TextFieldElement name="months_pregnancy" label="Meses de embarazo" type="number" required parseError={parseError} />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          lg={4}
          container
          justifyContent="center"
          alignItems="center"
        >
          <CheckboxElement name="visual_examination" label="Examen visual" parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextFieldElement name="address" label="Dirección" required parseError={parseError} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Controller
            name="region_id"
            control={control}
            render={({ field }) => (
              <SelectElement
                name="region_id"
                label="Región"
                options={regionesOpciones}
                objectOnChange
                onChange={value => field.onChange(value)}
                required
                parseError={parseError}
                value={field.value}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Controller
            name="id_commune"
            control={control}
            render={({ field }) => (
              <SelectElement
                name="id_commune"
                label="Comuna"
                options={comunasOpciones}
                onChange={value => field.onChange(value)}
                required
                parseError={parseError}
                value={field.value}
                disabled={!getFieldState('region_id').isDirty}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <AutocompleteElement
            multiple
            showCheckbox
            name="locations"
            label="Sede"
            required
            parseError={parseError}
            options={sedesOpciones}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4, justifyContent: 'space-between' }}>
        <Link href="/usuarios">
          <Button type="button" variant="outlined" sx={{ textTransform: 'capitalize' }}>
            Volver
          </Button>
        </Link>
        {showNextButton ? (
          <Button
            type="submit"
            variant="contained"
            sx={{ textTransform: 'capitalize' }}
            onClick={handleSubmit(handleNextStep)}
          >
            Siguiente
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            sx={{ textTransform: 'capitalize' }}
            onClick={handleSubmit(handleNextStep)}
          >
            Guardar
          </Button>
        )}
      </Box>
    </>
  );
}
