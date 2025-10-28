
import api from '@/api';

import { IResponse } from '@/types';
import { ICourse, IGenericOptions, IParamsProps, IRegisterCourseForm, IRol } from '@/types/params';
import { useMutation, useQuery } from 'react-query';

export const useGetParams = () => {
  return useQuery<IResponse<IParamsProps>>('getParams', () =>
    api.get('Parameters/GetRegistrationParameters').then(response => response.data)
  );
};

export const useGetRegions = () => {
  return useQuery<IResponse<IGenericOptions[]>>('getRegions', () =>
    api.get('Parameters/GetRegions').then(response => response.data)
  );
};

export const useGetComunasByIdRegion = (idRegion: number) => {
  return useQuery<IResponse<IGenericOptions[]>>(
    ['getComunasByIdRegion', idRegion],
    () => api.get(`Parameters/GetCommunes?idRegion=${idRegion}`).then(response => response.data),
    { enabled: idRegion > 0 }
  );
};

export const useGetRoles = () => {
  return useQuery<IResponse<IRol[]>>('getRoles', () => api.get('Parameters/GetRoles').then(response => response.data));
};

export const useCreateCourse = () => {
  return useMutation<IResponse<ICourse>, unknown, IRegisterCourseForm>(
    (courseData: IRegisterCourseForm) =>
      api
        .post('Parameters/PostCourses', JSON.stringify(courseData))
        .then(response => response.data)
  );
};

export const useGetCourses = () => {
  return useQuery<IResponse<ICourse[]>>('getCourses', () =>
    api.get('Parameters/GetCourses').then(response => response.data)
  );
};

export const useUpdateCourses = () => {
  return useMutation<IResponse<ICourse>, unknown, ICourse>(
    (courseData: ICourse) =>
      api.put('Parameters/PutCourses', JSON.stringify(courseData)).then(response => response.data)
  );
};