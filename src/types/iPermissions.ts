export interface IPermission {
    modulo: string;
    ruta: string;
    accion: {
      acceso: boolean;
      crear_usuario: boolean;
      ver: boolean;
      editar: boolean;
      asignar_clase: boolean;
      asignar_disponibilidad: boolean;
    };
  }