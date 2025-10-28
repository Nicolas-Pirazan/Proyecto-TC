export interface IFormProps {
  desde: Date | undefined;
  hasta: Date | undefined;
  lunes: { horario: string }[];
  martes: { horario: string }[];
  miercoles: { horario: string }[];
  jueves: { horario: string }[];
  viernes: { horario: string }[];
  sabado: { horario: string }[];
}

export interface IIntervalOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface ISelectDisponibilityProps {
  addSelect: () => void;
  deleteSelect: () => void;
  index: number;
  name: string;
  opciones: IIntervalOption[];
  setCalendar: () => void;
  copySchedules: () => void;
}

export interface IAssingDisponibility {
  id_profesor: number;
  id_tipo_clase: number;
  disponibilidad: IDisponibility[];
  usuario_creacion: string;
}

export interface IAssingClass {
  listado_disponibilidad: number[];
  consecutivo_curso_estudiante: number;
  usuario_creacion: string;
}

export interface IDisponibility {
  fechaInicial: Date;
  fechaFinal: Date;
}

export interface IDisponibilities {
  consecutivo_agenda: number;
  consecutivo_clase: number;
  id_tipo_clase: number;
  tipo_clase: string;
  id_estado_clase: number;
  estado_clase: string;
  id_estudiante: number;
  estudiante: string;
  id_profesor: number;
  profesor: string;
  fecha_hora_inicio_clase: Date;
  fecha_hora_fin_clase: Date;
  comentario: string;
}

export interface IDisponibilitieConsecutives {
  consecutivo_agenda: number;
  consecutivo_clase: number;
}

export interface AgendaAsignacionClases {
  consecutivo_asignacion: number;
  consecutivo_asignacion_detalle: number;
  id_profesor: number;
  profesor: string;
  fecha_hora_inicio_clase: Date;
  fecha_hora_fin_clase: Date;
  consecutivo_clase: number;
  clase_asignada: boolean;
  id_tipo_clase: number;
  tipo_clase: string;
  id_estado_clase: number;
  estado_clase: string;
  id_estudiante: number;
  estudiante: string;
  comentario: string;
}



export type ParametrosAgendaDto = {
  fecha_ini: string;
  fecha_fin: string;
  id_estudiante: number;
}

export interface StudentAssignClasses {
  id_clase: number;
  id_agenda: number;
  consecutivo_curso_estudiante: number;
  estado_clase: string;
  fecha_hora_inicio_clase: string;
  fecha_hora_fin_clase: string;
  profesor: string;
}

export interface AvailableDate {
  dias: string;
}

export interface FetchDatesParams {
  fechas: string;
}

export interface FetchDisponibilitiesByDate {
  date: string;

}

export interface DisponibilidadxDate {
  id_disponibilidad: number;
  profesor: string;
  fecha_hora_inicio_clase: string;
  fecha_hora_fin_clase: string;
}

export interface RescheduleOrCancelClass {
  accion: number;
  consecutivo_curso_estudiante: number;
  id_clase: number;
  id_agenda: number;
  comentario: string;
  fecha_hora_solicitud: Date;
  usuario_modificacion: string;
}

export interface StudentsAssigning {
  id_curso_estudiante: number;
  estudiante: string;
  cantidad_clases: number;
}

export interface IDisponibilitiesProps {
  IdProfesor?: number | null;
  IdEstudiante?: number | null;
  Horario?: string | null;
  ClaseDisponible?: number | null;
  FechaIni?: Date;
  FechaFin?: Date;
}

export interface IAssignStudentCoursesPayload {
  id_estudiante: number;
  lista_cursos: {
    id_curso: number;
    cantidad_clases: number;
    valor_curso_registrado: number;
  }[];
  comentario?: string;
  usuario_creacion?: string;
  estado_curso: number;
  resultado_curso: number;
}

export interface CourseAssignmentFormProps {
  onComplete: (courses: CourseSelection[]) => void;
  disabled?: boolean;
}

export interface CourseSelection {
  id_curso: number;
  cantidad_clases: number;
  comentario?: string;
  courseName?: string;
  courseValue?: number;
  number_of_classes?: number;
  paymentType?: 'full' | 'installment';
  valor_curso_registrado?: number;
  paymentAmount?: number;
}

export interface CourseSelectionFragment {
  id_curso: number;
  courseName?: string;
  courseValue?: number;
  cantidad_clases: number;
}

export interface IUpdateStudentCoursePayload {
  id_curso_estudiante: number;   
  estado_curso?: number;        
  resultado_curso?: number;      
  usuario_modificacion: string;  
}

export interface UserInfo {
  consecutivo: number;
  nombre: string;
  apellido: string;
  roles: { consecutive: number; name: string }[];
  arbol_permisos: string;
}
