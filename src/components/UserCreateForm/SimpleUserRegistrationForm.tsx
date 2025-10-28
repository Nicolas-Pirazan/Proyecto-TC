import { useMemo } from 'react';
import {
    AutocompleteElement,
    DatePickerElement,
    FieldError,
    SelectElement,
    TextFieldElement,
    useFormContext,
} from 'react-hook-form-mui';

import { useUserFormOptions } from '@/hooks';
import { ISimpleUserForm, UserInfo } from '@/types/users';
import { Alert, Box, Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';

const parseError = (error: FieldError) => {
  if (error.type === 'pattern') {
    return 'Ingresa un e-mail válido';
  }
  return 'Este campo es requerido';
};

interface SimpleUserRegistrationFormProps {
  onSubmit: (data: ISimpleUserForm) => void;
  currentUserInfo: UserInfo | null;
}

export function SimpleUserRegistrationForm({ onSubmit, currentUserInfo }: SimpleUserRegistrationFormProps) {
  const { handleSubmit, formState, setValue } = useFormContext<ISimpleUserForm>();
  const { generosOpciones, rolesOpciones } = useUserFormOptions({
    idRegion: 0,
  });

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() - 12 * 17);

  const filteredRoles = useMemo(() => {
    if (!currentUserInfo || !currentUserInfo.roles || currentUserInfo.roles.length === 0) {
      return [];
    }

    const currentUserRole = currentUserInfo.roles[0];
    const roleId = currentUserRole.consecutive;

    return rolesOpciones.filter(role => {
      const roleNumericId = Number(role.id);
      
      if (roleId === 1) { 
        return true;
      } else if (roleId === 2) { 
        return roleNumericId >= 2 && roleNumericId <= 5;
      } else if (roleId === 3) { 
        return roleNumericId >= 4 && roleNumericId <= 5;
      } else {
        return false;
      }
    });
  }, [rolesOpciones, currentUserInfo]);

  const handleFormSubmit = (data: ISimpleUserForm) => {
    onSubmit(data);
  };

  const getCurrentUserRoleName = () => {
    if (!currentUserInfo || !currentUserInfo.roles || currentUserInfo.roles.length === 0) {
      return 'Usuario';
    }
    return currentUserInfo.roles[0].name;
  };

  const getPermissionMessage = () => {
    if (!currentUserInfo || !currentUserInfo.roles || currentUserInfo.roles.length === 0) {
      return 'No se pueden determinar los permisos del usuario actual.';
    }

    const roleId = currentUserInfo.roles[0].consecutive;
    
    switch (roleId) {
      case 1:
        return 'Como Super Usuario, puedes crear usuarios con cualquier rol del sistema.';
      case 2:
        return 'Como Administrativo, puedes crear usuarios con roles: Administrativo, Secretaria, Profesor y Alumno.';
      case 3:
        return 'Como Secretaria, puedes crear usuarios con roles: Profesor y Alumno.';
      default:
        return 'No tienes permisos para crear usuarios.';
    }
  };

  if (!currentUserInfo || !currentUserInfo.roles || currentUserInfo.roles.length === 0) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error: No se pudo obtener la información del usuario actual. Por favor, inicia sesión nuevamente.
      </Alert>
    );
  }

  if (filteredRoles.length === 0) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        No tienes permisos suficientes para crear nuevos usuarios. 
        Contacta con tu administrador del sistema.
      </Alert>
    );
  }

  return (
    <>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Usuario actual:</strong> {currentUserInfo.nombre} {currentUserInfo.apellido} ({getCurrentUserRoleName()})
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {getPermissionMessage()}
        </Typography>
      </Alert>

      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <AutocompleteElement
            multiple
            showCheckbox
            name="roles"
            label="Rol"
            required
            parseError={parseError}
            options={filteredRoles}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={6}>
          <TextFieldElement 
            name="name" 
            label="Nombre" 
            required 
            parseError={parseError} 
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={6}>
          <TextFieldElement 
            name="last_name" 
            label="Apellidos" 
            required 
            parseError={parseError} 
          />
        </Grid>
        
        <Grid item xs={12} md={4} lg={4}>
          <TextFieldElement 
            name="run" 
            label="R.U.N" 
            required 
            parseError={parseError} 
          />
        </Grid>
        
        <Grid item xs={12} md={4} lg={4}>
          <TextFieldElement 
            name="phone" 
            label="Teléfono" 
            required 
            parseError={parseError} 
          />
        </Grid>
        
        <Grid item xs={12} md={4} lg={4}>
          <TextFieldElement 
            name="email" 
            label="E-mail" 
            type="email" 
            required 
            parseError={parseError} 
          />
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
            maxDate={maxDate}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={6}>
          <SelectElement 
            name="id_genre" 
            label="Género" 
            options={generosOpciones} 
            required 
            parseError={parseError} 
          />
        </Grid>
        
        <Grid item xs={12} md={12} lg={12}>
          <TextFieldElement 
            name="job" 
            label="Profesión u oficio" 
            required 
            parseError={parseError} 
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4, justifyContent: 'space-between' }}>
        <Link href="/usuarios">
          <Button type="button" variant="outlined" sx={{ textTransform: 'capitalize' }}>
            Volver
          </Button>
        </Link>
        
        <Button 
          type="submit" 
          variant="contained" 
          sx={{ textTransform: 'capitalize' }}
          onClick={handleSubmit(handleFormSubmit)}
        >
          Crear Usuario
        </Button>
      </Box>
    </>
  );
}