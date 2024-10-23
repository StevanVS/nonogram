export interface Response<T> {
  ok: boolean;
  datos: T;
  error?: string;
}
