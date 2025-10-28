import api from '@/api';
import { IResponse } from '@/types';
import { IPayment, IPostPaymentPayload } from '@/types/paymentsAndFertilizers';
import { UseMutationResult, useMutation, useQuery } from 'react-query';

export const useGetPaymentsByCursoEstudiante = (idCursoEstudiante: number) => {
  return useQuery<IResponse<IPayment[]>>(
    ['getPaymentsByCursoEstudiante', idCursoEstudiante],
    () =>
      api
        .get(`PagosYAbonos/ObtainPayment?id_curso_estudiante=${idCursoEstudiante}`)
        .then(res => res.data),
    {
      enabled: idCursoEstudiante > 0,
    }
  );
};

export const useInsertPartialPayment = (): UseMutationResult<
  IResponse<IPayment>,
  unknown,
  IPostPaymentPayload,
  unknown
> => {
  return useMutation<IResponse<IPayment>, unknown, IPostPaymentPayload>(
    (payload: IPostPaymentPayload) =>
      api
        .post('PagosYAbonos/InsertPartialPayment', JSON.stringify(payload))
        .then(res => res.data)
  );
};
