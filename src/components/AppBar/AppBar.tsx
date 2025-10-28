'use client';

import Logo from '@/images/logoPimeraMarcha.svg';
import { CalendarMonthOutlined, DirectionsCar } from '@mui/icons-material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import {
  AppBar,
  Backdrop,
  Box,
  CircularProgress,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { MouseEvent, useEffect, useState } from 'react';
import { AccountMenu } from '../AccountMenu';
import { LinkStyled, LogoStyled } from './AppBar.styled';

interface UserInfo {
  consecutivo: number;
  nombre: string;
  apellido: string;
  roles: Array<{
    consecutive: number;
    name: string;
  }>;
  arbol_permisos: string;
}

export function AppBarComponent() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userInfoCookie = Cookies.get('userInfo');
    if (userInfoCookie) {
      try {
        const parsed: UserInfo = JSON.parse(userInfoCookie);
        if (parsed.roles.length > 0) {
          setUserRole(parsed.roles[0].name);
        }
      } catch {
        console.error('Error parsing user info');
      }
    }
  }, []);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const isLinkEnabled = (linkType: string): boolean => {
    switch (linkType) {
      case 'inicio':
        return true;
      case 'calendario':
        return userRole !== 'Alumno';
      case 'usuarios':
        return ['Super Usuario', 'Administrativo', 'Secretaria'].includes(userRole);
      case 'cursos':
        return ['Super Usuario', 'Administrativo', 'Secretaria'].includes(userRole);
      default:
        return true;
    }
  };

  const shouldShowLink = (linkType: string): boolean => {
    switch (linkType) {
      case 'inicio':
      case 'calendario':
        return true;
      case 'usuarios':
      case 'cursos':
        return ['Super Usuario', 'Administrativo', 'Secretaria'].includes(userRole);
      default:
        return true;
    }
  };

  const handleNavigation = async (href: string, linkType: string) => {
    if (!isLinkEnabled(linkType)) {
      return;
    }
    const shouldNavigate =
      pathname !== href &&
      (linkType === 'inicio' || !pathname.startsWith(href));

    if (shouldNavigate) {

      try {
        router.push(href);
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Navigation error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLinkClick = (e: MouseEvent, linkType: string, href: string) => {
    e.preventDefault();
    if (!isLinkEnabled(linkType)) {
      return false;
    }
    handleNavigation(href, linkType);
    return true;
  };

  const handleMenuItemClick = (href: string, linkType: string) => {
    handleCloseNavMenu();
    handleNavigation(href, linkType);
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="open navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                  <MenuItem onClick={() => handleMenuItemClick('/', 'inicio')}>
                  <HomeOutlinedIcon sx={{ mr: 1 }} />
                  <Typography textAlign="center">Inicio</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => handleMenuItemClick('/calendario', 'calendario')}
                  sx={{
                    cursor: isLinkEnabled('calendario') ? 'pointer' : 'default'
                  }}
                >
                  <CalendarMonthOutlined sx={{ mr: 1 }} />
                  <Typography textAlign="center">Calendario de clases</Typography>
                </MenuItem>

                {shouldShowLink('usuarios') && (
                  <MenuItem onClick={() => handleMenuItemClick('/usuarios', 'usuarios')}>
                    <PeopleAltOutlinedIcon sx={{ mr: 1 }} />
                    <Typography textAlign="center">Usuarios</Typography>
                  </MenuItem>
                )}

                {shouldShowLink('cursos') && (
                  <MenuItem onClick={() => handleMenuItemClick('/parametrizacion/cursos', 'cursos')}>
                    <DirectionsCar sx={{ mr: 1 }} />
                    <Typography textAlign="center">Gestión de Cursos</Typography>
                  </MenuItem>
                )}
              </Menu> 
            </Box>

            <LogoStyled src={Logo} alt="Logotipo primera marcha" />

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 2 }}>
              <LinkStyled
                href="/"
                className={pathname === '/' ? 'active' : ''}
                onClick={(e) => handleLinkClick(e, 'inicio', '/')}
              >
                <HomeOutlinedIcon sx={{ mr: 0.5 }} />
                Inicio
              </LinkStyled>
{
              <LinkStyled
                href="/calendario"
                className={pathname.startsWith('/calendario') ? 'active' : ''}
                onClick={(e) => handleLinkClick(e, 'calendario', '/calendario')}
                sx={{
                  cursor: isLinkEnabled('calendario') ? 'pointer' : 'default',
                  '&:hover': {
                    backgroundColor: isLinkEnabled('calendario') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                  }
                }}
              >
                <CalendarMonthOutlined sx={{ mr: 0.5 }} />
                Calendario de clases
              </LinkStyled>
           }
              {shouldShowLink('usuarios') && (
                <LinkStyled
                  href="/usuarios"
                  className={pathname.startsWith('/usuarios') ? 'active' : ''}
                  onClick={(e) => handleLinkClick(e, 'usuarios', '/usuarios')}
                >
                  <PeopleAltOutlinedIcon sx={{ mr: 0.5 }} />
                  Usuarios
                </LinkStyled>
              )}
              {shouldShowLink('cursos') && (
                <LinkStyled
                  href="/parametrizacion/cursos"
                  className={pathname.startsWith('/parametrizacion/cursos') ? 'active' : ''}
                  onClick={(e) => handleLinkClick(e, 'cursos', '/parametrizacion/cursos')}
                >
                  <DirectionsCar sx={{ mr: 0.5 }} />
                  Gestión de Cursos
                </LinkStyled> 
              )} 
            </Box>
  
            <Box sx={{ flexGrow: 0 }}>
              <AccountMenu />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

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
}