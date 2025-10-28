'use client';

import { useGetPaymentsByCursoEstudiante, useInsertPartialPayment } from '@/api/pagosYAbonos';
import { useGetUserCourse } from '@/api/users';
import { AppBarComponent as AppBar } from '@/components/AppBar';
import { IPayment, IPostPaymentPayload } from '@/types/paymentsAndFertilizers';
import { IUserCourse } from '@/types/users';
import { AccountBalance, AttachMoney, CreditCard, History, Payment, Receipt, School, TrendingUp } from '@mui/icons-material';
import {
    Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, FormControl, Grid, InputLabel, List, ListItem, ListItemIcon,
    ListItemText, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface UserInfo {
    consecutivo: number;
    nombre: string;
    apellido: string;
    roles: Array<{ consecutive: number; name: string }>;
    arbol_permisos: string;
}

interface PaymentFormData {
    valor: number;
    comentarios: string;
}

interface PageProps {
    params: {
        id_usuario: string;
    };
}

export default function StudentPaymentManagement({ params }: PageProps) {
    // Convertimos el string a number
    const studentId = parseInt(params.id_usuario, 10);
    
    const [selectedCourse, setSelectedCourse] = useState<IUserCourse | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    
    const { data: coursesResponse, isLoading: isLoadingCourses } = useGetUserCourse(studentId);
    const { data: paymentsResponse, isLoading: isLoadingPayments, refetch: refetchPayments } = useGetPaymentsByCursoEstudiante(
        selectedCourse?.id_student_course || 0
    );
    const insertPaymentMutation = useInsertPartialPayment();
    const { control, handleSubmit, reset, watch, formState: { errors, isValid } } = useForm<PaymentFormData>({
        mode: 'onChange',
        defaultValues: {
            valor: 0,
            comentarios: ''
        }
    });

    const watchedValor = watch('valor');

    useEffect(() => {
        if (isNaN(studentId)) {
            console.error('Invalid student ID');
        }
    }, [studentId]);

    useEffect(() => {
        const userInfoCookie = Cookies.get('userInfo');
        if (userInfoCookie) {
            try {
                const parsed: UserInfo = JSON.parse(userInfoCookie);
                setUserInfo(parsed);
            } catch {
                console.error('Error parsing user info');
            }
        }
    }, []);

    const courses = coursesResponse?.entity || [];
    const payments = paymentsResponse?.entity || [];

    const getTotalPaid = () => {
        return payments.reduce((sum, payment) => sum + payment.valor, 0);
    };

    const getRemainingAmount = () => {
        if (!selectedCourse) return 0;
        return selectedCourse.valor_curso_pagado - getTotalPaid();
    };

    const getPaymentProgress = () => {
        if (!selectedCourse || selectedCourse.valor_curso_pagado === 0) return 0;
        return (getTotalPaid() / selectedCourse.valor_curso_pagado) * 100;
    };

    const handleCourseChange = (courseId: number) => {
        const course = courses.find(c => c.id_student_course === courseId);
        setSelectedCourse(course || null);
        setShowPaymentForm(false);
        reset();
    };

    const onSubmitPayment = (data: PaymentFormData) => {
        if (!selectedCourse || !userInfo) return;

        const payload: IPostPaymentPayload = {
            listaPagosYAbonos: [{
                id_curso_estudiante: selectedCourse.id_student_course,
                valor: data.valor
            }],
            usuario_creacion: userInfo.nombre
        };

        insertPaymentMutation.mutate(payload, {
            onSuccess: () => {
                setSnackbar({
                    open: true,
                    message: 'Pago registrado exitosamente',
                    severity: 'success'
                });
                setShowPaymentForm(false);
                reset();
                refetchPayments();
            },
            onError: (error) => {
                setSnackbar({
                    open: true,
                    message: 'Error al registrar el pago',
                    severity: 'error'
                });
                console.error('Error:', error);
            }
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Si el studentId no es válido, mostramos un error
    if (isNaN(studentId)) {
        return (
            <main>
                <AppBar />
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">
                        ID de estudiante inválido
                    </Alert>
                </Box>
            </main>
        );
    }

    return (
        <main>
            <AppBar />
            <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
                        Gestión de Pagos y Abonos
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Administra los pagos de los cursos del estudiante
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card elevation={2}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        <School />
                                    </Avatar>
                                    <Typography variant="h6" color="primary" fontWeight={600}>
                                        Seleccionar Curso
                                    </Typography>
                                </Box>

                                {isLoadingCourses ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <FormControl fullWidth>
                                        <InputLabel>Curso</InputLabel>
                                        <Select
                                            value={selectedCourse?.id_student_course || ''}
                                            label="Curso"
                                            onChange={(e) => handleCourseChange(Number(e.target.value))}
                                        >
                                            {courses.map((course) => (
                                                <MenuItem key={course.id_student_course} value={course.id_student_course}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                        <Typography>{course.course}</Typography>
                                                        <Typography color="primary" fontWeight={600}>
                                                            {formatCurrency(course.valor_curso_pagado)}
                                                        </Typography>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {selectedCourse && (
                        <>
                            <Grid item xs={12} md={8}>
                                <Card elevation={2}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                                <Receipt />
                                            </Avatar>
                                            <Typography variant="h6" color="primary" fontWeight={600}>
                                                Información del Curso
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <List dense>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <School color="primary" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Nombre del Curso"
                                                            secondary={selectedCourse.course}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <AttachMoney color="primary" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Valor Total"
                                                            secondary={formatCurrency(selectedCourse.valor_curso_pagado)}
                                                        />
                                                    </ListItem>
                                                </List>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <List dense>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <TrendingUp color="primary" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Clases Totales"
                                                            secondary={`${selectedCourse.cantidad_clases} clases`}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <History color="primary" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Fecha de Inscripción"
                                                            secondary={formatDate(selectedCourse.fecha_creacion.toString())}
                                                        />
                                                    </ListItem>
                                                </List>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                                                <AccountBalance />
                                            </Avatar>
                                            <Typography variant="h6" fontWeight={600}>
                                                Resumen de Pagos
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Total Pagado
                                            </Typography>
                                            <Typography variant="h4" fontWeight={700}>
                                                {formatCurrency(getTotalPaid())}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Saldo Pendiente
                                            </Typography>
                                            <Typography variant="h5" fontWeight={600}>
                                                {formatCurrency(getRemainingAmount())}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Progreso de Pago
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                    <Box
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: 'rgba(255,255,255,0.3)',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: `${Math.min(getPaymentProgress(), 100)}%`,
                                                                height: '100%',
                                                                backgroundColor: 'white',
                                                                transition: 'width 0.3s ease'
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {Math.round(getPaymentProgress())}%
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Chip
                                            label={`${payments.length} pagos realizados`}
                                            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card elevation={2}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                                    <History />
                                                </Avatar>
                                                <Typography variant="h6" color="primary" fontWeight={600}>
                                                    Historial de Pagos
                                                </Typography>
                                            </Box>
                                            {getRemainingAmount() > 0 && (
                                                <Button
                                                    variant="contained"
                                                    startIcon={<Payment />}
                                                    onClick={() => setShowPaymentForm(!showPaymentForm)}
                                                    sx={{ borderRadius: 3 }}
                                                >
                                                    Realizar Pago
                                                </Button>
                                            )}
                                        </Box>

                                        {isLoadingPayments ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : payments.length > 0 ? (
                                            <TableContainer component={Paper} variant="outlined">
                                                <Table>
                                                    <TableHead>
                                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                            <TableCell><strong>Fecha</strong></TableCell>
                                                            <TableCell><strong>Monto</strong></TableCell>
                                                            <TableCell><strong>Usuario</strong></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {payments.map((payment: IPayment) => (
                                                            <TableRow key={payment.consecutive} hover>
                                                                <TableCell>{formatDate(payment.creation_date)}</TableCell>
                                                                <TableCell>
                                                                    <Chip
                                                                        label={formatCurrency(payment.valor)}
                                                                        color="success"
                                                                        variant="outlined"
                                                                    />
                                                                </TableCell>
                                                                <TableCell>{payment.creation_user || 'Sistema'}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        ) : (
                                            <Alert severity="info">
                                                No se han registrado pagos para este curso
                                            </Alert>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {showPaymentForm && getRemainingAmount() > 0 && (
                                <Grid item xs={12}>
                                    <Card elevation={3} sx={{ border: '2px solid', borderColor: 'primary.main' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                    <CreditCard />
                                                </Avatar>
                                                <Typography variant="h6" color="primary" fontWeight={600}>
                                                    Registrar Nuevo Pago
                                                </Typography>
                                            </Box>

                                            <form onSubmit={handleSubmit(onSubmitPayment)}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Controller
                                                            name="valor"
                                                            control={control}
                                                            rules={{
                                                                required: 'El valor es requerido',
                                                                min: { value: 1, message: 'El valor debe ser mayor a 0' },
                                                                max: {
                                                                    value: getRemainingAmount(),
                                                                    message: `El valor no puede exceder ${formatCurrency(getRemainingAmount())}`
                                                                }
                                                            }}
                                                            render={({ field }) => (
                                                                <TextField
                                                                    {...field}
                                                                    type="number"
                                                                    label="Valor del Pago"
                                                                    fullWidth
                                                                    error={!!errors.valor}
                                                                    helperText={
                                                                        errors.valor?.message ||
                                                                        `Saldo pendiente: ${formatCurrency(getRemainingAmount())}`
                                                                    }
                                                                    InputProps={{
                                                                        startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Controller
                                                            name="comentarios"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <TextField
                                                                    {...field}
                                                                    label="Comentarios (opcional)"
                                                                    fullWidth
                                                                    multiline
                                                                    rows={2}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                                            <Button
                                                                variant="outlined"
                                                                onClick={() => {
                                                                    setShowPaymentForm(false);
                                                                    reset();
                                                                }}
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button
                                                                type="submit"
                                                                variant="contained"
                                                                disabled={!isValid || insertPaymentMutation.isLoading}
                                                                startIcon={insertPaymentMutation.isLoading ? <CircularProgress size={20} /> : <Payment />}
                                                                sx={{ borderRadius: 3, minWidth: 150 }}
                                                            >
                                                                {insertPaymentMutation.isLoading ? 'Procesando...' : 'Registrar Pago'}
                                                            </Button>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </form>

                                            {watchedValor > 0 && (
                                                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Resumen del Pago
                                                    </Typography>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            <Typography variant="body2">Valor a Pagar:</Typography>
                                                            <Typography variant="h6" color="primary" fontWeight={600}>
                                                                {formatCurrency(watchedValor)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="body2">Saldo Restante:</Typography>
                                                            <Typography variant="h6" color="warning.main" fontWeight={600}>
                                                                {formatCurrency(getRemainingAmount() - watchedValor)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                        </>
                    )}

                    {!selectedCourse && !isLoadingCourses && courses.length === 0 && (
                        <Grid item xs={12}>
                            <Alert severity="warning">
                                No se encontraron cursos para este estudiante
                            </Alert>
                        </Grid>
                    )}
                </Grid>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </main>
    );
}