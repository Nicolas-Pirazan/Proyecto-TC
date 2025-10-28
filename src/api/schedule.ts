import api from '@/api';
import { IResponse } from '@/types';
import { AgendaAsignacionClases, AvailableDate, DisponibilidadxDate, FetchDatesParams, FetchDisponibilitiesByDate, IAssignStudentCoursesPayload, IAssingClass, IAssingDisponibility, IDisponibilities, IDisponibilitiesProps, IUpdateStudentCoursePayload, ParametrosAgendaDto, RescheduleOrCancelClass, StudentAssignClasses, StudentsAssigning } from '@/types/schedule';
import { useMutation, useQuery } from 'react-query';

export const useAssignDisponibility = () => {
  const { data, isLoading, isError, error, mutate, isSuccess } = useMutation(
    'postAssignDisponibility',
    (disponibilityData: IAssingDisponibility) =>
      api
        .post('AsignacionClases/InsertAsignacionProfesor', JSON.stringify(disponibilityData))
        .then(response => response.data)
  );

  return { data, isLoading, isError, error, mutate, isSuccess };
};

export const useAssignClass = () => {
  const { data, isLoading, isError, error, mutate, isSuccess } = useMutation(
    'postAssignClass',
    (classData: IAssingClass) =>
      api
        .post('AsignacionClases/InsertClase', JSON.stringify(classData))
        .then(response => response.data)
  );

  return { data, isLoading, isError, error, mutate, isSuccess };
};

export const useGetDisponibilities = (filters?: IDisponibilitiesProps) => {
  const { data, isLoading, isError, error, refetch } = useQuery<IResponse<IDisponibilities[]>>(
    ['getAsignacionesClases', filters], 
    () =>
      api.get('AsignacionClases/GetAsignacionesClases', { params: filters }) 
        .then(response => response.data)
  );

  return { data, isLoading, isError, error, refetch };
};


export const useGetStudentSchedule = (idEstudiante: string) => {
  const { data, isLoading, isError, error, mutate } = useMutation<IResponse<AgendaAsignacionClases[]>, Error, ParametrosAgendaDto>(
    ['GetAgendaEstudiante', idEstudiante],
    (studentSchedule: ParametrosAgendaDto) =>
      api.get(`AgendaEstudiante/GetAgendaEstudiante?fecha_ini=${studentSchedule.fecha_ini}
              &fecha_fin=${studentSchedule.fecha_fin}&id_estudiante=${studentSchedule.id_estudiante}`).then(response => response.data)
  );

  return { data, isLoading, isError, error, mutate };
};

export const useGetStudentAssignClasses = (idEstudiante: string) => {
  const { data, isLoading, isError, error } = useQuery<IResponse<StudentAssignClasses[]>>(['GetAgendaEstudianteAsignada', idEstudiante],
    () =>
      api.get(`AgendaEstudiante/GetAgendaEstudianteAsignada/${idEstudiante}`).then(response => response.data)
  );

  return { data, isLoading, isError, error };
};

export const useGetAvailableDates = () => {
  const { data, isLoading, isError, error, mutate } = useMutation<IResponse<AvailableDate[]>, Error, FetchDatesParams>(
    ['useGetAvailableDates'],
    (params: FetchDatesParams) =>
      api.get(`AsignacionClases/getDiasDisponiblesAgenda?fechas=${params.fechas}`).then(response => response.data)
  );

  return { data, isLoading, isError, error, mutate };
};

export const useGetDisponibilitiesbyDate = () => {
  const { data, isLoading, isError, error, mutate } = useMutation<IResponse<DisponibilidadxDate[]>, Error, FetchDisponibilitiesByDate>(
    ['useGetDisponibilitiesbyDate'],
    (params: FetchDisponibilitiesByDate) =>
      api.get(`AgendaEstudiante/GetDisponibilidadxFecha?fecha=${params.date}`).then(response => response.data)
  );

  return { data, isLoading, isError, error, mutate };
};

export const useRescheduleOrCancelClass = () => {
  const { data, isLoading, isError, error, mutate, isSuccess } = useMutation(
    'rescheduleOrCancelClass()',
    (dataClass: RescheduleOrCancelClass) =>
      api
        .post('AsignacionClases/ReprogramarCancelarClase', JSON.stringify(dataClass))
        .then(response => response.data)
  );

  return { data, isLoading, isError, error, mutate, isSuccess };
};

export const useGetStudentsAssigning = () => {
  const { data, isLoading, isError, error } = useQuery<IResponse<StudentsAssigning[]>>(['getEstudiantesAsignacionClases'],
    () =>
      api.get('AsignacionClases/getEstudiantesAsignacionClases').then(response => response.data)
  );

  return { data, isLoading, isError, error };
};

export const useAssignCoursesToStudent = () => {
  return useMutation<IResponse<boolean>, unknown, IAssignStudentCoursesPayload>(
    (payload) =>
      api
        .post('AsignacionClases/InsertCursoEstudiante', JSON.stringify(payload))
        .then((response) => response.data)
  );
};

export const useUpdateStudentCourse = () => {
  const { data, isLoading, isError, error, mutate, isSuccess } = useMutation(
    'updateStudentCourse',
    (payload: IUpdateStudentCoursePayload) =>
      api
        .put('AsignacionClases/UpdateCursoEstudiante', JSON.stringify(payload))
        .then(response => response.data)
  );

  return { data, isLoading, isError, error, mutate, isSuccess };
};