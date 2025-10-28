import { useAuth } from '@/app/authContext';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { MouseEvent, useEffect, useState } from 'react';

interface UserInfo {
  name: string;
  avatar: string;
  rol: string;
}

export function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { logout } = useAuth();
  const [user, setUser] = useState<UserInfo>({ name: 'Usuario', avatar: '/static/images/avatar/2.jpg', rol: 'Administrador' });

  useEffect(() => {
    const storedUserInfo = Cookies.get('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUser({
        name: `${parsedUserInfo.nombre} ${parsedUserInfo.apellido}`,
        avatar: '/static/images/avatar/2.jpg',
        rol: parsedUserInfo.roles.length > 0 ? parsedUserInfo.roles[0].name : 'Sin rol',
      });
    } else {
      setUser({ name: 'Usuario', avatar: '/static/images/avatar/2.jpg', rol: 'Sin rol' });
    }
  }, []);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2, display: { xs: 'flex', md: 'none' } }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar alt={user.name} src={user.avatar} />
            </IconButton>
            <Box
              display={{ xs: 'none', md: 'flex' }}
              sx={{ alignItems: 'center' }}
            >
              <Avatar alt={user.name} src={user.avatar} />
              <Typography
                sx={{ color: 'GrayText' }}
                display={{ sx: 'none', md: 'flex' }}
                flexDirection="column"
                alignItems="flex-start"
                lineHeight={1.2}
                marginLeft={2}
              >
                {user.name}
                <span style={{ fontSize: '14px' }}>{user.rol}</span>
              </Typography>
              <IconButton
                onClick={handleClick}
                size="medium"
                color="default"
                sx={{ ml: 2 }}
              >
                <KeyboardArrowDownOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
          </>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        elevation={0}
        sx={{
          overflow: 'visible',
          filter: 'drop-shadow(0px 1px 4px rgba(0,0,0,0.1))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Mi perfil
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> Mis datos personales
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Configuración
        </MenuItem>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
}
