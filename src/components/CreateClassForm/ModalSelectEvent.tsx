'use client';

import { useGetDisponibilities, useRescheduleOrCancelClass } from '@/api/schedule';
import { CalendarSelectedEvent } from '@/types/calendar';
import { RescheduleOrCancelClass } from '@/types/schedule';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Slide, TextField, Toolbar, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';

interface ModalProps {
    open: boolean;
    handleClose: () => void;
    selectedEvent: CalendarSelectedEvent;
    consecutivo_curso_estudiante: number;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const ModalReassignClass = ({ open, handleClose, selectedEvent, consecutivo_curso_estudiante }: ModalProps) => {
    const { data: eventos } = useGetDisponibilities();
    const [agendaEstudiante, setAgendaEstudiante] = React.useState<EventInput[]>([]);
    const { mutate: rescheduleOrCancelClass } = useRescheduleOrCancelClass();

    const [confirmReassignOpen, setConfirmReassignOpen] = React.useState(false);
    const [reassignComment, setReassignComment] = React.useState('');
    const [selectedIdAgenda, setSelectedIdAgenda] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (eventos) {
            const events: EventInput[] = eventos.entity.map(evento => ({
                id: String(evento.consecutivo_agenda),
                title: evento.profesor,
                start: new Date(evento.fecha_hora_inicio_clase),
                end: new Date(evento.fecha_hora_fin_clase),
                allDay: false,
                editable: false,
                groupId: String(evento.fecha_hora_inicio_clase),
                profesor: evento.profesor,
                estudiante: evento.estudiante,
            }));
            setAgendaEstudiante(events);
        }
    }, [eventos]);

    React.useEffect(() => {
        return () => {
            clearSelections();
        };
    }, []);

    const handleEventClick = (clickInfo: EventClickArg) => {
        const isOccupied = clickInfo.event.extendedProps.estudiante != 0;
        if (isOccupied) {
            alertOccupiedEvent(clickInfo.event.id);
            return;
        }

        setSelectedIdAgenda(Number(clickInfo.event.id));
        setConfirmReassignOpen(true); // Abrir la ventana de confirmación
    };

    const handleConfirmReassign = () => {
        if (!selectedIdAgenda) return;

        const dataClass: RescheduleOrCancelClass = {
            accion: 1,
            consecutivo_curso_estudiante: consecutivo_curso_estudiante,
            id_clase: selectedEvent.id_clase,
            id_agenda: selectedIdAgenda,
            comentario: reassignComment,
            fecha_hora_solicitud: new Date(),
            usuario_modificacion: '',
        };

        rescheduleOrCancelClass(dataClass, {
            onSuccess: () => {
                handleClose();
                alert('Reasignación exitosa');
            },
            onError: () => {
                alert('Error al reasignar la clase');
            }
        });
        
        setConfirmReassignOpen(false);
    };

    const clearSelections = () => {
        setAgendaEstudiante([]);
        setSelectedIdAgenda(null);
    };

    const alertOccupiedEvent = (eventId: string) => {
        const eventElement = document.getElementById(`event-${eventId}`);
        if (eventElement) {
            eventElement.style.backgroundColor = '#ffcccc';
            setTimeout(() => {
                eventElement.style.backgroundColor = '#fff';
            }, 1000);
        }
    };

    const getEventStyle = (eventId: string, isOccupied: boolean) => {
        return {
            border: '1px solid #ccc',
            padding: '10px',
            margin: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s, border 0.3s',
            borderRadius: '8px',
            backgroundColor: isOccupied ? '#fff' : '#fff',
        };
    };

    const renderEventContent = (eventInfo: any) => {
        const { profesor, estudiante } = eventInfo.event.extendedProps;
        const color = estudiante ? '#ffa500' : '#3788d8';

        return (
            <Box
                id={`event-${eventInfo.event.id}`}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    ...getEventStyle(eventInfo.event.id, estudiante != 0),
                }}
            >
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
                    <Typography variant="body2" style={{ fontSize: '0.9em', color: '#333' }}>
                        {eventInfo.timeText}
                    </Typography>
                    <Typography variant="body2" style={{ fontSize: '1em', fontWeight: 'bold', color: '#333', marginLeft: '0.5em' }}>
                        {profesor}
                    </Typography>
                </Box>
                <Typography variant="body2" style={{ fontSize: '1em', color: '#555', marginLeft: '1.5em' }}>
                    {estudiante}
                </Typography>
            </Box>
        );
    };

    return (
        <>
            <Dialog
                fullScreen
                open={open}
                onClose={() => {
                    clearSelections();
                    handleClose();
                }}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => {
                                clearSelections();
                                handleClose();
                            }}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Reasignar clase
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ padding: 3 }}>
                    <FullCalendar
                        plugins={[listPlugin]}
                        initialView="listWeek"
                        locale={esLocale}
                        events={agendaEstudiante}
                        eventClick={handleEventClick}
                        eventContent={renderEventContent}
                        eventBackgroundColor='#fff'
                    />
                </Box>
            </Dialog>

            <Dialog open={confirmReassignOpen} onClose={() => setConfirmReassignOpen(false)}>
                <DialogTitle>Confirmar Reasignación</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Comentario (Opcional)"
                        multiline
                        rows={4}
                        value={reassignComment}
                        onChange={(e) => setReassignComment(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                        <Button onClick={() => setConfirmReassignOpen(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={handleConfirmReassign}>
                            Confirmar Reasignación
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ModalReassignClass;
