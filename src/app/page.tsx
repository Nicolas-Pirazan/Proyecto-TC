'use client';

import { AccountMenu } from '@/components/AccountMenu';
import { LogoStyled } from '@/components/AppBar/AppBar.styled';
import Logo from '@/images/logoPimeraMarcha.svg';
import { UserInfo } from '@/types/users';
import { CalendarToday, DirectionsCar, Language, PersonAdd, School } from '@mui/icons-material';
import GroupIcon from '@mui/icons-material/Group';
import {
  AppBar,
  Backdrop,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Toolbar,
  Typography
} from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MenuOption {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
  roles: string[];
  external?: boolean;
}

const HomePage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const userInfoCookie = Cookies.get('userInfo');
    if (userInfoCookie) {
      try {
        const parsed: UserInfo = JSON.parse(userInfoCookie);
        setUserInfo(parsed);
        if (parsed.roles.length > 0) {
          setUserRole(parsed.roles[0].name);
        }
      } catch {
        console.error('Error parsing user info');
      }
    }
  }, []);

  const menuOptions: MenuOption[] = [
    {
      title: 'Calendario',
      description: 'Gestión de horarios y disponibilidad',
      icon: <CalendarToday sx={{ fontSize: 40 }} />,
      route: '/calendario',
      color: '#3788d8',
      roles: ['Super Usuario', 'Administrativo', 'Secretaria', 'Profesor Teórico Práctico']
    },
    {
      title: 'Usuarios',
      description: 'Administrar usuarios del sistema',
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      route: '/usuarios',
      color: '#4caf50',
      roles: ['Super Usuario', 'Administrativo', 'Secretaria']
    },
    {
      title: 'Nuevo Usuario',
      description: 'Registrar nuevos usuarios',
      icon: <PersonAdd sx={{ fontSize: 40 }} />,
      route: '/usuarios/nuevo',
      color: '#ff9800',
      roles: ['Super Usuario', 'Administrativo', 'Secretaria']
    },
    {
      title: 'Mis Clases',
      description: 'Consultar mis clases programadas',
      icon: <School sx={{ fontSize: 40 }} />,
      route: `/calendario/clases/consultar/${userInfo?.consecutivo || ''}`,
      color: '#f44336',
      roles: ['Alumno', 'Super Usuario']
    },
    {
      title: 'Gestión de Cursos',
      description: 'Administrar cursos de conducción',
      icon: <DirectionsCar sx={{ fontSize: 40 }} />,
      route: '/parametrizacion/cursos',
      color: '#FFA000',
      roles: ['Super Usuario', 'Administrativo', 'Secretaria']
    },
    {
      title: 'Aula Virtual',
      description: 'Accede al Moodle de Primera Marcha',
      icon: <Language sx={{ fontSize: 40 }} />,
      route: 'https://primeramarcha.cl/aulavirtual/login/index.php',
      color: '#3cba54',
      roles: ['Super Usuario', 'Administrativo', 'Secretaria', 'Profesor Teórico Práctico', 'Alumno'],
      external: true
    }
  ];

  const getVisibleOptions = () =>
    menuOptions.filter(opt => opt.roles.includes(userRole));

  const handleNavigate = (opt: MenuOption) => {
    setIsLoading(true);
    
    if (opt.external) {
      window.open(opt.route, '_blank');
      setIsLoading(false);
    } else {
      router.push(opt.route);
    }
  };

  const getRoleChipColor = (role: string) => {
    switch (role) {
      case 'Super Usuario': return 'error';
      case 'Administrativo': return 'primary';
      case 'Secretaria': return 'secondary';
      case 'Profesor Teórico Práctico': return 'success';
      case 'Alumno': return 'info';
      default: return 'default';
    }
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'white',
          boxShadow: '0px 1px 4px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }} />
          <LogoStyled src={Logo} alt="Logotipo primera marcha" />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 2 }} />
          <AccountMenu />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" color="primary" fontWeight={600} gutterBottom>
            ¡Bienvenido, {userInfo?.nombre} {userInfo?.apellido}!
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="body1" color="textSecondary">
              Tu rol actual:
            </Typography>
            <Chip
              label={userRole}
              color={getRoleChipColor(userRole) as any}
              variant="outlined"
              size="small"
            />
          </Box>
          <Typography variant="body1" color="textSecondary">
            Selecciona una opción del menú para comenzar
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {getVisibleOptions().map((opt, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardActionArea
                  onClick={() => handleNavigate(opt)}
                  sx={{ height: '100%' }}
                  disabled={isLoading}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      height: 200,
                      justifyContent: 'center',
                      gap: 2
                    }}
                  >
                    <Box
                      sx={{
                        color: opt.color,
                        mb: 1,
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: `${opt.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {opt.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
                      {opt.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ px: 1 }}>
                      {opt.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {getVisibleOptions().length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No hay opciones disponibles para tu rol actual
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Contacta al administrador si necesitas acceso a funcionalidades adicionales
            </Typography>
          </Box>
        )}
      </Container>
      <Backdrop
        sx={{
          color: '#1565c0', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }}
        open={isLoading}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <CircularProgress 
            color="inherit" 
            size={60}
            thickness={4}
          />
          <Typography 
            variant="body1" 
            color="inherit"
            fontWeight={500}
          >
            Cargando...
          </Typography>
        </Box>
      </Backdrop>
    </>
  );
};

export default HomePage;