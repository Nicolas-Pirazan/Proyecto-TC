import api from '@/api';
import { IResponse } from '@/types';
import { GetUsersParams, IDeleteUserPayload, IToggleAccessDto, IUser, IUserComplete, IUserCourse, IUserDetail } from '@/types/users';
import { UseQueryResult, useMutation, useQuery } from 'react-query';

export const useCreateUser = () => {
  const { data, isLoading, isError, error, mutate, isSuccess } = useMutation('postUser', (userData: IUser) =>
    api.post('Users', JSON.stringify(userData)).then(response => response.data)
  );

  return { data, isLoading, isError, error, mutate, isSuccess };
};

export const useEditUser = (idUser: number) => {
  const { data, isLoading, isError, error, mutate, isSuccess } = useMutation('postUser', (userData: IUser) =>
    api.put(`Users?consecutive=${idUser}`, JSON.stringify(userData)).then(response => response.data)
  );

  return { data, isLoading, isError, error, mutate, isSuccess };
};

export const useDeleteUser = () => {
  return useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: ({ consecutive, userDelete }: IDeleteUserPayload) =>
      api.delete('Users', { 
          params: {
            consecutive,
            userDelete,
          },
        })
        .then((res) => res.data),
  });
};

export const useGetUsers = (params: GetUsersParams) => {
  const { idRol, pageNumber = 1, pageSize = 10, text } = params;

  return useQuery<IResponse<IUserComplete[]>>({
    queryKey: ['getUsers', idRol, pageNumber, pageSize, text],
    queryFn: () => {
      const queryParams = new URLSearchParams();

      if (idRol !== undefined) queryParams.append('idRol', idRol.toString());
      if (text !== undefined && text.trim() !== '') queryParams.append('text', text.trim());
      queryParams.append('pageNumber', pageNumber.toString());
      queryParams.append('pageSize', pageSize.toString());

      return api
        .get(`Users/GetUsers?${queryParams.toString()}`)
        .then((res) => res.data);
    },
    keepPreviousData: true,
  });
}

export const useGetUserDetail = (idUser: number) => {
  const { data, isLoading, isError, error } = useQuery<IResponse<IUserDetail[]>>(['getUsersDetail', idUser], () =>
    api.get(`Users/GetUsersDetail?consecutive=${idUser}`).then(response => response.data)
  );

  return { data, isLoading, isError, error };
};

export const useGetUserDetailAutentication = (idUser: number) => {
  const {data,isLoading,isError,error,refetch, 
  }: UseQueryResult<IResponse<IUserDetail[]>> = useQuery(
    ['getUsersDetail', idUser],
    () =>
      api.get(`Users/GetUsersDetail?consecutive=${idUser}`).then((response) => response.data),
    {
      enabled: Boolean(idUser), 
    }
  );

  return { data, isLoading, isError, error, refetch }; 
};

export const useGetUserCourse = (idEstudiante: number) => {
  const { data, isLoading, isError, error } = useQuery<IResponse<IUserCourse[]>>(
    ['getUsuariosCursoEstudiante', idEstudiante],
    () =>
      api
        .get(`Users/GetUsersCourseStudent?idStudent=${idEstudiante}`)
        .then(response => response.data)
  );

  return { data, isLoading, isError, error };
};

export const useToggleUserAccess = () => {
  const { data, isLoading, isError, error, mutate, isSuccess } = useMutation('toggleAccess',
    (payload: IToggleAccessDto) =>
      api.put('Users/ToggleAccess', JSON.stringify(payload)).then(response => response.data)
  );

  return { data, isLoading, isError, error, mutate, isSuccess };
};