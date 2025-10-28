import api from '@/api';
import { IResponse } from '@/types';
import { useMutation, useQuery } from 'react-query';

export const useUploadFile = () => {
  const { mutate, isLoading, isError, error, isSuccess } = useMutation((formData: FormData) =>
    api.post<IResponse<string>>('Files/Upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data)
  );

  return { mutate, isLoading, isError, error, isSuccess };
};

export const useGetFileUrl = (fileName: string) => {
  return useQuery<IResponse<string>>(['getFileUrl', fileName], () =>
    api.get<IResponse<string>>(`Files/GetFileUrl?fileName=${fileName}`).then(response => response.data)
  );
};
