'use client';

import { useGetCourses } from '@/api/params';
import { useAssignCoursesToStudent, useUpdateStudentCourse } from '@/api/schedule';
import { useGetUserCourse, useGetUsers } from '@/api/users';
import { AppBarComponent as AppBar } from '@/components/AppBar';
import CourseManagement from '@/components/cursos/CourseManagement';
import { IAssignStudentCoursesPayload, IUpdateStudentCoursePayload } from '@/types/schedule';
import { IUserComplete, IUserCourse } from '@/types/users';
import { Add, Cancel, Delete, Edit, Refresh, Save } from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  debounce
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { useQueryClient } from 'react-query';

interface CourseAssignment {
  id_curso: number;
  cantidad_clases: number;
  courseName?: string;
  courseValue?: number;
  estado_curso: number;
  resultado_curso: number;
  number_of_classes?: number;
}

interface StudentCourseFormData {
  assignments: CourseAssignment[];
}

export default function StudentCourseManagementPage() {
  const [selectedStudent, setSelectedStudent] = useState<IUserComplete | null>(null);
  const [studentSearchText, setStudentSearchText] = useState('');
  const [studentPage, setStudentPage] = useState(1);
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ estado_curso: number; resultado_curso: number }>({
    estado_curso: 1,
    resultado_curso: 1
  });

  const queryClient = useQueryClient();

  const { data: studentsResponse, isLoading: isLoadingStudents, refetch: refetchStudents } = useGetUsers({
    idRol: 5,
    pageNumber: studentPage,
    pageSize: 20,
    text: studentSearchText
  });

  const refetchStudentCourses = () => {
    if (selectedStudent) {
      queryClient.invalidateQueries(['getUsuariosCursoEstudiante', selectedStudent.consecutive]);
    }
  };

  const { data: coursesResponse, isLoading: isLoadingCourses, refetch: refetchCourses } = useGetCourses();

  const {
    data: studentCoursesResponse,
    isLoading: isLoadingStudentCourses
  } = useGetUserCourse(selectedStudent?.consecutive || 0);

  const assignCoursesMutation = useAssignCoursesToStudent();
  const updateCourseMutation = useUpdateStudentCourse();

  const methods = useForm<StudentCourseFormData>({
  defaultValues: {
    assignments: [{
      id_curso: 0,
      cantidad_clases: 1,
      estado_curso: 1,
      resultado_curso: 1,
      number_of_classes: 1
    }]
  }
});

  const debouncedSetStudentSearch = useMemo(
    () => debounce((value: string) => {
      setStudentSearchText(value);
      setStudentPage(1);
    }, 500),
    []
  );

  const { handleSubmit, watch, setValue, reset, formState: { errors } } = methods;
  const courseAssignments = watch('assignments');
  const [showCourseManagement, setShowCourseManagement] = useState(false);
  const students = studentsResponse?.entity || [];
  const courses = coursesResponse?.entity || [];
  const studentCourses = studentCoursesResponse?.entity || [];

  const availableCourses = useMemo(() => {
    if (!selectedStudent) return [];

    const activeCourseIds = studentCourses
      .filter(sc => sc.estado_curso === 1)
      .map(sc => sc.idcourse);

    return courses
      .filter(course => course.state && !activeCourseIds.includes(course.consecutive))
      .map(course => ({
        id: course.consecutive.toString(),
        label: `${course.name} - $${course.value.toLocaleString()}`,
        name: course.name,
        value: course.value,
        number_of_classes: course.number_of_classes
      }));
  }, [courses, studentCourses, selectedStudent]);

  useEffect(() => {
    if (studentCourses.length > 0) {
      const currentDate = new Date();
      const coursesToUpdate = studentCourses.filter(course => {
        if (course.resultado_curso === 3) {
          const creationDate = new Date(course.fecha_creacion);
          const yearsDiff = (currentDate.getTime() - creationDate.getTime()) / (1000 * 3600 * 24 * 365);
          return yearsDiff > 1;
        }
        return false;
      });

      coursesToUpdate.forEach(course => {
        updateCourseMutation.mutate({
          id_curso_estudiante: course.id_student_course,
          estado_curso: course.estado_curso,
          resultado_curso: 2,
          usuario_modificacion: 'system'
        }, {
          onSuccess: () => {
            refetchStudentCourses();
          }
        });
      });
    }
  }, [studentCourses, updateCourseMutation, refetchStudentCourses]);

  const handleStudentChange = (event: any, newValue: IUserComplete | null) => {
    setSelectedStudent(newValue);
    reset({
      assignments: [{
        id_curso: 0,
        cantidad_clases: 1,
        estado_curso: 1,
        resultado_curso: 1,
        number_of_classes: 1
      }]
    });
  };

  const loadMoreStudents = () => {
    setStudentPage(prev => prev + 1);
  };

  const addCourseAssignment = () => {
    const newAssignment: CourseAssignment = {
      id_curso: 0,
      cantidad_clases: 1,
      estado_curso: 1,
      resultado_curso: 1,
      number_of_classes: 1
    };
    setValue('assignments', [...courseAssignments, newAssignment]);
  };

  const removeCourseAssignment = (index: number) => {
    if (courseAssignments.length > 1) {
      const newAssignments = courseAssignments.filter((_, i) => i !== index);
      setValue('assignments', newAssignments);
    }
  };

  const handleCourseSelection = (index: number, option: any) => {
    if (!option) return;

    const courseId = Number(option.id);
    setValue(`assignments.${index}.id_curso`, courseId);

    const course = courses.find(c => c.consecutive === courseId);
    if (course) {
      setValue(`assignments.${index}.courseName`, course.name);
      setValue(`assignments.${index}.courseValue`, course.value);
      setValue(`assignments.${index}.number_of_classes`, course.number_of_classes);
      if (course.name !== "Clases Extras") {
        setValue(`assignments.${index}.cantidad_clases`, course.number_of_classes);
      } else {
        const currentValue = courseAssignments[index]?.cantidad_clases || 1;
        setValue(`assignments.${index}.cantidad_clases`, currentValue);
      }
    }
  };

  const calculateCourseValue = (assignment: CourseAssignment) => {
    if (!assignment.courseValue) return 0;
    if (assignment.courseName === "Clases Extras") {
      return assignment.courseValue * assignment.cantidad_clases;
    }
    return assignment.courseValue;
  };

  const isValidAssignment = (assignment: CourseAssignment) =>
    assignment.id_curso > 0 && assignment.cantidad_clases > 0;

  const canProceed = () =>
    selectedStudent &&
    courseAssignments.length > 0 &&
    courseAssignments.every(isValidAssignment) &&
    new Set(courseAssignments.map(a => a.id_curso)).size === courseAssignments.length;

  const onSubmit = (data: StudentCourseFormData) => {
    if (!selectedStudent) return;

    data.assignments.forEach((assignment, index) => {
      const courseValue = calculateCourseValue(assignment);

      const payload: IAssignStudentCoursesPayload = {
        id_estudiante: selectedStudent.consecutive,
        lista_cursos: [{
          id_curso: assignment.id_curso,
          cantidad_clases: assignment.cantidad_clases,
          valor_curso_registrado: courseValue
        }],
        usuario_creacion: 'admin',
        estado_curso: assignment.estado_curso,
        resultado_curso: assignment.resultado_curso,
        comentario: `Asignación curso ${assignment.courseName || assignment.id_curso}`
      };

      console.log(`Payload enviado para curso ${index + 1}:`, payload);

      assignCoursesMutation.mutate(payload, {
        onSuccess: (response) => {
          console.log(`Respuesta exitosa para curso ${index + 1}:`, response);
          if (index === data.assignments.length - 1) {
            reset({
              assignments: [{
                id_curso: 0,
                cantidad_clases: 1,
                estado_curso: 1,
                resultado_curso: 1,
                number_of_classes: 1
              }]
            });
            refetchStudentCourses();
          }
        },
        onError: (error) => {
          console.error(`Error al asignar curso ${index + 1}:`, error);
        }
      });
    });
  };

  const handleEditCourse = (course: IUserCourse) => {
    setEditingCourse(course.id_student_course);
    setEditData({
      estado_curso: course.estado_curso,
      resultado_curso: course.resultado_curso
    });
  };

  const handleSaveEdit = (courseId: number) => {
    const payload: IUpdateStudentCoursePayload = {
      id_curso_estudiante: courseId,
      estado_curso: editData.estado_curso,
      resultado_curso: editData.resultado_curso,
      usuario_modificacion: 'admin'
    };

    updateCourseMutation.mutate(payload, {
      onSuccess: () => {
        setEditingCourse(null);
        refetchStudentCourses();
      },
      onError: (error) => {
        console.error('Error al actualizar curso:', error);
      }
    });
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
  };

  const getStatusColor = (estado: number): 'success' | 'error' => {
    return estado === 1 ? 'success' : 'error';
  };

  const getResultLabel = (resultado: number) => {
    switch (resultado) {
      case 1: return 'Pendiente';
      case 2: return 'Aprobado';
      case 3: return 'Reprobado';
      case 4: return 'Suspendido';
      default: return 'Desconocido';
    }
  };

  const getResultColor = (resultado: number): 'default' | 'success' | 'error' | 'warning' => {
    switch (resultado) {
      case 1: return 'default';
      case 2: return 'success';
      case 3: return 'error';
      case 4: return 'warning';
      default: return 'default';
    }
  };

  const calculateTotal = () => {
    return courseAssignments.reduce((total, assignment) => {
      return total + calculateCourseValue(assignment);
    }, 0);
  };

  return (
    <main>
      <AppBar />
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" color="primary" fontWeight={600}>
            Gestión de Cursos de Estudiantes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowCourseManagement(true)}
          >
            Administrar Cursos
          </Button>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }} variant="outlined">
          <Typography variant="h6" color="primary" fontWeight={600} mb={2}>
            Seleccionar Estudiante
          </Typography>
          <Autocomplete
            options={students}
            getOptionLabel={(option) => `${option.name} ${option.last_name} - ${option.run}`}
            loading={isLoadingStudents}
            onInputChange={(_, newInputValue) => debouncedSetStudentSearch(newInputValue)}
            onChange={handleStudentChange}
            value={selectedStudent}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar Estudiante (nombre, RUN, consecutivo...)"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoadingStudents ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            ListboxProps={{
              onScroll: (event) => {
                const listboxNode = event.currentTarget;
                if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
                  loadMoreStudents();
                }
              },
            }}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }} variant="outlined">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" color="primary" fontWeight={600}>
                  Asignar Cursos
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => refetchCourses()}
                  disabled={isLoadingCourses}
                >
                  Actualizar Cursos
                </Button>
              </Box>
              {!selectedStudent ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Seleccione un estudiante para continuar
                  </Typography>
                </Box>
              ) : (
                <>
                  {assignCoursesMutation.isError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      Error al asignar cursos: {
                        assignCoursesMutation.error &&
                          typeof assignCoursesMutation.error === 'object' &&
                          'message' in assignCoursesMutation.error
                          ? (assignCoursesMutation.error as any).message
                          : 'Error desconocido'
                      }
                    </Alert>
                  )}

                  {assignCoursesMutation.isSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Cursos asignados exitosamente
                    </Alert>
                  )}

                  {isLoadingCourses && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Cargando cursos disponibles...
                    </Alert>
                  )}

                  {courseAssignments.map((assignment, index) => {
                    const selectedCourse = courses.find(c => c.consecutive === assignment.id_curso);
                    const usedIds = courseAssignments.map(a => a.id_curso);
                    const filteredOptions = availableCourses.filter(opt =>
                      !usedIds.includes(Number(opt.id)) || Number(opt.id) === assignment.id_curso
                    );

                    return (
                      <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Curso {index + 1}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {courseAssignments.length > 1 && (
                                <IconButton
                                  color="error"
                                  onClick={() => removeCourseAssignment(index)}
                                  size="small"
                                >
                                  <Delete />
                                </IconButton>
                              )}
                            </Box>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <SelectElement
                                name={`assignments.${index}.id_curso`}
                                label="Seleccionar Curso"
                                options={filteredOptions}
                                required
                                fullWidth
                                objectOnChange
                                onChange={(option) => handleCourseSelection(index, option)}
                              />
                              {errors.assignments?.[index]?.id_curso && (
                                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                  Debe seleccionar un curso
                                </Typography>
                              )}
                            </Grid>

                            <Grid item xs={12} md={2}>
                              <TextFieldElement
                                name={`assignments.${index}.cantidad_clases`}
                                label="Cantidad de Clases"
                                type="number"
                                inputProps={{ min: 1 }}
                                required
                                fullWidth
                                disabled={assignment.courseName !== "Clases Extras"}
                              />
                              {assignment.courseName && assignment.courseName !== "Clases Extras" && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                  Valor fijo del curso: {assignment.number_of_classes} clases
                                </Typography>
                              )}
                            </Grid>

                            <Grid item xs={12} md={2}>
                              <FormControl fullWidth>
                                <InputLabel>Estado del Curso</InputLabel>
                                <Select
                                  value={assignment.estado_curso}
                                  onChange={(e) => setValue(`assignments.${index}.estado_curso`, Number(e.target.value))}
                                  label="Estado del Curso"
                                >
                                  <MenuItem value={1}>Activo</MenuItem>
                                  <MenuItem value={0}>Inactivo</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} md={2}>
                              <FormControl fullWidth>
                                <InputLabel>Resultado</InputLabel>
                                <Select
                                  value={assignment.resultado_curso}
                                  onChange={(e) => setValue(`assignments.${index}.resultado_curso`, Number(e.target.value))}
                                  label="Resultado"
                                >
                                  <MenuItem value={1}>Pendiente</MenuItem>
                                  <MenuItem value={2}>Aprobado</MenuItem>
                                  <MenuItem value={3}>Reprobado</MenuItem>
                                  <MenuItem value={4}>Suspendido</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} md={2}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Valor del Curso
                              </Typography>
                              <Typography variant="h6" color="primary">
                                ${calculateCourseValue(assignment).toLocaleString()}
                              </Typography>
                              {assignment.courseName === "Clases Extras" && (
                                <Typography variant="caption" color="text.secondary">
                                  ${assignment.courseValue?.toLocaleString()} x {assignment.cantidad_clases} clases
                                </Typography>
                              )}
                            </Grid>

                            {selectedCourse && (
                              <Grid item xs={12}>
                                <Alert severity="info">
                                  <Typography variant="body2">
                                    <strong>{selectedCourse.name}</strong><br />
                                    {selectedCourse.description}<br />
                                    Valor total: ${selectedCourse.value.toLocaleString()}<br />
                                    Total clases: {assignment.cantidad_clases}<br />
                                  </Typography>
                                </Alert>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    );
                  })}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={addCourseAssignment}
                      disabled={isLoadingCourses}
                    >
                      Agregar Otro Curso
                    </Button>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Total de cursos: {courseAssignments.length}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        Total a pagar: ${calculateTotal().toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!canProceed() || isLoadingCourses || assignCoursesMutation.isLoading}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {assignCoursesMutation.isLoading ? <CircularProgress size={20} /> : 'Asignar Cursos'}
                    </Button>
                  </Box>

                  {!canProceed() && courseAssignments.some(a => a.id_curso > 0) && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Por favor complete todos los campos requeridos y asegúrese de no seleccionar cursos duplicados.
                    </Alert>
                  )}
                </>
              )}
            </form>
          </FormProvider>
        </Paper>

        {selectedStudent && (
          <Paper sx={{ p: 3 }} variant="outlined">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" color="primary" fontWeight={600}>
                Cursos de {selectedStudent.name} {selectedStudent.last_name}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => refetchStudentCourses()}
                disabled={isLoadingStudentCourses}
              >
                Actualizar
              </Button>
            </Box>

            {isLoadingStudentCourses ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : studentCourses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  El estudiante no tiene cursos asignados
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {studentCourses.map((course) => (
                  <Grid item xs={12} md={6} lg={4} key={course.id_student_course}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {course.course}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Clases totales: {course.cantidad_clases}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Clases restantes: {course.clases_restantes}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Fecha de creación: {new Date(course.fecha_creacion).toLocaleDateString()}
                          </Typography>
                        </Box>

                        {editingCourse === course.id_student_course ? (
                          <Box sx={{ mb: 2 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                              <InputLabel>Estado del Curso</InputLabel>
                              <Select
                                value={editData.estado_curso}
                                onChange={(e) => setEditData(prev => ({
                                  ...prev,
                                  estado_curso: Number(e.target.value)
                                }))}
                                label="Estado del Curso"
                              >
                                <MenuItem value={1}>Activo</MenuItem>
                                <MenuItem value={0}>Inactivo</MenuItem>
                              </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                              <InputLabel>Resultado del Curso</InputLabel>
                              <Select
                                value={editData.resultado_curso}
                                onChange={(e) => setEditData(prev => ({
                                  ...prev,
                                  resultado_curso: Number(e.target.value)
                                }))}
                                label="Resultado del Curso"
                              >
                                <MenuItem value={1}>Pendiente</MenuItem>
                                <MenuItem value={2}>Aprobado</MenuItem>
                                <MenuItem value={3}>Reprobado</MenuItem>
                                <MenuItem value={4}>Suspendido</MenuItem>
                              </Select>
                            </FormControl>

                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<Save />}
                                onClick={() => handleSaveEdit(course.id_student_course)}
                                disabled={updateCourseMutation.isLoading}
                              >
                                Guardar
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Cancel />}
                                onClick={handleCancelEdit}
                              >
                                Cancelar
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>Estado:</Typography>
                              <Chip
                                label={course.estado_curso === 1 ? 'Activo' : 'Inactivo'}
                                color={getStatusColor(course.estado_curso)}
                                size="small"
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>Resultado:</Typography>
                              <Chip
                                label={getResultLabel(course.resultado_curso)}
                                color={getResultColor(course.resultado_curso)}
                                size="small"
                              />
                            </Box>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Edit />}
                              onClick={() => handleEditCourse(course)}
                              sx={{ mt: 1 }}
                            >
                              Editar
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        )}
        {showCourseManagement && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'background.default',
              zIndex: 1300,
              overflow: 'auto'
            }}
          >
            <CourseManagement onBack={() => setShowCourseManagement(false)} />
          </Box>
        )}
      </Box>
    </main>
  );
}