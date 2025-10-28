import { useAssignClass, useGetStudentSchedule } from '@/api/schedule';
import { AgendaAsignacionClases, IAssingClass, ParametrosAgendaDto } from '@/types/schedule';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import { useEffect, useState } from 'react';
export const useCreateClassForm = (idCursoEstudiante: number) => {

    const [showAlert, setShowAlert] = useState(true);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const { mutate: saveClass, isLoading: guardandoData , isError:guardandoDataError, isSuccess:guardandoDataSuccess } = useAssignClass();
    const { data, mutate, isLoading: cargandoData } = useGetStudentSchedule(String(idCursoEstudiante));
    const [agendaEstudiante, setAgendaEstudiante] = useState<EventInput[]>([]);
    const [currentRange, setCurrentRange] = useState({ start: '', end: '' });

    useEffect(() => {
        if (currentRange.start != '' && currentRange.end != '') {
            getAgendaEstudiante(currentRange.start, currentRange.end, 2);
        }
    }, [currentRange]);

    useEffect(() => {
        if (data?.entity) {
            setAgendaEstudiante(createEventList(data.entity));
            getEventsSelected(data.entity);
        }
    }, [data]);

    const handleDates = (arg: any) => {

        const start: string = arg.start.toISOString().split('T')[0];
        const end: string = arg.end.toISOString().split('T')[0];

        setCurrentRange({ start, end });

    };

    const getEventsSelected = (events: AgendaAsignacionClases[]) => {
        const selectedEventIds = events
            .filter(event => event.clase_asignada === true)
            .map(event => event.consecutivo_asignacion_detalle.toString());

        const newEventIds = selectedEventIds.filter(eventId => !selectedEvents.includes(eventId));

        if (newEventIds.length > 0) {
            setSelectedEvents(prevArray => [...prevArray, ...newEventIds]);
        }

        console.log(selectedEvents);
    };

    const getAgendaEstudiante = (start: string, end: string, id_estudiante: number) => {

        const params: ParametrosAgendaDto = {
            fecha_ini: start,
            fecha_fin: end,
            id_estudiante: id_estudiante,
        };
        mutate(params);
        console.log(agendaEstudiante);
        if (data?.entity) {
            setAgendaEstudiante(createEventList(data?.entity));
        }
    };

    const handleEventClick = (info: EventClickArg) => {
        //valida que no se seleccione registros pasados , validar front y back
        if (!info.event.start) {
            alert('Error: La fecha del evento no es válida.');
            return;
        }

        const eventDate = new Date(info.event.start);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignora la hora, compara solo la fecha

        if (eventDate < today) {
            alert('No se pueden seleccionar eventos de fechas pasadas.');
            return;
        }

        console.log(selectedEvents);
        const eventId = info.event.id;
        const clickedEvent = selectedEvents.find(event => event === eventId);

        if (!clickedEvent) {
            setSelectedEvents(prevArray => [...prevArray, eventId]);

        } else {
            const updatedEvents = selectedEvents.filter(event => event !== eventId);
            setSelectedEvents(updatedEvents);

        }
        console.log(selectedEvents);
    };

    const createEventList = (data: AgendaAsignacionClases[]) => {
        const calendarEvents: EventInput[] = data.map(evento => {
            const eventoTemp: EventInput = {
                id: String(evento.consecutivo_asignacion_detalle),
                title: evento.profesor + ' ' + evento.consecutivo_asignacion_detalle,
                start: evento.fecha_hora_inicio_clase,
                end: evento.fecha_hora_fin_clase,
                allDay: false,
                editable: true,
                interactive: true,
                groupId: String(evento.fecha_hora_inicio_clase)

            };
            return eventoTemp;
        }); return calendarEvents;
    };

    const onSubmit = () => {
        const data: IAssingClass = {
            consecutivo_curso_estudiante: idCursoEstudiante,
            listado_disponibilidad: selectedEvents.map(event => parseInt(event)),
            usuario_creacion: 'OSCAR',
        };
        saveClass(data);

        if (!guardandoData) {
            setShowAlert(true);
        }
    };


    return {
        handleDates,
        handleEventClick,
        onSubmit,
        selectedEvents,
        agendaEstudiante,
        cargandoData,
        showAlert,
        setShowAlert,
        guardandoData,
        guardandoDataError, 
        guardandoDataSuccess
    };
};


