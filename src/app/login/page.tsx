'use client';
import { LogoStyled } from '@/components/AppBar/AppBar.styled';
import Logo from '@/images/logoPimeraMarcha.svg';
import {
  DirectionsCar,
  Lock,
  Person,
  School,
  Security,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../authContext';

const LoginPage = () => {
  const [run, setRun] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('error');
  const [fadeIn, setFadeIn] = useState(false);

  const { login } = useAuth();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleLogin = async () => {
    if (!run.trim() || !password.trim()) {
      setAlertMessage('Por favor, completa todos los campos');
      setAlertSeverity('error');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    try {
      await login(run, password);
      setAlertMessage('¡Inicio de sesión exitoso!');
      setAlertSeverity('success');
      setShowAlert(true);
    } catch (error) {
      console.error('Error de autenticación:', error);
      setAlertMessage('Credenciales incorrectas. Verifica tu RUN y contraseña.');
      setAlertSeverity('error');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          #1e3a5f 0%, 
          #2c5f7f 25%, 
          #3a7fa0 50%, 
          #4a9fc0 75%, 
          #5abfe0 100%)`,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          opacity: 0.1,
          transform: 'rotate(15deg)',
        }}
      >
        <DirectionsCar sx={{ fontSize: 120, color: '#fff' }} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          opacity: 0.1,
          transform: 'rotate(-15deg)',
        }}
      >
        <School sx={{ fontSize: 100, color: '#fff' }} />
      </Box>

      <Container maxWidth="sm">
        <Fade in={fadeIn} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #1e3a5f, #ff6b35, #4caf50)',
              }
            }}
          >
            <Box textAlign="center" mb={4}>
              <Box textAlign="center" mb={4}>
                <LogoStyled
                  src={Logo}
                  alt="Logotipo Primera Marcha"
                  style={{
                    width: '100%',
                    maxWidth: 320,
                    height: 'auto',
                    margin: '0 auto 24px',
                    display: 'block',
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Security sx={{ fontSize: 18, color: '#4caf50' }} />
                  <Typography variant="body2" color="text.secondary">
                    Acceso seguro al sistema
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <Box mb={3}>
                <TextField
                  fullWidth
                  label="RUN"
                  variant="outlined"
                  value={run}
                  onChange={(e) => setRun(e.target.value)}
                  autoComplete="username"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#1e3a5f' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#3a7fa0',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1e3a5f',
                        },
                      },
                    }
                  }}
                  sx={{
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#1e3a5f',
                    },
                  }}
                />
              </Box>

              <Box mb={4}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isLoading}
                  onKeyPress={handleKeyPress}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#1e3a5f' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          disabled={isLoading}
                          sx={{ color: '#1e3a5f' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#3a7fa0',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1e3a5f',
                        },
                      },
                    }
                  }}
                  sx={{
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#1e3a5f',
                    },
                  }}
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #1e3a5f, #3a7fa0)',
                  boxShadow: '0 4px 16px rgba(30, 58, 95, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #162d47, #2e6682)',
                    boxShadow: '0 6px 20px rgba(30, 58, 95, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #8e9eaf, #b0c0d0)',
                    color: '#fff',
                    opacity: 0.7,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Ingresando...
                  </Box>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </Box>

            <Box textAlign="center" mt={4}>
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  '& a': {
                    color: '#1e3a5f',
                    textDecoration: 'none',
                    fontWeight: 600,
                    pointerEvents: isLoading ? 'none' : 'auto',
                    opacity: isLoading ? 0.5 : 1,
                    '&:hover': {
                      textDecoration: isLoading ? 'none' : 'underline',
                    },
                  },
                }}
              >
                ¿No tienes una cuenta?{' '}
                <a href="/login">
                  Regístrate aquí
                </a>
              </Typography>

              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Box sx={{ height: 1, flex: 1, bgcolor: '#e0e0e0' }} />
                <Typography variant="caption" color="text.secondary">
                  Tu camino hacia la licencia de conducir
                </Typography>
                <Box sx={{ height: 1, flex: 1, bgcolor: '#e0e0e0' }} />
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>

      <Snackbar
        open={showAlert}
        autoHideDuration={5000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity={alertSeverity}
          sx={{
            width: '100%',
            '&.MuiAlert-standardSuccess': {
              backgroundColor: '#e8f5e8',
              color: '#2e7d2e',
              '& .MuiAlert-icon': {
                color: '#4caf50',
              },
            },
          }}
          variant="filled"
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <Backdrop
        sx={{
          color: '#1565c0', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
        }}
        open={isLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress 
            color="inherit" 
            size={60}
            thickness={4}
          />
          <Typography 
            variant="h6" 
            color="inherit"
            sx={{ fontWeight: 500 }}
          >
            Verificando credenciales...
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
};

export default LoginPage;