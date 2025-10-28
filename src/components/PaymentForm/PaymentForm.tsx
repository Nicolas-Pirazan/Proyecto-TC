import { FormValues, PaymentFormProps, PaymentInfo } from '@/types/payment';
import { CreditCard, Payment } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

export function PaymentForm({
  courseSelections,
  onComplete,
  onFinalSubmit,
  disabled
}: PaymentFormProps) {
  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      payments: courseSelections.map(c => ({
        courseId: c.id_curso,
        paymentType: 'full',
        amount: c.courseValue ?? 0,
        installmentAmount: Math.round((c.courseValue ?? 0) * 0.3),
        comments: ''
      }))
    }
  });

  const {
    control,
    watch,
    reset,
    handleSubmit,
    formState: { isValid }
  } = methods;

  useEffect(() => {
    const initial: PaymentInfo[] = courseSelections.map(c => ({
      courseId: c.id_curso,
      paymentType: 'full',
      amount: c.courseValue ?? 0,
      installmentAmount: Math.round((c.courseValue ?? 0) * 0.3),
      comments: ''
    }));
    reset({ payments: initial });
  }, [courseSelections, reset]);

  const payments: PaymentInfo[] = watch('payments');
  useEffect(() => {
    onComplete(payments);
  }, [payments, onComplete]);

  if (disabled) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Complete los pasos anteriores</Typography>
      </Box>
    );
  }
  if (!courseSelections.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Alert severity="warning">No hay cursos seleccionados</Alert>
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFinalSubmit)}>
        <Typography variant="h6" color="primary" mb={2}>
          Información de Pago
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Elige pago completo o inicial para cada curso.
        </Alert>

        {courseSelections.map((course, idx) => (
          <Card key={course.id_curso} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1">{course.courseName}</Typography>
                <Chip
                  label={`$${(course.courseValue ?? 0).toLocaleString()}`}
                  variant="outlined"
                  color="primary"
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name={`payments.${idx}.paymentType`}
                    control={control}
                    render={({ field }) => (
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Tipo de Pago</FormLabel>
                        <RadioGroup
                          {...field}
                          onChange={e => {
                            const val = e.target.value as 'full' | 'installment';
                            field.onChange(val);
                            // sincronizar amount
                            const newAmt =
                              val === 'full'
                                ? course.courseValue ?? 0
                                : watch(`payments.${idx}.installmentAmount`)!;
                            methods.setValue(
                              `payments.${idx}.amount`,
                              newAmt,
                              { shouldValidate: true }
                            );
                          }}
                        >
                          <FormControlLabel
                            value="full"
                            control={<Radio />}
                            label="Pago Completo"
                          />
                          <FormControlLabel
                            value="installment"
                            control={<Radio />}
                            label="Abono Inicial"
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Abono inicial */}
                {watch(`payments.${idx}.paymentType`) === 'installment' && (
                  <Grid item xs={12} md={6}>
                    <Controller
                      name={`payments.${idx}.installmentAmount`}
                      control={control}
                      rules={{
                        required: 'Requerido',
                        min: { value: 1, message: 'Mínimo 1' },
                        max: {
                          value: course.courseValue ?? Infinity,
                          message: 'Excede valor del curso'
                        }
                      }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="Monto del Abono"
                          fullWidth
                          size="small"
                          error={!!fieldState.error}
                          helperText={
                            fieldState.error
                              ? fieldState.error.message
                              : `Máx. $${(course.courseValue ?? 0).toLocaleString()}`
                          }
                          onChange={e => {
                            const val = Number(e.target.value);
                            field.onChange(val);
                            methods.setValue(
                              `payments.${idx}.amount`,
                              val,
                              { shouldValidate: true }
                            );
                          }}
                        />
                      )}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Controller
                    name={`payments.${idx}.comments`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Comentarios (opcional)"
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                      />
                    )}
                  />
                </Grid>
                {watch(`payments.${idx}.paymentType`) === 'installment' && (
                  <Grid item xs={12}>
                    <Alert severity="warning">
                      <Typography variant="body2">
                        <strong>Saldo pendiente:</strong> $
                        {(
                          (course.courseValue ?? 0) -
                          watch(`payments.${idx}.amount`)
                        ).toLocaleString()}
                      </Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        ))}
        <Divider sx={{ my: 3 }} />
        <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="h6" mb={2} display="flex" alignItems="center">
              <Payment sx={{ mr: 1 }} /> Resumen
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  label: 'Valor Total',
                  value: getTotalCourseValue(),
                  color: 'primary'
                },
                {
                  label: 'Pagado',
                  value: getTotalAmount(),
                  color: 'success.main'
                },
                {
                  label: 'Pendiente',
                  value: getPendingAmount(),
                  color: 'warning.main'
                }
              ].map(({ label, value, color }) => (
                <Grid item xs={12} sm={4} key={label}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="body2" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="h5" color={color as any} fontWeight={600}>
                      ${value.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            {getPendingAmount() > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Debes cancelar ${getPendingAmount().toLocaleString()} luego.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
        <Typography variant="subtitle1" mb={2}>
          Detalle por Curso
        </Typography>
        {payments.map(p => {
          const c = courseSelections.find(c => c.id_curso === p.courseId)!;
          return (
            <Box
              key={p.courseId}
              display="flex"
              justifyContent="space-between"
              p={1}
              borderBottom="1px solid #eee"
            >
              <Typography>{c.courseName} ({c.cantidad_clases} clases)</Typography>
              <Typography color="primary">
                {p.paymentType === 'full' ? 'Total' : 'Abono'}: ${p.amount.toLocaleString()}
              </Typography>
            </Box>
          );
        })}
        <Divider sx={{ my: 3 }} />
        <Box textAlign="right">
          <Button
            type="submit"
            variant="contained"
            startIcon={<CreditCard />}
            disabled={!isValid}
            sx={{ minWidth: 200 }}
          >
            Crear y Procesar Pago
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
  function getTotalCourseValue() {
    return courseSelections.reduce((sum, c) => sum + (c.courseValue ?? 0), 0);
  }
  function getTotalAmount() {
    return watch('payments').reduce((sum, p) => sum + p.amount, 0);
  }
  function getPendingAmount() {
    return getTotalCourseValue() - getTotalAmount();
  }
}
