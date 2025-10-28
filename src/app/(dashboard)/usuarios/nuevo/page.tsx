'use client';
import { useInsertPartialPayment } from '@/api/pagosYAbonos';
import { useAssignCoursesToStudent } from '@/api/schedule';
import { useCreateUser } from '@/api/users';
import AlertNotification from '@/components/Alert/AlertNotification';
import { PaymentForm } from '@/components/PaymentForm/PaymentForm';
import Spinner from '@/components/Spinner';
import { UserCreateForm } from '@/components/UserCreateForm';
import { CourseAssignmentForm } from '@/components/UserCreateForm/CourseAssignmentForm';
import { SimpleUserRegistrationForm } from '@/components/UserCreateForm/SimpleUserRegistrationForm';
import { IPostPaymentPayload, PaymentInfo } from '@/types/paymentsAndFertilizers';
import { CourseSelection, IAssignStudentCoursesPayload, UserInfo } from '@/types/schedule';
import { IRegisterUserForm, ISimpleUserForm, IUser } from '@/types/users';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Container,
  Divider,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type RegistrationType = 'student' | 'staff' | 'student-clean';

const CreateUserPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [activeStep, setActiveStep] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);
  const [courseSelections, setCourseSelections] = useState<CourseSelection[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentInfo[]>([]);
  const [step1Data, setStep1Data] = useState<IRegisterUserForm | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<boolean[]>([true, false, false]);
  const [coursesAssignmentResponse, setCoursesAssignmentResponse] = useState<any>(null);
  const [registrationType, setRegistrationType] = useState<RegistrationType>('student-clean');

  const methods = useForm<IRegisterUserForm>();
  const simpleUserMethods = useForm<ISimpleUserForm>();

  const { mutate: createUser, isLoading: isLoadingUser, isError: isErrorUser, isSuccess: isSuccessUser } = useCreateUser();
  const { mutate: assignCourses, isLoading: isLoadingCourses, isError: isErrorCourses, isSuccess: isSuccessCourses } = useAssignCoursesToStudent();
  const { mutate: insertPayment, isLoading: isLoadingPayment, isError: isErrorPayment, isSuccess: isSuccessPayment } = useInsertPartialPayment();

  const steps = ['Datos del Usuario', 'Asignación de Cursos', 'Información de Pago'];

  useEffect(() => {
    const userInfoCookie = Cookies.get('userInfo');
    if (userInfoCookie) {
      try {
        const parsedUserInfo: UserInfo = JSON.parse(userInfoCookie);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  const handleRegistrationTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: RegistrationType,
  ) => {
    if (newType !== null) {
      setRegistrationType(newType);
      resetForm();
    }
  };

  const handleStep1Complete = (data: IRegisterUserForm) => {
    setStep1Data(data);
    setActiveStep(1);
    setExpandedSteps([true, true, false]);
  };

  const handleSimpleUserSubmit = (data: ISimpleUserForm) => {
    if (!userInfo) {
      setAlertMessage('Faltan datos del usuario');
      setAlertSeverity('error');
      setShowAlert(true);
      return;
    }

    const completeUserData: IUser = {
      name: data.name,
      last_name: data.last_name,
      run: data.run,
      phone: data.phone,
      email: data.email,
      date_born: data.date_born,
      id_genre: data.id_genre,
      job: data.job,
      roles: data.roles.map(rol => Number(rol.id)),
      address: '-',
      address_detail: '-',
      id_commune: 1,
      medium_enter: 0,
      special_observations: '-',
      allergy_medications: '-',
      pregnancyncy: false,
      visual_examination: false,
      months_pregnancy: 0,
      password: '',
      locations: [1],
      user_creation: `${userInfo.nombre} ${userInfo.apellido}`,
    };

    createUser(completeUserData, {
      onSuccess: () => {
        setAlertMessage('¡Usuario creado exitosamente!');
        setAlertSeverity('success');
        setShowAlert(true);
        resetForm();
      },
      onError: (error) => {
        console.error('Error creando usuario:', error);
        setAlertMessage('Error al crear el usuario');
        setAlertSeverity('error');
        setShowAlert(true);
      }
    });
  };

  const handleStep2Complete = (courses: CourseSelection[]) => {
    setCourseSelections(courses);
    setActiveStep(2);
    setExpandedSteps([true, true, true]);
  };

  const handleStep3Complete = (payments: PaymentInfo[]) => {
    setPaymentData(payments);
  };

  const executeAllProcesses = async () => {
    if (!step1Data || !userInfo) {
      setAlertMessage('Faltan datos del usuario');
      setAlertSeverity('error');
      setShowAlert(true);
      return;
    }

    try {
      const newUserData: IUser = {
        ...step1Data,
        roles: step1Data.roles.map(rol => Number(rol.id)),
        password: '',
        user_creation: `${userInfo.nombre} ${userInfo.apellido}`,
        address_detail: '',
        locations: step1Data.locations.map(sede => Number(sede.id)),
        medium_enter: 0,
      };

      createUser(newUserData, {
        onSuccess: async (userResponse) => {
          const idUsuarioCreado = userResponse?.entity;
          setCreatedUserId(Number(idUsuarioCreado));

          if (courseSelections.length > 0) {
            const payloadCursos: IAssignStudentCoursesPayload = {
              id_estudiante: Number(idUsuarioCreado),
              lista_cursos: courseSelections.map(course => ({
                id_curso: course.id_curso,
                cantidad_clases: course.cantidad_clases,
                valor_curso_registrado: course.valor_curso_registrado || course.courseValue || 0
              })),
              comentario: courseSelections.map(c => c.comentario).filter(Boolean).join('; '),
              usuario_creacion: `${userInfo.nombre} ${userInfo.apellido}`,
              estado_curso: 1,
              resultado_curso: 0
            };

            assignCourses(payloadCursos, {
              onSuccess: async (coursesResponse) => {
                setCoursesAssignmentResponse(coursesResponse);

                if (paymentData.length > 0) {
                  const paymentPayload: IPostPaymentPayload = {
                    listaPagosYAbonos: paymentData.map(payment => ({
                      id_curso_estudiante: payment.courseId,
                      valor: payment.amount
                    })),
                    usuario_creacion: `${userInfo.nombre} ${userInfo.apellido}`
                  };

                  insertPayment(paymentPayload, {
                    onSuccess: () => {
                      setAlertMessage('¡Usuario creado exitosamente con cursos y pagos!');
                      setAlertSeverity('success');
                      setShowAlert(true);
                      resetForm();
                    },
                    onError: (error: unknown) => {
                      console.error('Error en pagos:', error);
                      setAlertMessage('Usuario y cursos creados, pero hubo error en los pagos');
                      setAlertSeverity('error');
                      setShowAlert(true);
                    }
                  });
                }
                else {
                  setAlertMessage('¡Usuario creado exitosamente con cursos!');
                  setAlertSeverity('success');
                  setShowAlert(true);
                  resetForm();
                }
              },
              onError: (error) => {
                console.error('Error asignando cursos:', error);
                setAlertMessage('Usuario creado pero hubo error asignando cursos');
                setAlertSeverity('error');
                setShowAlert(true);
              }
            });
          } else {
            setAlertMessage('¡Usuario creado exitosamente!');
            setAlertSeverity('success');
            setShowAlert(true);
            resetForm();
          }
        },
        onError: (error) => {
          console.error('Error creando usuario:', error);
          setAlertMessage('Error al crear el usuario');
          setAlertSeverity('error');
          setShowAlert(true);
        }
      });
    } catch (error) {
      console.error('Error general:', error);
      setAlertMessage('Error inesperado en el proceso');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setStep1Data(null);
    setCourseSelections([]);
    setPaymentData([]);
    setCreatedUserId(null);
    setCoursesAssignmentResponse(null);
    setExpandedSteps([true, false, false]);
    methods.reset();
    simpleUserMethods.reset();
  };

  const toggleStepExpansion = (stepIndex: number) => {
    if (stepIndex === 0) return;
    if (stepIndex === 1 && activeStep < 1) return;
    if (stepIndex === 2 && activeStep < 2) return;

    const newExpanded = [...expandedSteps];
    newExpanded[stepIndex] = !newExpanded[stepIndex];
    setExpandedSteps(newExpanded);
  };

  const isLoading = isLoadingUser || isLoadingCourses || isLoadingPayment;

  return (
    <>
      <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <Paper sx={{ padding: 4, borderRadius: 2 }} variant="outlined">
          <Typography variant="h5" color="primary" fontWeight={600} mb={4}>
            Registro de usuario
          </Typography>

          {/* —————— Menú de selección —————— */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              Tipo de registro
            </Typography>
            <ToggleButtonGroup
              value={registrationType}
              exclusive
              onChange={handleRegistrationTypeChange}
              aria-label="tipo de registro"
              sx={{ mb: 2 }}
            >
              {/*<ToggleButton value="student" aria-label="estudiante">
                <Typography variant="body2" fontWeight={500}>
                  Registro de Estudiante
                </Typography>
              </ToggleButton> */}
              <ToggleButton value="student-clean" aria-label="alumno-limpio">
                <Typography variant="body2" fontWeight={500}>
                  Registro de Estudiante
                </Typography>
              </ToggleButton>
              <ToggleButton value="staff" aria-label="personal">
                <Typography variant="body2" fontWeight={500}>
                  Registro de Personal
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="body2" color="text.secondary">
              {registrationType === 'student'
                ? ''
                : registrationType === 'student-clean'
                  ? 'Creación de estudiante con solo sus datos personales'
                  : 'Registro simplificado para personal administrativo y profesores'}
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>

          {registrationType === 'student' ? (
            <>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label, index) => (
                  <Step key={label} completed={activeStep > index}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: activeStep >= 0 ? 'primary.main' : 'grey.300',
                    color: 'white',
                    p: 2,
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    1. Datos del Usuario
                  </Typography>
                </Box>
                <Collapse in={expandedSteps[0]} timeout="auto">
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <FormProvider {...methods}>
                      <UserCreateForm
                        isSuccess={false}
                        onComplete={handleStep1Complete}
                        showNextButton={true}
                      />
                    </FormProvider>
                  </Box>
                </Collapse>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: activeStep >= 1 ? 'primary.main' : 'grey.300',
                    color: activeStep >= 1 ? 'white' : 'grey.600',
                    p: 2,
                    borderRadius: 1,
                    mb: 1,
                    cursor: activeStep >= 1 ? 'pointer' : 'default',
                  }}
                  onClick={() => toggleStepExpansion(1)}
                >
                  <Typography variant="h6" fontWeight={600}>
                    2. Asignación de Cursos
                  </Typography>
                  {activeStep >= 1 && (
                    <IconButton size="small" sx={{ color: 'inherit' }}>
                      {expandedSteps[1] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  )}
                </Box>
                <Collapse in={expandedSteps[1] && activeStep >= 1} timeout="auto">
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <CourseAssignmentForm
                      onComplete={handleStep2Complete}
                      disabled={activeStep < 1}
                    />
                  </Box>
                </Collapse>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: activeStep >= 2 ? 'primary.main' : 'grey.300',
                    color: activeStep >= 2 ? 'white' : 'grey.600',
                    p: 2,
                    borderRadius: 1,
                    mb: 1,
                    cursor: activeStep >= 2 ? 'pointer' : 'default',
                  }}
                  onClick={() => toggleStepExpansion(2)}
                >
                  <Typography variant="h6" fontWeight={600}>
                    3. Información de Pago
                  </Typography>
                  {activeStep >= 2 && (
                    <IconButton size="small" sx={{ color: 'inherit' }}>
                      {expandedSteps[2] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  )}
                </Box>
                <Collapse in={expandedSteps[2] && activeStep >= 2} timeout="auto">
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <PaymentForm
                      courseSelections={courseSelections}
                      onComplete={handleStep3Complete}
                      onFinalSubmit={executeAllProcesses}
                      disabled={activeStep < 2}
                    />
                  </Box>
                </Collapse>
              </Box>
            </>
          ) : registrationType === 'student-clean' ? (
            <>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    p: 2,
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    Datos del Alumno
                  </Typography>
                </Box>
                <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <FormProvider {...methods}>
                    <UserCreateForm
                      isSuccess={isSuccessUser}
                      showNextButton={false}
                      onComplete={(data: IRegisterUserForm) => {
                        createUser(
                          {
                            ...data,
                            roles: [5],
                            password: '',
                            user_creation: `${userInfo?.nombre} ${userInfo?.apellido}`,
                            locations: data.locations.map(l => Number(l.id)),
                          } as IUser,
                          {
                            onSuccess: () => {
                              setAlertMessage('¡Alumno creado exitosamente!');
                              setAlertSeverity('success');
                              setShowAlert(true);
                              resetForm();
                            },
                            onError: () => {
                              setAlertMessage('Error al crear el alumno');
                              setAlertSeverity('error');
                              setShowAlert(true);
                            },
                          }
                        );
                      }}
                    />
                  </FormProvider>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" color="primary" fontWeight={600} mb={3}>
                  Datos del Personal
                </Typography>
                <FormProvider {...simpleUserMethods}>
                  <SimpleUserRegistrationForm
                    onSubmit={handleSimpleUserSubmit}
                    currentUserInfo={userInfo}
                  />
                </FormProvider>
              </Box>
            </>
          )}
        </Paper>
      </Container>

      <AlertNotification
        key="alerta-proceso"
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        severity={alertSeverity}
        message={alertMessage}
      />
      <Spinner isOpen={isLoading} />
    </>
  );
};

export default CreateUserPage;