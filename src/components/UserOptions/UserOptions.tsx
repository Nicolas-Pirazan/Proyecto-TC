import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import Cookies from 'js-cookie';
import { MouseEvent, useEffect, useState } from 'react';

import CalendarMonth from '@mui/icons-material/CalendarMonth';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PaymentIcon from '@mui/icons-material/Payment';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

import { useDeleteUser } from '@/api/users';
import { UserInfo } from '@/types/users';
import { LinkStyled } from './UserOptions.styled';

export const UserOptions = ({ 
  idUsuario, 
  onUserDeleted,
  idRol
}: { 
  idUsuario: number;
  onUserDeleted?: () => void;
  idRol: number;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const openMenu = Boolean(anchorEl);

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

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const deleteUser = useDeleteUser();

  const handleDelete = () => {
    const userInfoCookie = Cookies.get('userInfo');
    if (!userInfoCookie) return;
    
    setIsLoading(true);
    const userInfo = JSON.parse(userInfoCookie);
    const userDelete = `${userInfo.nombre} ${userInfo.apellido}`;

    deleteUser.mutate(
      { consecutive: idUsuario, userDelete },
      {
        onSuccess: () => {
          setIsLoading(false);
          setOpenDialog(false);
          if (onUserDeleted) {
            onUserDeleted();
          }
        },
        onError: (error) => {
          console.error('Error al eliminar usuario:', error);
          setIsLoading(false);
          setOpenDialog(false);
        }
      }
    );
  };

  const isEstudiante = idRol === 5;
  const isProfesor = idRol === 4;

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-controls={openMenu ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openMenu}
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
          <LinkStyled href={`/usuarios/detalles/${idUsuario}`}>
            <ListItemIcon>
              <RemoveRedEyeOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Ver
          </LinkStyled>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <LinkStyled href={`/usuarios/editar/${idUsuario}`}>
            <ListItemIcon>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Editar
          </LinkStyled>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setOpenDialog(true);
          }}
        >
          <ListItemIcon>
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Eliminar
        </MenuItem>
        <Divider />
        {isProfesor && (
        <MenuItem onClick={handleClose}>
          <LinkStyled href={`/calendario/disponibilidad/${idUsuario}`}>
            <ListItemIcon>
              <CalendarMonth fontSize="small" />
            </ListItemIcon>
            Asignar disponibilidad
          </LinkStyled>
        </MenuItem>
        )}
        {isEstudiante && (
          <MenuItem onClick={handleClose}>
            <LinkStyled href={`/parametrizacion/pagos/${idUsuario}`}>
              <ListItemIcon>
                <PaymentIcon fontSize="small" />
              </ListItemIcon>
              Pagos y Abonos
            </LinkStyled>
          </MenuItem>
        )}
      </Menu>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">¿Eliminar usuario?</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

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