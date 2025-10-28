import api from '@/api';
import { IResponse } from '@/types';
import { IPermission } from '@/types/iPermissions';

export const getPermissionsByRol = (
    idRol: number,
    modulo: string,
    ruta: string
  ): Promise<IResponse<IPermission[]>> => {
    return api
      .get('Permissions/GetPermissionsbyRol', {
        params: {
          idRol,
          modulo,
          ruta,
        },
      })
      .then((response) => response.data);
  };