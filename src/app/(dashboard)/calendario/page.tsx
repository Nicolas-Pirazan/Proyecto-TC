'use client';

import { useGetDisponibilities } from '@/api/schedule';
import { useGetUsers } from '@/api/users';
import ModalCreateClassFormAdminAllStudent from '@/components/CreateClassForm/ModalCreateClassFormAdminAllStudent';
import ModalCreateClassFormAdminOneStudent from '@/components/CreateClassForm/ModalCreateClassFormAdminOneStudent';
import { CalendarSelectedEvent } from '@/types/calendar';
import { CalendarApi, EventClickArg, EventInput } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Autocomplete, Box, Button, Grid, Paper, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

interface CalendarEventInput extends EventInput {
  profesor: string;
  estudiante: string;
}

const CalendarPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarSelectedEvent | null>(null);
  const [eventList, setEventList] = useState<EventInput[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(null);
  const [timeRangeFilter, setTimeRangeFilter] = useState<string | null>(null);
  const [selectedProfesor, setSelectedProfesor] = useState<number | null>(null);
  const [selectedEstudiante, setSelectedEstudiante] = useState<number | null>(null);
  const { data: profesoresData } = useGetUsers({ idRol: 4 });
  const { data: estudiantesData } = useGetUsers({ idRol: 5 });

  const calendarRef = useRef<FullCalendar>(null);

  const getVisibleDateRange = (calendarApi: CalendarApi) => {
    const start = calendarApi.view.currentStart;
    const end = calendarApi.view.currentEnd;
    return { fecha_ini: start, fecha_fin: end };
  };

  const filters = {
    IdProfesor: selectedProfesor,
    IdEstudiante: selectedEstudiante,
    Horario: timeRangeFilter,
    ClaseDisponible: availabilityFilter === 'available' ? 2 : availabilityFilter === 'not_available' ? 1 : null,
    FechaIni: calendarRef.current ? getVisibleDateRange(calendarRef.current.getApi()).fecha_ini : undefined,
    FechaFin: calendarRef.current ? getVisibleDateRange(calendarRef.current.getApi()).fecha_fin : undefined,
  };

  const { data, refetch } = useGetDisponibilities(filters);

  useEffect(() => {
    if (data && data.entity != null) {
      const events: CalendarEventInput[] = data.entity.map(evento => {
        return {
          id: String(evento.consecutivo_agenda),
          title: evento.profesor,
          start: evento.fecha_hora_inicio_clase,
          end: evento.fecha_hora_fin_clase,
          allDay: false,
          editable: false,
          groupId: String(evento.fecha_hora_inicio_clase),
          profesor: evento.profesor,
          estudiante: evento.estudiante,
          id_agenda: evento.consecutivo_agenda,
          id_clase: evento.consecutivo_clase
        };
      });
      setEventList(events);
    }
  }, [data]);

  useEffect(() => {
    if (calendarRef.current) {
      refetch();
    }
  }, [selectedProfesor, selectedEstudiante, timeRangeFilter, availabilityFilter]);

  const handleEventClick = (selected: EventClickArg) => {
    setSelectedEvent({
      id: selected.event.id,
      start: selected.event.startStr,
      end: selected.event.endStr,
      title: selected.event.title,
      profesor: selected.event.extendedProps.profesor,
      estudiante: selected.event.extendedProps.estudiante,
      id_agenda: selected.event.extendedProps.id_agenda,
      id_clase: selected.event.extendedProps.id_clase
    });
    setModalOpen(true);

    if (calendarRef.current) {
      calendarRef.current.getApi().unselect();
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    refetch();
  };

  const handleCloseModal2 = () => {
    setModalOpen2(false);
    refetch();
  };

  const handleAvailabilityChange = (event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    if (newFilter !== null) {
      setAvailabilityFilter(newFilter);
    }
  };

  const handleTimeRangeChange = (event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    if (newFilter !== null) {
      setTimeRangeFilter(newFilter);
    }
  };

  const handleClearFilters = () => {
    setAvailabilityFilter(null);
    setTimeRangeFilter(null);
    setSelectedProfesor(null);
    setSelectedEstudiante(null);
  };

  const handleDatesSet = (arg: any) => {
    refetch();
  };

  const renderEventContent = (eventInfo: any) => {
    const { profesor, estudiante } = eventInfo.event.extendedProps;
    const color = estudiante ? '#ffa500' : '#3788d8';

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '4px', borderRadius: '4px', backgroundColor: '#f6f6f6', margin: '4px 0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: color,
              marginRight: '8px',
            }}
          />
          <Typography variant="body2" style={{ fontSize: '0.9em', color: '#333' }}>{eventInfo.timeText}</Typography>
          <Typography variant="body2" style={{ fontSize: '1em', fontWeight: 'bold', color: '#333', marginLeft: '0.5em' }}>{profesor}</Typography>
        </Box>
        <Typography variant="body2" style={{ fontSize: '1em', color: '#555', marginLeft: '1.5em' }}>{estudiante}</Typography>
      </Box>
    );
  };

  return (
    <>
      <Grid container spacing={2} padding={3}>
        <Grid item xs={12}>
          <Paper
            sx={{ padding: 4, borderRadius: 2, minHeight: '100%', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
            variant="outlined"
          >
            <Typography variant="h5" color="primary" fontWeight={600} mb={2}>
              Filtros
              <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 5 }}>
                <Box sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#ffa500',
                  display: 'inline-block',
                  mr: 1,
                }} />
                <Typography variant="body2" color="textSecondary" sx={{ mr: 2 }}>
                  Clases no disponibles
                </Typography>
                <Box sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#3788d8',
                  display: 'inline-block',
                  mr: 1,
                }} />
                <Typography variant="body2" color="textSecondary">
                  Clases disponibles
                </Typography>
              </Box>
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" color="textSecondary">Disponibilidad:</Typography>
                  <ToggleButtonGroup
                    value={availabilityFilter}
                    exclusive
                    onChange={handleAvailabilityChange}
                    aria-label="Disponibilidad de clases"
                  >
                    <ToggleButton value="not_available" aria-label="No Disponible">
                      No Disponibles
                    </ToggleButton>
                    <ToggleButton value="available" aria-label="Disponible">
                      Disponibles
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" color="textSecondary">Franja Horaria:</Typography>
                  <ToggleButtonGroup
                    value={timeRangeFilter}
                    exclusive
                    onChange={handleTimeRangeChange}
                    aria-label="Franja horaria"
                  >
                    <ToggleButton value="morning" aria-label="Mañana">
                      Mañana
                    </ToggleButton>
                    <ToggleButton value="afternoon" aria-label="Tarde">
                      Tarde
                    </ToggleButton>
                    <ToggleButton value="night" aria-label="Noche">
                      Noche
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <Button
                  variant="outlined"
                  sx={{ textTransform: 'capitalize', height: '40px' }}
                  onClick={handleClearFilters}
                >
                  Remover Filtros
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button variant="contained" sx={{ textTransform: 'capitalize', height: '40px' }} onClick={() => setModalOpen2(true)}>
                  + Asignar clase
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Autocomplete
                    options={profesoresData?.entity || []}
                    getOptionLabel={(option) => `${option.name} ${option.last_name}`}
                    onChange={(event, newValue) => setSelectedProfesor(newValue ? newValue.consecutive : null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filtrar por Profesor"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Autocomplete
                    options={estudiantesData?.entity || []}
                    getOptionLabel={(option) => `${option.name} ${option.last_name}`}
                    onChange={(event, newValue) => setSelectedEstudiante(newValue ? newValue.consecutive : null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filtrar por Estudiante"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Box sx={{ maxHeight: 'calc(100vh - 120px)' }}>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay listWeek',
              }}
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
              }}
              slotDuration={'00:15:00'}
              slotMinTime={'08:20:00'}
              slotMaxTime={'21:00:00'}
              dayMaxEventRows={12}
              locale={esLocale}
              selectable={true}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
              height={'calc(100vh - 120px)'}
              events={eventList}
              eventDisplay="block"
              eventMaxStack={3}
              eventOverlap={false}
              eventBackgroundColor=" #f6f6f6"
              eventBorderColor=' #f6f6f6'
              datesSet={handleDatesSet}
            />
          </Box>
        </Grid>
      </Grid>
      {selectedEvent && (
        <ModalCreateClassFormAdminOneStudent
          open={modalOpen}
          handleClose={handleCloseModal}
          selectedEvent={selectedEvent}
        />
      )}

      <ModalCreateClassFormAdminAllStudent
        open={modalOpen2}
        handleClose={handleCloseModal2}
      />
    </>
  );
};

export default CalendarPage;
