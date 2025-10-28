// api
import api from '@/api';
// lib
import { useMutation } from 'react-query';
// types
import { IResponse } from '@/types';
import { ILoginCredentials, ILoginResponse } from '@/types/login';

export const useLogin = () => {
  const { data, isLoading, isError, error, mutate, isSuccess } = useMutation<
    IResponse<ILoginResponse>, 
    Error,                     
    ILoginCredentials          
  >(
    'login',
    (credentials: ILoginCredentials) =>
      api.post('Auth/Login', JSON.stringify(credentials)).then(response => response.data)
  );

  return { data, isLoading, isError, error, mutate, isSuccess };
};
