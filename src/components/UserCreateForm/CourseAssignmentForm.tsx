import { useGetCourses } from '@/api/params';
import { CourseAssignmentFormProps, CourseSelection } from '@/types/schedule';
import { Add, Delete, Refresh } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import {
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';

export function CourseAssignmentForm({ onComplete, disabled }: CourseAssignmentFormProps) {
  const { data: coursesResponse, isLoading: isLoadingCourses, refetch } = useGetCourses();
  const courses = coursesResponse?.entity || [];
  const courseOptions = courses
    .filter(course => course.state)
    .map(course => ({ id: course.consecutive.toString(), label: `${course.name} - $${course.value.toLocaleString()}` }));
  
  const methods = useForm<{ selections: CourseSelection[] }>({
    defaultValues: { selections: [{ id_curso: 0, cantidad_clases: 1, comentario: '', paymentType: 'full' }] }
  });
  
  const { handleSubmit, watch, setValue } = methods;
  const courseSelections = watch('selections');

  const addCourseSelection = () => {
    const newItem: CourseSelection = {
      id_curso: 0,
      cantidad_clases: 1,
      comentario: '',
      paymentType: 'full'
    };
  
    const newList: CourseSelection[] = [...courseSelections, newItem];
    setValue('selections', newList);
  };

  const removeCourseSelection = (index: number) => {
    if (courseSelections.length > 1) {
      const newList = courseSelections.filter((_, i) => i !== index);
      setValue('selections', newList);
    }
  };

  const isValidSelection = (selection: CourseSelection) => selection.id_curso > 0 && selection.cantidad_clases > 0;
  const canProceed = () => courseSelections.length > 0 && courseSelections.every(isValidSelection) && new Set(courseSelections.map(s => s.id_curso)).size === courseSelections.length;

  const calculateCourseValue = (course: any, cantidadClases: number) => {
    if (course.name === "Clases Extras") {
      return course.value * cantidadClases;
    }
    return course.value;
  };

  const handleClassQuantityChange = (index: number, newQuantity: number) => {
    const selection = courseSelections[index];
    const selectedCourse = courses.find(c => c.consecutive === selection.id_curso);
    
    if (selectedCourse) {
      const newValue = calculateCourseValue(selectedCourse, newQuantity);
      setValue(`selections.${index}.cantidad_clases`, newQuantity);
      setValue(`selections.${index}.courseValue`, newValue);
      setValue(`selections.${index}.valor_curso_registrado`, newValue);
    }
  };

  const onSubmit = (data: { selections: CourseSelection[] }) => {
    const processedSelections = data.selections.map(selection => {
      const selectedCourse = courses.find(c => c.consecutive === selection.id_curso);
      if (selectedCourse) {
        const calculatedValue = calculateCourseValue(selectedCourse, selection.cantidad_clases);
        return {
          ...selection,
          courseValue: calculatedValue,
          valor_curso_registrado: calculatedValue,
          courseName: selectedCourse.name
        };
      }
      return selection;
    });
    
    onComplete(processedSelections);
  };

  if (disabled) return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="body1" color="text.secondary">
        Complete el paso anterior para continuar
      </Typography>
    </Box>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" color="primary" fontWeight={600}>Selección de Cursos</Typography>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => refetch()} disabled={isLoadingCourses}>Actualizar Cursos</Button>
        </Box>

        {isLoadingCourses && <Alert severity="info" sx={{ mb: 2 }}>Cargando cursos disponibles...</Alert>}

        {courseSelections.map((selection, index) => {
          const selectedCourse = courses.find(c => c.consecutive === selection.id_curso);
          const usedIds = courseSelections.map(s => s.id_curso);
          const availableOptions = courseOptions.filter(opt => !usedIds.includes(Number(opt.id)) || Number(opt.id) === selection.id_curso);
          const isClasesExtras = selectedCourse?.name === "Clases Extras";
          const currentValue = watch(`selections.${index}.courseValue`) || 0;

          return (
            <Card key={index} sx={{ mb: 2, position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>Curso {index + 1}</Typography>
                  {courseSelections.length > 1 && <IconButton color="error" onClick={() => removeCourseSelection(index)} size="small"><Delete /></IconButton>}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <SelectElement
                      name={`selections.${index}.id_curso`}
                      label="Seleccionar Curso"
                      options={availableOptions}
                      required
                      fullWidth
                      objectOnChange
                      onChange={(option) => {
                        const idCurso = Number(option.id);
                        const curso = courses.find(c => c.consecutive === idCurso);
                        
                        if (curso) {
                          setValue(`selections.${index}.id_curso`, idCurso);
                          setValue(`selections.${index}.courseName`, curso.name);
                          const cantidadClases = curso.name === "Clases Extras" ? 1 : curso.number_of_classes;
                          setValue(`selections.${index}.cantidad_clases`, cantidadClases);
                          const valorCurso = calculateCourseValue(curso, cantidadClases);
                          setValue(`selections.${index}.courseValue`, valorCurso);
                          setValue(`selections.${index}.valor_curso_registrado`, valorCurso);
                          setValue(`selections.${index}.paymentAmount`, valorCurso);
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    {isClasesExtras ? (
                      <TextFieldElement
                        name={`selections.${index}.cantidad_clases`}
                        label="Cantidad de Clases"
                        type="number"
                        inputProps={{ min: 1 }}
                        required 
                        fullWidth
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          handleClassQuantityChange(index, newQuantity);
                        }}
                      />
                    ) : (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Cantidad de Clases
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ 
                          p: 1.5, 
                          border: '1px solid #e0e0e0', 
                          borderRadius: 1,
                          backgroundColor: '#f5f5f5'
                        }}>
                          {selection.cantidad_clases}
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Valor del Curso
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${currentValue.toLocaleString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldElement
                      name={`selections.${index}.comentario`}
                      label="Comentarios (opcional)"
                      multiline rows={2}
                      fullWidth
                    />
                  </Grid>

                  {selectedCourse && (
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          <strong>{selectedCourse.name}</strong><br />
                          {selectedCourse.description}<br />
                          {isClasesExtras ? (
                            <>
                              Valor por clase: ${selectedCourse.value.toLocaleString()}<br />
                              Cantidad de clases: {selection.cantidad_clases}<br />
                              <strong>Valor total: ${currentValue.toLocaleString()}</strong>
                            </>
                          ) : (
                            <>
                              Valor total: ${selectedCourse.value.toLocaleString()}<br />
                              Total clases: {selectedCourse.number_of_classes}<br />
                              Valor por clase: ${Math.round(selectedCourse.value / selectedCourse.number_of_classes).toLocaleString()}
                            </>
                          )}
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
          <Button variant="outlined" startIcon={<Add />} onClick={addCourseSelection} disabled={isLoadingCourses}>
            Agregar Otro Curso
          </Button>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Total de cursos: {courseSelections.length}
            </Typography>
            <Typography variant="h6" color="primary">
              Total a pagar: ${courseSelections
                .reduce((total, sel) => {
                  return total + (sel.courseValue || 0);
                }, 0)
                .toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={!canProceed() || isLoadingCourses} sx={{ textTransform: 'capitalize' }}>
            Continuar al Pago
          </Button>
        </Box>

        {!canProceed() && courseSelections.some(s => s.id_curso > 0) && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Por favor complete todos los campos requeridos y asegúrese de no seleccionar cursos duplicados.
          </Alert>
        )}
      </form>
    </FormProvider>
  );
}