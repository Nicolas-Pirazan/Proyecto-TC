'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';

import { DisponibilityContext } from '@/context/useDisponibility';
import { useContext } from 'react';

const Calendar = () => {
  const { state } = useContext(DisponibilityContext);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: '',
      }}
      locale={esLocale}
      eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
      }}
      titleFormat={{ year: 'numeric', month: '2-digit', day: '2-digit' }}
      allDaySlot={false}
      slotLabelFormat={{
        hour: '2-digit',
        minute: '2-digit',
        omitZeroMinute: false,
        // hourCycle: 'h24',
      }}
      slotDuration={'00:40:00'}
      slotMinTime={'08:20:00'}
      slotMaxTime={'21:00:00'}
      // eventClick={e => (e.event._def.interactive ? console.log('CLICK: ', e.event.id) : null)}
      events={state.dataCalendar}
      height={'auto'}
      // height={'calc(100vh - 112px)'}
      stickyHeaderDates
      hiddenDays={[0]}
    />
  );
};

export default Calendar;

// events={[
//         {
//           id: 'a',
//           start: '2024-01-11T08:20:00',
//           end: '2024-01-11T09:00:00',
//           // color: 'green',
//           allDay: false,
//           editable: false,
//         },
//         {
//           id: 'b',
//           // title: 'Profesor 2',
//           start: '2024-01-11T09:10:00',
//           end: '2024-01-11T09:50:00',
//           // color: 'green',
//           allDay: false,
//           editable: false,
//           // interactive: true,
//         },
//       ]}
