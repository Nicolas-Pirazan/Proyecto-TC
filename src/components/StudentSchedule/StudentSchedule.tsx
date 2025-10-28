import { useGetStudentAssignClasses } from '@/api/schedule';
import { StudentAssignClasses } from '@/types/schedule';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Box, Button, Collapse, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';
import ModalCancelForm from '../RescheduleOrCancelClassForm/ModalCancelForm';
import FullScreenDialog from '../RescheduleOrCancelClassForm/ModalRescheduleForm';
import Spinner from '../Spinner';

const StudentSchedule = ({ id_estudiante }: { id_estudiante: number }) => {
    const { data, isLoading } = useGetStudentAssignClasses(id_estudiante.toString());
    const [expandedForm, setExpandedForm] = useState<{ rowId: number | null, formId: number | null }>({ rowId: null, formId: null });

    const handleExpand = (rowId: number, formId: number | null) => {
        setExpandedForm((prev) =>
            prev.rowId === rowId && prev.formId === formId
                ? { rowId: null, formId: null }
                : { rowId, formId }
        );
    };

    const getFormContent = (item: StudentAssignClasses, formId: number) => {
        switch (formId) {
            case 0:
                return (
                    <div>
                        <p>Detalles de la clase seleccionado</p>
                        <p>Fecha: {item.fecha_hora_inicio_clase}</p>
                        <p>Profesor: {item.profesor}</p>
                    </div>
                );
            case 1:
                return (
                    <Box p={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <p>Para reprogramar una clase tenga en cuenta lo siguiente:</p>
                            </Grid>
                            <Grid item xs={12}>
                                <li> El plazo máximo para la nueva asignación es de 3 meses </li>
                                <li>El tiempo de anticipación para una cancelación son 24 horas, si no se cumple este
                                    tiempo el sistema tomará como perdida la clase
                                </li>
                            </Grid>
                            <Grid item xs={12}>
                                <FullScreenDialog 
                                    buttonText='Continuar con la reprogramación'
                                    idClase={item.id_clase}
                                    idCursoEstudiante={item.consecutivo_curso_estudiante}
                                    idEstudiante={id_estudiante}
                                    fechaHoraInicio={item.fecha_hora_inicio_clase}
                                    fechaHoraFin={item.fecha_hora_fin_clase}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );
            case 2:
                return (
                    <Box p={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <p>Para cancelar una clase tenga en cuenta lo siguiente:</p>
                            </Grid>
                            <Grid item xs={12}>
                                <li>El tiempo de anticipación para una cancelación son 24 horas, si no se cumple este
                                    tiempo el sistema tomará como perdida la clase
                                </li>
                            </Grid>
                            <Grid item xs={12}>
                                <ModalCancelForm 
                                    buttonText='Continuar con la cancelación'
                                    idClase={item.id_clase}
                                    idCursoEstudiante={item.consecutivo_curso_estudiante}
                                    idEstudiante={id_estudiante}
                                    fechaHoraInicio={item.fecha_hora_inicio_clase}
                                    fechaHoraFin={item.fecha_hora_fin_clase}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Inicio</TableCell>
                            <TableCell>Fin</TableCell>
                            <TableCell>Profesor</TableCell>
                            <TableCell>Estado de la clase</TableCell>
                            <TableCell>Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.entity.map((item, index) => (
                            <>
                                <TableRow key={item.id_clase}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.fecha_hora_inicio_clase}</TableCell>
                                    <TableCell>{item.fecha_hora_fin_clase}</TableCell>
                                    <TableCell>{item.profesor}</TableCell>
                                    <TableCell>{item.estado_clase}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleExpand(item.id_clase, 0)}>Detalle</Button>
                                        <Button onClick={() => handleExpand(item.id_clase, 1)}>Reprogramar</Button>
                                        <Button onClick={() => handleExpand(item.id_clase, 2)}>Cancelar clase</Button>
                                    </TableCell>
                                </TableRow>
                                {[0, 1, 2].map((formId) => (
                                    <TableRow key={`${item.id_clase}-${formId}`}>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={expandedForm.rowId === item.id_clase && expandedForm.formId === formId} timeout="auto" unmountOnExit>
                                                <Box margin={1}>
                                                    <Box display="flex" justifyContent="flex-end" marginTop={2}>
                                                        <IconButton
                                                            onClick={() => handleExpand(item.id_clase, null)}
                                                            color="secondary"
                                                            className={expandedForm.rowId === item.id_clase && expandedForm.formId === formId ? 'css-1goum42 active' : 'css-1goum42'}
                                                        >
                                                            <ExpandLessIcon />
                                                        </IconButton>
                                                    </Box>
                                                    <div>
                                                        {getFormContent(item, formId)}
                                                    </div>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Spinner isOpen={isLoading} />
        </>
    );
};

export default StudentSchedule;