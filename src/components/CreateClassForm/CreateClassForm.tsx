
import { useCreateClassForm } from '@/hooks/useCreateClassForm';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import AlertNotification from '../Alert';
import Spinner from '../Spinner';

const CreateClassForm = ({ idCursoEstudiante }: { idCursoEstudiante: number }) => {

    const { handleDates,
        handleEventClick,
        onSubmit,
        selectedEvents,
        agendaEstudiante,
        cargandoData,
        showAlert,
        setShowAlert,
        guardandoData,
        guardandoDataError,
        guardandoDataSuccess } = useCreateClassForm(idCursoEstudiante);
        
    const eventContent = (arg: any) => {
        const isSelected = selectedEvents.includes(arg.event.id);
        const backgroundColor = isSelected ? '#33cc33' : '';

        return (
            <>
                <div style={{
                    backgroundColor, borderColor: backgroundColor,
                    borderRadius: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    paddingTop: '2px',
                    paddingBottom: '2px'
                }}>
                    {arg.timeText && <div>{arg.timeText}</div>}
                    <div>{arg.event.title}</div>
                </div >
            </>
        );
    };

    return (
        <>
            <style>
                {`
                    .selected-event {
                    background-color: yellow;}`
                }
            </style>

            <Grid container spacing={2} padding={3}>

                <Grid item xs={12}>
                    <Paper
                        sx={{ padding: 4, borderRadius: 2, minHeight: '100%', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
                        variant="outlined"
                    >
                        <Typography variant="h5" color="primary" fontWeight={600} mb={2}>
                            Filtros:
                        </Typography>
                        <Box padding={'0 0 20px 0'} display={'flex'}>
                            <Typography fontWeight={'600'} marginRight={1}>
                                Instructor:
                            </Typography>
                            {/* <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label"></InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={age}
                                    label="Age"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={0}>Todos</MenuItem>
                                    <MenuItem value={1}>Profesor 1</MenuItem>
                                    <MenuItem value={2}>Profesor 2</MenuItem>
                                </Select>
                            </FormControl> */}

                        </Box>
                        <Box padding={'0 0 20px 0'} display={'flex'}>
                            <Typography fontWeight={'600'} marginRight={1}>
                                Horario:
                            </Typography>
                            {/* <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label"></InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={age}
                                    label="Age"
                                    onChange={handleChange}
                                >

                                    <MenuItem value={0}>08:20 - 09:00 </MenuItem>
                                    <MenuItem value={1}>09:10 - 09:50</MenuItem>
                                    <MenuItem value={2}>10:00 - 10:45</MenuItem>
                                </Select>
                            </FormControl> */}

                        </Box>



                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper
                        sx={{ padding: 4, borderRadius: 2, minHeight: '100%', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
                        variant="outlined"
                    >
                        <Typography variant="h5" color="primary" fontWeight={600} mb={2}>
                            Registro de clases:
                        </Typography>
                        <Box padding={'0 0 20px 0'} display={'flex'}>
                            <Typography fontWeight={'600'} marginRight={1}>
                                Cantidad de clases del curso: 12
                            </Typography>
                        </Box>
                        <Box padding={'0 0 20px 0'} display={'flex'}>
                            <Typography fontWeight={'600'} marginRight={1}>
                                Clases registradas: 2
                            </Typography>
                        </Box>
                        <Box padding={'0 0 20px 0'} display={'flex'}>
                            <Typography fontWeight={'600'} marginRight={1}>
                                Clases disponibles para registrar: 10
                            </Typography>
                        </Box>
                        <Box padding={'0 0 20px 0'} display={'flex'}>
                            <Typography fontWeight={'600'} marginRight={1}>
                                Clases aprobadas: 0
                            </Typography>
                        </Box>
                        <Box>
                            <Typography fontWeight={'600'} marginRight={1}>
                                Registros seleccionados :{selectedEvents.length}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper
                        sx={{ padding: 4, borderRadius: 2, minHeight: '100%', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
                        variant="outlined"
                    >

                        <Button onClick={() => onSubmit()} variant="contained" sx={{ textTransform: 'capitalize' }}>
                            Asignar clases
                        </Button>
                        <FullCalendar
                            // plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
                            plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
                            initialView="listWeek"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'listWeek',
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
                            dayMaxEventRows={6}
                            locale={esLocale}
                            selectable={true}
                            eventClick={(selected) => { handleEventClick(selected); }}
                            events={agendaEstudiante}
                            datesSet={handleDates}
                            eventContent={eventContent}
                            height={'calc(100vh - 120px)'}

                        />

                    </Paper>
                </Grid>

            </Grid>



            <AlertNotification
                key="alerta-guardado-exitoso"
                isOpen={showAlert && guardandoDataSuccess}
                onClose={() => setShowAlert(false)}
                severity="success"
                message="¡Disponibilidad asignada con éxito!"
            />

            <AlertNotification
                key="alerta-error-guardado"
                isOpen={showAlert && guardandoDataError}
                onClose={() => setShowAlert(false)}
                severity="error"
                message="¡Ocurrió un error al asignar la disponibilidad!"
            />
            <Spinner isOpen={cargandoData || guardandoData} />

        </>

    );



};

export default CreateClassForm;
