import { EventInput } from '@fullcalendar/core';

export type Disponibility = {
  desde: Date | undefined;
  hasta: Date | undefined;
  consecutivo: number;
  opciones: {
    lunes?: { horario: string }[];
    martes?: { horario: string }[];
    miercoles?: { horario: string }[];
    jueves?: { horario: string }[];
    viernes?: { horario: string }[];
    sabado?: { horario: string }[];
  };
};

export interface IStateReducer {
  disponibility?: Disponibility;
  dataCalendar?: EventInput[];
}

export interface ActionReducer {
  type: 'get_intervals_time' | 'set_disponibility' | 'get_disponibility';
  payload?: IStateReducer;
}

export type DaysNames = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado';
