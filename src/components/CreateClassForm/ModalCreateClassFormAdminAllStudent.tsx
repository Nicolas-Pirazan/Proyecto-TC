'use client';

import { useAssignClass, useGetDisponibilities, useGetStudentsAssigning } from '@/api/schedule';
import { EventInput } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Button, TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const ModalCreateClassFormAdminAllStudent = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
    const { data: eventos } = useGetDisponibilities();
    const { data: estudiantes } = useGetStudentsAssigning();
    const options = estudiantes?.entity || [];
    const { mutate, isLoading } = useAssignClass();
    const [agendaEstudiante, setAgendaEstudiante] = React.useState<EventInput[]>([]);
    const [selectedEvents, setSelectedEvents] = React.useState<Set<string>>(new Set());
    const [selectedStudent, setSelectedStudent] = React.useState<number | null>(null);
    const [remainingClasses, setRemainingClasses] = React.useState<number>(0);

    React.useEffect(() => {
        if (eventos && eventos.entity != null) {
            const events: EventInput[] = eventos.entity.map(evento => ({
                id: String(evento.consecutivo_agenda),
                title: evento.profesor,
                start: evento.fecha_hora_inicio_clase,
                end: evento.fecha_hora_fin_clase,
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
        if (selectedStudent === null) {
            clearSelections();
        }
    }, [selectedStudent]);

    const handleEventClick = (clickInfo: any) => {
        if (selectedStudent === null) {
            alert('Seleccione un estudiante antes de seleccionar las clases.');
            return;
        }

        const eventId = clickInfo.event.id;
        const newSelectedEvents = new Set(selectedEvents);
        const isOccupied = clickInfo.event.extendedProps.estudiante != 0;

        if (!isOccupied && remainingClasses > 0) {
            if (newSelectedEvents.has(eventId)) {
                newSelectedEvents.delete(eventId);
                setRemainingClasses(remainingClasses + 1);
            } else {
                newSelectedEvents.add(eventId);
                setRemainingClasses(remainingClasses - 1);
            }
            setSelectedEvents(newSelectedEvents);
        } else if (isOccupied) {
            alertOccupiedEvent(eventId);
        } else {
            alert('Has alcanzado el límite máximo de clases.');
        }
    };

    const handleAssignClasses = () => {
        if (!selectedStudent) {
            alert('Por favor seleccione un estudiante');
            return;
        }

        const classIds = Array.from(selectedEvents).map((classId) => parseInt(classId));

        const payload = {
            consecutivo_curso_estudiante: selectedStudent,
            listado_disponibilidad: classIds,
            usuario_creacion: 'Administrador',
        };

        mutate(payload, {
            onSuccess: () => {
                alert('Clases asignadas correctamente');
                handleClose();
            },
            onError: (error: unknown) => {
                if (error instanceof Error) {
                    alert('Error al asignar clases: ' + error.message);
                } else {
                    alert('Error desconocido al asignar clases');
                }
            }
        });
    };

    const clearSelections = () => {
        setSelectedEvents(new Set());
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
        const isSelected = selectedEvents.has(eventId);
        return {
            border: '1px solid #ccc',
            padding: '10px',
            margin: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s, border 0.3s',
            borderRadius: '8px',
            backgroundColor: isOccupied ? '#fff' : isSelected ? '#a9e9a4' : '#fff',
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
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative', backgroundColor: '#1976d2' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Asignar clases a estudiantes
                        </Typography>
                        <Button
                            autoFocus
                            style={{
                                backgroundColor: '#2196f3',
                                color: '#fff',
                                padding: '6px 16px',
                                borderRadius: '4px',
                                textTransform: 'none',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                            }}
                            onClick={handleAssignClasses}
                        >
                            Asignar
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box sx={{ padding: 3 }}>
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => `${option.estudiante}`}
                        onChange={(event, newValue) => {
                            setSelectedStudent(newValue ? newValue.id_curso_estudiante : null);
                            clearSelections(); 
                            setRemainingClasses(newValue ? newValue.cantidad_clases : 0);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Seleccionar Estudiante"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                            />
                        )}
                    />
                    <Typography variant="body2" color="textSecondary">
                        Clases restantes: {remainingClasses}
                    </Typography>
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
        </>
    );
};

export default ModalCreateClassFormAdminAllStudent;