'use client';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  esES,
} from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useGetUsers, useToggleUserAccess } from '@/api/users';
import { UserOptions } from '@/components/UserOptions';
import { IToggleAccessDto, IUserTable, UserInfo } from '@/types/users';


const UsersPage = () => {
  const [filter, setFilter] = useState<number | null>(null);
  const [textFilter, setTextFilter] = useState<string>('');
  const [debouncedTextFilter, setDebouncedTextFilter] = useState<string>('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTextFilter(textFilter);
      setPaginationModel(pm => ({ ...pm, page: 0 }));
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [textFilter]);

  const { data: users, isLoading, refetch } = useGetUsers({
    idRol: filter ?? undefined,
    pageNumber: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    text: debouncedTextFilter || undefined,
  });

  const { mutate: toggleAccess, isLoading: isToggling } = useToggleUserAccess();

  const [rows, setRows] = useState<IUserTable[]>([]);
  const totalRows = users?.total ?? 0;

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

  const getUserFromCookie = (): string => {
    if (userInfo) {
      return `${userInfo.nombre} ${userInfo.apellido}`;
    }
    return '';
  };

  useEffect(() => {
    if (users?.successful) {
      const mapped = users.entity.map(u => ({
        id: u.consecutive,
        name: u.name,
        last_name: u.last_name,
        run: u.run,
        phone: u.phone,
        email: u.email,
        address: u.address,
        access_enabled: u.access_enabled,
        rol: u.rol
      }));
      setRows(mapped);
    }
  }, [users]);

  const handleToggleAccess = (consecutive: number, currentAccess: boolean) => {
    const payload: IToggleAccessDto = {
      consecutive,
      access_enabled: !currentAccess,
      user_modification: getUserFromCookie(),
    };

    toggleAccess(payload, {
      onSuccess: () => {
        setRows(prevRows =>
          prevRows.map(row =>
            row.id === consecutive
              ? { ...row, access_enabled: !currentAccess }
              : row
          )
        );
        refetch();
      },
      onError: (error) => {
        console.error('Error al cambiar el acceso del usuario:', error);
      },
    });
  };

  const handleUserDeleted = () => {
    refetch();
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre(s)', flex: 1 },
    { field: 'last_name', headerName: 'Apellido(s)', flex: 1 },
    { field: 'run', headerName: 'R.U.N', flex: 1 },
    { field: 'phone', headerName: 'Teléfono', flex: 1 },
    { field: 'email', headerName: 'E-mail', flex: 1 },
    {
      field: 'access_enabled',
      headerName: 'Estado Usuario',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const isEnabled = params.row.access_enabled;
        const consecutive = params.row.id;
        const rol = params.row.rol != 0;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {rol && (
              <Typography variant="body2" color={isEnabled ? 'success.main' : 'error.main'}>
                {isEnabled ? 'Activo' : 'Inactivo'}
              </Typography>
            )}
            {rol && (
              <Switch
                checked={isEnabled}
                onChange={() => handleToggleAccess(consecutive, isEnabled)}
                disabled={isToggling}
                color="primary"
                size="small"
              />
            )}
          </Box>
        );
      },
      flex: 1,
      align: 'center',
    },
    {
      field: '_',
      headerName: '',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) =>
        params.id != null ? (
          <UserOptions
            idUsuario={Number(params.id)}
            onUserDeleted={handleUserDeleted}
            idRol={params.row.rol}
          />
        ) : null,
      flex: 1,
      align: 'right',
    },
  ];

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setFilter(val ? parseInt(val) : null);
    setPaginationModel(pm => ({ ...pm, page: 0 }));
  };

  const handleTextFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextFilter(event.target.value);
  };

  const handleResetFilter = () => {
    setFilter(null);
    setTextFilter('');
    setDebouncedTextFilter('');
    setPaginationModel(pm => ({ ...pm, page: 0 }));
  };

  return (
    <>
      <Backdrop
        sx={{
          color: '#1565c0',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }}
        open={isLoading || isToggling}
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

      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {isLoading && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress />
            <Typography variant="h6" color={grey[500]} mt={2}>
              Cargando listado de usuarios
            </Typography>
          </Box>
        )}

        {!isLoading && users && users.total === 0 && !filter && !debouncedTextFilter && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color={grey[500]}>
              No hay usuarios creados
            </Typography>
            <Link href="usuarios/nuevo">
              <Button
                startIcon={<AddCircleOutlineOutlinedIcon />}
                size="large"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Crear usuario
              </Button>
            </Link>
          </Box>
        )}

        {!isLoading && users && users.total === 0 && (filter || debouncedTextFilter) && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl>
                  <FormLabel>Roles</FormLabel>
                  <RadioGroup
                    row
                    name="roles"
                    onChange={handleFilterChange}
                    value={filter?.toString() ?? ''}
                  >
                    <FormControlLabel value="5" control={<Radio />} label="Alumnos" />
                    <FormControlLabel value="4" control={<Radio />} label="Profesores" />
                    <FormControlLabel value="2" control={<Radio />} label="Administrativos" />
                    <FormControlLabel value="3" control={<Radio />} label="Recepción" />
                  </RadioGroup>
                </FormControl>
                <Button onClick={handleResetFilter} variant="outlined">
                  Remover Filtros
                </Button>
              </Box>
              <Link href="usuarios/nuevo">
                <Button
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  size="large"
                  variant="contained"
                >
                  Crear usuario
                </Button>
              </Link>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Buscar por nombre, RUN o teléfono"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={textFilter}
                  onChange={handleTextFilterChange}
                  placeholder="Ingrese nombre, RUN o teléfono..."
                />
              </Box>
            </Box>
          </Box>
        )}

        {!isLoading && users && users.total === 0 && (filter || debouncedTextFilter) && (
          <Paper sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color={grey[500]} mb={2}>
                No se encontraron usuarios con los filtros aplicados
              </Typography>
              <Typography variant="body2" color={grey[400]} mb={3}>
                Intenta modificar los criterios de búsqueda o remover los filtros
              </Typography>
              <Button onClick={handleResetFilter} variant="contained">
                Remover Filtros
              </Button>
            </Box>
          </Paper>
        )}

        {!isLoading && rows.length > 0 && (
          <>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControl>
                    <FormLabel>Roles</FormLabel>
                    <RadioGroup
                      row
                      name="roles"
                      onChange={handleFilterChange}
                      value={filter?.toString() ?? ''}
                    >
                      <FormControlLabel value="5" control={<Radio />} label="Alumnos" />
                      <FormControlLabel value="4" control={<Radio />} label="Profesores" />
                      <FormControlLabel value="2" control={<Radio />} label="Administrativos" />
                      <FormControlLabel value="3" control={<Radio />} label="Recepción" />
                    </RadioGroup>
                  </FormControl>
                  <Button onClick={handleResetFilter} variant="outlined">
                    Remover Filtros
                  </Button>
                </Box>
                <Link href="usuarios/nuevo">
                  <Button
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    size="large"
                    variant="contained"
                  >
                    Crear usuario
                  </Button>
                </Link>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="Buscar por nombre, RUN o teléfono"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={textFilter}
                    onChange={handleTextFilterChange}
                    placeholder="Ingrese nombre, RUN o teléfono..."
                  />
                </Box>
              </Box>
            </Box>

            <Paper sx={{ p: 2 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                disableColumnFilter
                disableColumnSelector
                disableColumnMenu
                disableRowSelectionOnClick
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                rowCount={totalRows}
                pageSizeOptions={[5, 10]}
                initialState={{
                  pagination: { paginationModel },
                }}

                sx={{
                  '& .MuiDataGrid-cell:focus, .MuiDataGrid-columnHeader:focus': {
                    outline: 'none',
                  },
                }}
              />
            </Paper>
          </>
        )}
      </Container>
    </>
  );
};

export default UsersPage;