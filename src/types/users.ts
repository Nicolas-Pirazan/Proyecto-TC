import { Dispatch } from 'react';
import { IOptionSelect } from './forms';
import { PaginationOptions } from './pagination';

export interface IUser {
  last_name: string;
  address_detail?: string;
  address: string;
  email: string;
  date_born: Date;
  id_commune: number;
  id_genre: number;
  medium_enter: number;
  name: string;
  job: string;
  special_observations: string;
  allergy_medications: string;
  pregnancyncy: boolean;
  visual_examination: boolean;
  months_pregnancy: number;
  password?: string;
  roles: number[];
  run: string;
  locations: number[];
  phone: string;
  user_creation?: string;
  user_modification?: string;
  rol?: number;
}

export interface IRegisterStudentForm extends Omit<IUser, 'locations'> {
  region_id: number;
  locations: number;
  contrato?: boolean;
}

export interface IRegisterStudentFormProps {
  onSubmit: Dispatch<IRegisterStudentForm>;
}

export interface IRegisterUserForm extends Omit<IUser, 'roles' | 'locations'> {
  roles: IOptionSelect[];
  locations: IOptionSelect[];
  region_id: number;
}

export interface IDefaultValuesUserForm extends Omit<IUser, 'roles' | 'locations'> {
  roles: IOptionSelect;
  locations: IOptionSelect;
  region_id: number;
}

export interface IRegisterUserFormProps {
  isSuccess: boolean;
}

export interface IUserTable extends Pick<IUser, 'name' | 'last_name' | 'run' | 'phone' | 'email' | 'address'> {
  id: number;
}

export interface IUserComplete extends IUser {
  access_enabled: boolean;
  consecutive: number;
}

export interface IUserDetail {
  consecutive: number;
  name: string;
  last_name: string;
  run: string;
  id_genre: number;
  genre: string;
  date_born: Date;
  phone: string;
  email: string;
  password: null;
  address: string;
  address_detail: string;
  region_id: number;
  region: string;
  id_province_: number;
  province: string;
  id_commune: number;
  commune: string;
  job: string;
  special_observations: string;
  allergy_medications: string;
  pregnancyncy: boolean;
  visual_examination: boolean;
  months_pregnancy: number;
  medium_enter: number;
  roles: IRole[];
  locations: ILocations[];
}

export interface IUserCourse {
  idcourse: number;
  id_student_course: number;
  course: string;
  cantidad_clases: number;
  clases_restantes: number;
  valor_curso_pagado: number;
  estado_curso: number;
  resultado_curso: number;
  fecha_creacion: Date; 
}

export interface IRole {
  id_user: number;
  id_rol: number;
  name: string;
}

export interface ILocations {
  id_user: number;
  id_location: number;
  location_name: string;
}

export interface UsuarioQueryFilter extends PaginationOptions {
  idRol: number;
  text?: string;
}

export interface GetUsersParams {
  idRol?: number;
  pageNumber?: number;
  pageSize?: number;
  text?: string;
}

export interface IDeleteUserPayload {
  consecutive: number; 
  userDelete: string;  
}

export interface IToggleAccessDto {
  consecutive: number
  access_enabled: boolean
  user_modification: string
}

export interface UserInfo {
  consecutivo: number;
  nombre: string;
  apellido: string;
  roles: Array<{
    consecutive: number;
    name: string;
  }>;
  arbol_permisos: string;
}

export interface ISimpleUserForm {
  name: string;
  last_name: string;
  run: string;
  phone: string;
  email: string;
  date_born: Date;
  id_genre: number;
  job: string;
  roles: IOptionSelect[];
}