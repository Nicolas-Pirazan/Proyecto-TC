import { useCreateCourse, useGetCourses, useUpdateCourses } from '@/api/params';
import { ICourse, IRegisterCourseForm } from '@/types/params';
import {
  Add,
  ArrowBack,
  AttachMoney,
  Cancel,
  Edit,
  Refresh,
  Save,
  School
} from '@mui/icons-material';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography
} from '@mui/material';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CheckboxElement, TextFieldElement } from 'react-hook-form-mui';
import { useQueryClient } from 'react-query';

interface CourseManagementProps {
  onBack: () => void;
}

interface CourseFormData extends IRegisterCourseForm { }
interface UpdateCourseFormData extends ICourse { }

interface UserInfo {
  username?: string;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ onBack }) => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const userInfoCookie = Cookies.get('userInfo');
    if (userInfoCookie) {
      try {
        const parsedUserInfo: UserInfo = JSON.parse(userInfoCookie);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  const { data: coursesResponse, isLoading: isLoadingCourses, refetch: refetchCourses } = useGetCourses();
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourses();

  // Obtener el usuario actual para los valores por defecto
  const getCurrentUser = () => userInfo?.username || 'admin';

  const createMethods = useForm<CourseFormData>({
    defaultValues: {
      name: '',
      description: '',
      value: 0,
      number_of_classes: 1,
      state: true,
      user_creation: getCurrentUser(),
    }
  });

  const editMethods = useForm<UpdateCourseFormData>({
    defaultValues: {
      consecutive: 0,
      name: '',
      description: '',
      value: 0,
      number_of_classes: 1,
      state: true,
      user_creation: getCurrentUser()
    }
  });

  const courses = coursesResponse?.entity || [];

  const handleRefreshCourses = () => {
    refetchCourses();
    queryClient.invalidateQueries('getCourses');
  };

  const handleCreateCourse = (data: CourseFormData) => {
    // Asegurar que usuario_creacion siempre tenga un valor válido
    const courseData = {
      ...data,
      user_creation: getCurrentUser(),
      // Agregar usuario_creacion para que coincida con el DTO del backend
      usuario_creacion: getCurrentUser()
    };

    console.log('Datos enviados para crear curso:', courseData); // Para debug

    createCourseMutation.mutate(courseData, {
      onSuccess: () => {
        setOpenCreateDialog(false);
        createMethods.reset({
          name: '',
          description: '',
          value: 0,
          number_of_classes: 1,
          state: true,
          user_creation: getCurrentUser()
        });
        handleRefreshCourses();
      },
      onError: (error) => {
        console.error('Error al crear curso:', error);
      }
    });
  };

  const handleEditCourse = (course: ICourse) => {
    setSelectedCourse(course);
    editMethods.reset({
      consecutive: course.consecutive,
      name: course.name,
      description: course.description,
      value: course.value,
      number_of_classes: course.number_of_classes,
      state: course.state,
      user_creation: getCurrentUser() // Usar el usuario actual para modificaciones
    });
    setOpenEditDialog(true);
  };

  const handleUpdateCourse = (data: UpdateCourseFormData) => {
    // Asegurar que usuario_creacion siempre tenga un valor válido
    const courseData = {
      ...data,
      user_creation: getCurrentUser(),
      // Agregar usuario_creacion para que coincida con el DTO del backend
      usuario_creacion: getCurrentUser()
    };

    console.log('Datos enviados para actualizar curso:', courseData); // Para debug

    updateCourseMutation.mutate(courseData, {
      onSuccess: () => {
        setOpenEditDialog(false);
        setSelectedCourse(null);
        editMethods.reset({
          consecutive: 0,
          name: '',
          description: '',
          value: 0,
          number_of_classes: 1,
          state: true,
          user_creation: getCurrentUser()
        });
        handleRefreshCourses();
      },
      onError: (error) => {
        console.error('Error al actualizar curso:', error);
      }
    });
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    createMethods.reset({
      name: '',
      description: '',
      value: 0,
      number_of_classes: 1,
      state: true,
      user_creation: getCurrentUser()
    });
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedCourse(null);
    editMethods.reset({
      consecutive: 0,
      name: '',
      description: '',
      value: 0,
      number_of_classes: 1,
      state: true,
      user_creation: getCurrentUser()
    });
  };

  // Actualizar los valores por defecto cuando cambie userInfo
  useEffect(() => {
    const currentUser = getCurrentUser();
    createMethods.setValue('user_creation', currentUser);
    editMethods.setValue('user_creation', currentUser);
  }, [userInfo, createMethods, editMethods]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={onBack}
          sx={{ mr: 2 }}
          color="primary"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" color="primary" fontWeight={600}>
          Administración de Cursos
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {courses.length}
                  </Typography>
                  <Typography variant="body2">
                    Total de Cursos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {courses.filter(c => c.state).length}
                  </Typography>
                  <Typography variant="body2">
                    Cursos Activos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    ${courses.filter(c => c.state).reduce((sum, c) => sum + c.value, 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Valor Total Activos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 3 }} variant="outlined">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary" fontWeight={600}>
            Gestión de Cursos
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefreshCourses}
              disabled={isLoadingCourses}
            >
              Actualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCreateDialog(true)}
            >
              Nuevo Curso
            </Button>
          </Box>
        </Box>
      </Paper>

      {createCourseMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Curso creado exitosamente
        </Alert>
      )}

      {updateCourseMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Curso actualizado exitosamente
        </Alert>
      )}

      {(createCourseMutation.isError || updateCourseMutation.isError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al procesar la operación. Intente nuevamente.
        </Alert>
      )}

      {/* Tabla de cursos */}
      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Clases</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingCourses ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Cargando cursos...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay cursos disponibles
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.consecutive} hover>
                    <TableCell>{course.consecutive}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {course.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={course.description}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {course.description}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{course.number_of_classes}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        ${course.value.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={course.state ? 'Activo' : 'Inactivo'}
                        color={course.state ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar curso">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditCourse(course)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
      >
        <FormProvider {...createMethods}>
          <form onSubmit={createMethods.handleSubmit(handleCreateCourse)}>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Add sx={{ mr: 1 }} />
                Crear Nuevo Curso
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextFieldElement
                    name="name"
                    label="Nombre del Curso"
                    required
                    fullWidth
                    validation={{
                      required: 'El nombre es obligatorio',
                      minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextFieldElement
                    name="description"
                    label="Descripción"
                    required
                    fullWidth
                    multiline
                    rows={3}
                    validation={{
                      required: 'La descripción es obligatoria',
                      minLength: { value: 10, message: 'Mínimo 10 caracteres' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextFieldElement
                    name="value"
                    label="Valor del Curso"
                    type="number"
                    required
                    fullWidth
                    inputProps={{ min: 0, step: 1000 }}
                    validation={{
                      required: 'El valor es obligatorio',
                      min: { value: 0, message: 'El valor debe ser positivo' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextFieldElement
                    name="number_of_classes"
                    label="Número de Clases"
                    type="number"
                    required
                    fullWidth
                    inputProps={{ min: 1 }}
                    validation={{
                      required: 'El número de clases es obligatorio',
                      min: { value: 1, message: 'Mínimo 1 clase' }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CheckboxElement
                    name="state"
                    label="Curso activo"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={handleCloseCreateDialog}
                startIcon={<Cancel />}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={createCourseMutation.isLoading ? <CircularProgress size={20} /> : <Save />}
                disabled={createCourseMutation.isLoading}
              >
                Crear Curso
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <FormProvider {...editMethods}>
          <form onSubmit={editMethods.handleSubmit(handleUpdateCourse)}>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Edit sx={{ mr: 1 }} />
                Editar Curso #{selectedCourse?.consecutive}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextFieldElement
                    name="name"
                    label="Nombre del Curso"
                    required
                    fullWidth
                    validation={{
                      required: 'El nombre es obligatorio',
                      minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextFieldElement
                    name="description"
                    label="Descripción"
                    required
                    fullWidth
                    multiline
                    rows={3}
                    validation={{
                      required: 'La descripción es obligatoria',
                      minLength: { value: 10, message: 'Mínimo 10 caracteres' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextFieldElement
                    name="value"
                    label="Valor del Curso"
                    type="number"
                    required
                    fullWidth
                    inputProps={{ min: 0, step: 1000 }}
                    validation={{
                      required: 'El valor es obligatorio',
                      min: { value: 0, message: 'El valor debe ser positivo' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextFieldElement
                    name="number_of_classes"
                    label="Número de Clases"
                    type="number"
                    required
                    fullWidth
                    inputProps={{ min: 1 }}
                    validation={{
                      required: 'El número de clases es obligatorio',
                      min: { value: 1, message: 'Mínimo 1 clase' }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CheckboxElement
                    name="state"
                    label="Curso activo"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={handleCloseEditDialog}
                startIcon={<Cancel />}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={updateCourseMutation.isLoading ? <CircularProgress size={20} /> : <Save />}
                disabled={updateCourseMutation.isLoading}
              >
                Actualizar Curso
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </Box>
  );
};

export default CourseManagement;