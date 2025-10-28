export interface CalendarSelectedEvent {
  id: string;
  start: string;
  end: string;
  title: string;
  profesor: string;
  estudiante: string;
  id_agenda: number;
  id_clase: number;
  consecutivo_curso_estudiante?: number;
}