import { useRescheduleOrCancelClass } from '@/api/schedule';
import { RescheduleOrCancelClass } from '@/types/schedule';
import { Alert, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface CancelClassFormProps {
    idClase: number;
    idCursoEstudiante: number;
    idEstudiante: number;
    fechaHoraInicio: string;
    onClose: () => void;
}

const CancelClassForm = ({
    idClase,
    idCursoEstudiante,
    idEstudiante,
    fechaHoraInicio,
    onClose
}: CancelClassFormProps) => {
    const [comentario, setComentario] = useState('');
    const [canCancel, setCanCancel] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');
    const { mutate, isLoading, isSuccess, isError, error } = useRescheduleOrCancelClass();

    useEffect(() => {
        const checkCancellationTime = () => {
            const classDate = new Date(fechaHoraInicio);
            const now = new Date();
            const diffInHours = (classDate.getTime() - now.getTime()) / (1000 * 60 * 60);

            if (diffInHours >= 24) {
                setCanCancel(true);
                const hours = Math.floor(diffInHours);
                const minutes = Math.floor((diffInHours - hours) * 60);
                setTimeRemaining(`${hours} horas y ${minutes} minutos`);
            } else {
                setCanCancel(false);
                setTimeRemaining('Menos de 24 horas');
            }
        };

        checkCancellationTime();
        const interval = setInterval(checkCancellationTime, 60000);

        return () => clearInterval(interval);
    }, [fechaHoraInicio]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!canCancel) {
            return;
        }

        if (!comentario.trim()) {
            alert('Por favor ingrese un comentario para la cancelación');
            return;
        }

        const cancelData: RescheduleOrCancelClass = {
            accion: 2,
            consecutivo_curso_estudiante: idCursoEstudiante,
            id_clase: idClase,
            id_agenda: 0,
            comentario: comentario.trim(),
            fecha_hora_solicitud: new Date(),
            usuario_modificacion: `estudiante_${idEstudiante}`
        };

        mutate(cancelData);
    };

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 2000);
        }
    }, [isSuccess, onClose]);

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            Cancelación de Clase
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Clase programada: {formatDateTime(fechaHoraInicio)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Alert severity={canCancel ? 'info' : 'warning'}>
                            {canCancel
                                ? `Tiempo restante para cancelar: ${timeRemaining}`
                                : 'No se puede cancelar esta clase. El tiempo mínimo de anticipación es de 24 horas.'
                            }
                        </Alert>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Condiciones para cancelar una clase:
                        </Typography>
                        <Typography variant="body2" component="div">
                            <ul>
                                <li>
                                    El tiempo de anticipación para una cancelación son 24 horas
                                </li>
                                <li>
                                    Si no se cumple este tiempo, el sistema tomará como perdida la clase
                                </li>
                                <li>
                                    Debe proporcionar un motivo de cancelación
                                </li>
                            </ul>
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Motivo de la cancelación"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            required
                            disabled={!canCancel}
                            placeholder="Ingrese el motivo por el cual desea cancelar esta clase..."
                        />
                    </Grid>

                    {isSuccess && (
                        <Grid item xs={12}>
                            <Alert severity="success">
                                La clase ha sido cancelada exitosamente.
                            </Alert>
                        </Grid>
                    )}

                    {isError && (
                        <Grid item xs={12}>
                            <Alert severity="error">
                                Error al cancelar la clase: {(error as any)?.message || 'Error desconocido'}
                            </Alert>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Box display="flex" gap={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="error"
                                disabled={!canCancel || isLoading || !comentario.trim()}
                            >
                                {isLoading ? 'Cancelando...' : 'Confirmar Cancelación'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default CancelClassForm;