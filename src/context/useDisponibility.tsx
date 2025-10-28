import React, { Dispatch, PropsWithChildren, createContext, useReducer } from 'react';
import { ActionReducer, Disponibility, IStateReducer } from '@/types/disponibility';
import moment, { Moment } from 'moment';
import { EventInput } from '@fullcalendar/core';

const initialState: IStateReducer = {
  disponibility: {
    desde: undefined,
    hasta: undefined,
    consecutivo: 0,
    opciones: {
      lunes: [{ horario: '' }],
      martes: [{ horario: '' }],
      miercoles: [{ horario: '' }],
      jueves: [{ horario: '' }],
      viernes: [{ horario: '' }],
    },
  },
  dataCalendar: [],
};

const getDisponibilityDay = (horario: string, index: number, date: Moment, dayName: string): EventInput => {
  const schedule: string[] = horario.split(' - ');
  const start = date
    .clone()
    .set({ hours: Number(schedule[0].split(':')[0]), minutes: Number(schedule[0].split(':')[1]) });
  const end = date
    .clone()
    .set({ hours: Number(schedule[1].split(':')[0]), minutes: Number(schedule[1].split(':')[1]) });

  return {
    id: `${dayName}-${index}-${start.format('X')}`,
    start: start.format(),
    end: end.format(),
    allDay: false,
    editable: false,
  };
};

const setDataCalendar = (data?: Disponibility): EventInput[] => {
  if (data) {
    const startDate = moment(data.desde);
    const endDate = moment(data.hasta);

    const dataCalendar: EventInput[] = [];

    const { lunes, martes, miercoles, jueves, viernes, sabado } = data.opciones;

    while (startDate <= endDate) {
      const weekDay = startDate.weekday();

      if (weekDay === 1 && lunes) {
        lunes.forEach((opcion, index) => {
          opcion.horario !== '' && dataCalendar.push(getDisponibilityDay(opcion.horario, index, startDate, 'lunes'));
        });
      }

      if (weekDay === 2 && martes) {
        martes.forEach((opcion, index) => {
          opcion.horario !== '' && dataCalendar.push(getDisponibilityDay(opcion.horario, index, startDate, 'martes'));
        });
      }

      if (weekDay === 3 && miercoles) {
        miercoles.forEach((opcion, index) => {
          opcion.horario !== '' &&
            dataCalendar.push(getDisponibilityDay(opcion.horario, index, startDate, 'miercoles'));
        });
      }

      if (weekDay === 4 && jueves) {
        jueves.forEach((opcion, index) => {
          opcion.horario !== '' && dataCalendar.push(getDisponibilityDay(opcion.horario, index, startDate, 'jueves'));
        });
      }

      if (weekDay === 5 && viernes) {
        viernes.forEach((opcion, index) => {
          opcion.horario !== '' && dataCalendar.push(getDisponibilityDay(opcion.horario, index, startDate, 'viernes'));
        });
      }

      if (weekDay === 6 && sabado) {
        sabado.forEach((opcion, index) => {
          opcion.horario !== '' && dataCalendar.push(getDisponibilityDay(opcion.horario, index, startDate, 'sabado'));
        });
      }

      startDate.add(1, 'day');
    }
    return dataCalendar;
  }
  return [];
};

const reducer = (state: IStateReducer, action: ActionReducer) => {
  switch (action.type) {
    case 'get_intervals_time': {
      return {
        ...state,
      };
    }
    case 'get_disponibility': {
      return {
        disponibility: state.disponibility,
      };
    }
    case 'set_disponibility': {
      return {
        dataCalendar: setDataCalendar(action.payload?.disponibility),
      };
    }
  }
};

interface IDisponibilityContext {
  state: IStateReducer;
  dispatch: Dispatch<ActionReducer>;
}

export const DisponibilityContext = createContext<IDisponibilityContext>({ state: initialState, dispatch: e => e });

const DisponibilityProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <DisponibilityContext.Provider value={{ state, dispatch }}>{children}</DisponibilityContext.Provider>;
};

export default DisponibilityProvider;
