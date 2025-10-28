export interface IResponse<T> {
  successful: boolean;
  error: null;
  entity: T;
  total: number;
}
