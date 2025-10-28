import api from '@/api';
import { IPreferenceProps } from '@/types/payment';
import { useQuery } from 'react-query';

export const GetPreference = (run: string, total: number, description: string) => {
  return useQuery<IPreferenceProps>(
    ['getPreference', run, total, description],
    async () => {
      const response = await api.post('Payment/create_preference', { run, total, description });
      return response.data;
    },
    {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      onError: (error) => {
        console.error('Error al obtener la preferencia de pago:', error);
      },
    }
  );
};
