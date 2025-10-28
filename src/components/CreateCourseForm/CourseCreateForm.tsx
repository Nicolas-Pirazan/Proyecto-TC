import { IRegisterCourseFormProps } from '@/types/params';
import { Box, Button, Grid } from '@mui/material';
import { useEffect } from 'react';
import { CheckboxElement, TextFieldElement, useFormContext } from 'react-hook-form-mui';

const parseError = (error: any) => {
  if (error.type === 'pattern') {
    return 'Ingresa un valor válido';
  }
  return 'Este campo es requerido';
};

export default function CourseCreateForm({ isSuccess }: IRegisterCourseFormProps) {
  const { reset } = useFormContext();

  useEffect(() => {
    if (isSuccess) {
      reset({});
    }
  }, [isSuccess, reset]);

  return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <TextFieldElement
            name="name"
            label="Nombre del Curso"
            required
            fullWidth
            parseError={parseError}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextFieldElement
            name="description"
            label="Descripción del Curso"
            multiline
            required
            rows={4}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextFieldElement
            name="value"
            label="Valor del Curso"
            type="number"
            required
            fullWidth
            parseError={parseError}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextFieldElement
            name="user_creation"
            label="Creador del Curso"
            required
            fullWidth
            parseError={parseError}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <CheckboxElement
            name="state"
            label="Estado del Curso"
            parseError={parseError}
          />
        </Grid >
        <Grid item xs={12} md={12} lg={12}>
          <Box sx={{   display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button type="submit" variant="contained" sx={{ textTransform: 'capitalize' }}>
            Registrar
            </Button>
          </Box>
        </Grid>
      </Grid>
  );
}
