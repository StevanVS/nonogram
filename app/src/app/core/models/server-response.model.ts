export interface ServerResponse<T> {
  ok: boolean;
  datos: T;
  error?: string;
}
