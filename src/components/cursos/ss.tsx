import { useUpdateStudentCourse } from '@/api/schedule';
import { useGetUserCourse } from '@/api/users';
import { IUpdateStudentCoursePayload } from '@/types/schedule';
import { IUserComplete, IUserCourse } from '@/types/users';
import { Cancel, Edit, Refresh, Save } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';

interface StudentCoursesSectionProps {
  selectedStudent: IUserComplete;
  onCoursesUpdated?: () => void;
}

export default function StudentCoursesSection({ selectedStudent, onCoursesUpdated }: StudentCoursesSectionProps) {
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ estado_curso: number; resultado_curso: number }>({ 
    estado_curso: 1, 
    resultado_curso: 1 
  });

  const queryClient = useQueryClient();

  const { 
    data: studentCoursesResponse, 
    isLoading: isLoadingStudentCourses
  } = useGetUserCourse(selectedStudent?.consecutive || 0);

  const updateCourseMutation = useUpdateStudentCourse();

  const refetchStudentCourses = () => {
    queryClient.invalidateQueries(['getUsuariosCursoEstudiante', selectedStudent.consecutive]);
  };

  const studentCourses = studentCoursesResponse?.entity || [];

  // Auto-update suspended courses to failed after 1 year
  useEffect(() => {
    if (studentCourses.length > 0) {
      const currentDate = new Date();
      const coursesToUpdate = studentCourses.filter(course => {
        if (course.resultado_curso === 3) { // Suspendido
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
          resultado_curso: 2, // Reprobado por inactividad
          usuario_modificacion: 'system'
        }, {
          onSuccess: () => {
            refetchStudentCourses();
            onCoursesUpdated?.();
          }
        });
      });
    }
  }, [studentCourses, updateCourseMutation, refetchStudentCourses, onCoursesUpdated]);

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
        onCoursesUpdated?.();
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

  const handleRefreshCourses = () => {
    refetchStudentCourses();
    onCoursesUpdated?.();
  };

  return (
    <Paper sx={{ p: 3 }} variant="outlined">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" color="primary" fontWeight={600}>
          Cursos de {selectedStudent.name} {selectedStudent.last_name}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={handleRefreshCourses}
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
  );
}