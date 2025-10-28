// export interface IFormProps {
//   rol?: { id: number; label: string } | null;
//   apellido: string;
//   direccion: string;
//   email: string;
//   fecha_nacimiento: Date | null;
//   id_comuna: number | null;
//   id_genero: number | null;
//   id_region: number | null;
//   id_sede: number | null;
//   medio_enterar: number | null;
//   nombre: string;
//   oficio: string;
//   run: string;
//   telefono: string;
// }

// export interface IFormComponentProps {
//   defaultValues: IFormProps;
//   // eslint-disable-next-line no-unused-vars
//   onSubmit: (data: IFormProps) => void;
// }

export interface IOptionSelect {
  id: number;
  label: string;
}

export interface IIntervalTime {
  hours: number;
  minutes: number;
}
