export interface ILoginResponse {
  token: string;
  arbolPermisos: {
    consecutivo: number;
    nombre: string;
    apellido: string;
    roles: {
      consecutive: number;
      name: string;
    }[];
    arbol_permisos: string;
  };
}

export interface ILoginCredentials {
  run: string;
  password: string;
}
  