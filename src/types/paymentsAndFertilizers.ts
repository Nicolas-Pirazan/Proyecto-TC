export interface IPayment {
    consecutive: number;
    id_curso_estudiante: number;
    valor: number;
    creation_date: string; 
    creation_user?: string;
    modification_date?: string;
    modification_user?: string;
  }
  
  export interface IPostPaymentItem {
    id_curso_estudiante: number;
    valor: number;
  }
  
  export interface IPostPaymentPayload {
    listaPagosYAbonos: IPostPaymentItem[];
    usuario_creacion: string;
  }

  export interface PaymentInfo {
    courseId: number;
    paymentType: 'full' | 'installment';
    amount: number;
    installmentAmount?: number;
    comments?: string;
  }
  