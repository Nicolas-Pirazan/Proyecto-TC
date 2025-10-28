import { TPaymentType } from '@mercadopago/sdk-react/bricks/payment/type';
import { CourseSelectionFragment } from './schedule';

export interface IPreferenceProps {
  exitoso: boolean;
  error: null | string;
  entity: string; 
  total: number;
}
type ICustomization = Pick<TPaymentType, 'customization'>;
type IInitialization = Pick<TPaymentType, 'initialization'>;

export type IConfigPaymentProps = ICustomization & IInitialization;

export interface PaymentInfo {
  courseId: number;
  paymentType: 'full' | 'installment';
  installmentAmount?: number;
  comments?: string;
  amount: number;
}

export interface PaymentFormProps {
  courseSelections: CourseSelectionFragment[];
  onComplete: (paymentData: PaymentInfo[]) => void;
  onFinalSubmit: () => void;
  disabled?: boolean;
}

export interface FormValues {
  payments: PaymentInfo[];
}