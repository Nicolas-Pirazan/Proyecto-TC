import Spinner from '@/components/Spinner';
import { useRescheduleOrCancelClassForm } from '@/hooks/useRescheduleOrCancelClassForm';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import React from 'react';
import 'react-calendar/dist/Calendar.css';
import AlertNotification from '../Alert';


const RescheduleOrCancelClassForm = ({ idClase, idCursoEstudiante, idEstudiante }: { idClase: number, idCursoEstudiante: number, idEstudiante: number }) => {

    const {
        cargandoDiasDisponibles, today, maxDate, shouldDisableDate, handleMonthChangeComplete,
        handleDateChange, isTileDisabled, handleMonthChange,
        handleNavigationLabelClick, selectedDate, disponibilityXDate,
        isSelected, handleSelectDisponibilidad, selectedDisponibilidad,
        guardar, cargandoDisponibilidadesXDia, guardandoRegistro, showAlert,
        setShowAlert, guardadoExitoso, errorGuardado
    } = useRescheduleOrCancelClassForm({ idClase, idCursoEstudiante, idEstudiante });

    return (
        <div>
            {/* <FullScreenDialog></FullScreenDialog> */}
            <h1>Calendario</h1>

            {/* Renderizar el calendario */}
            {cargandoDiasDisponibles ? (
                <p>Cargando...</p> // Mensaje de carga mientras se obtienen los datos
            ) : (


                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DateCalendar
                        value={selectedDate}
                        onChange={handleDateChange}
                        views={['day']}
                        minDate={today}
                        maxDate={maxDate}
                        shouldDisableDate={shouldDisableDate}
                        onMonthChange={(month: Date) => handleMonthChange(month)}
                    />
                </LocalizationProvider>
            )}
            {selectedDate && (
                <>
                    <p>Fecha seleccionada: {selectedDate.toLocaleDateString()}</p>

                </>
            )}

            {disponibilityXDate.length > 0 && <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Profesor</TableCell>
                            <TableCell>Inicio</TableCell>
                            <TableCell>Fin</TableCell>
                            <TableCell>Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {disponibilityXDate.map((item, index) => (
                            <React.Fragment key={index} >

                                <TableRow key={index} style={{ backgroundColor: isSelected(item) ? '#33cc33' : 'transparent' }}>

                                    <TableCell>{item.id_disponibilidad}</TableCell>
                                    <TableCell>{item.profesor}</TableCell>
                                    <TableCell>{item.fecha_hora_inicio_clase}</TableCell>
                                    <TableCell>{item.fecha_hora_fin_clase}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleSelectDisponibilidad(item)}>Seleccionar</Button>
                                    </TableCell>
                                </TableRow>

                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            }
            {selectedDisponibilidad && (
                <>


                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4, justifyContent: 'space-between' }}>

                        {/* <Button type="button" variant="outlined" sx={{ textTransform: 'capitalize' }}>
                                Volver
                            </Button> */}

                        <Button onClick={() => guardar()} variant="contained" sx={{ textTransform: 'capitalize' }}>
                            Guardar
                        </Button>
                    </Box>

                </>
            )}

            <Spinner isOpen={cargandoDiasDisponibles || cargandoDisponibilidadesXDia || guardandoRegistro} />
            <AlertNotification
                key="alerta-guardado-exitoso"
                isOpen={showAlert && guardadoExitoso}
                onClose={() => setShowAlert(false)}
                severity="success"
                message="¡Clase reasignada con éxito!"
            />

            <AlertNotification
                key="alerta-error-guardado"
                isOpen={showAlert && errorGuardado}
                onClose={() => setShowAlert(false)}
                severity="error"
                message="¡Ocurrió un error al reasignar la clase!"
            />
        </div>
    );
};

export default RescheduleOrCancelClassForm;
