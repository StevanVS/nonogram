import { catchError, firstValueFrom } from 'rxjs';
import { ServerResponse } from '../interfaces/server-response.interface';
import { HttpClient } from '@angular/common/http';

export function sendRequest<T>(
  http: HttpClient,
  method: string,
  url: string,
  body?: any,
): Promise<ServerResponse<T>> {
  return firstValueFrom(
    http.request<ServerResponse<T>>(method, url, { body: body }).pipe(
      catchError((error: Response) => {
        throw `Network Error: ${error.statusText} (${error.status})`;
      }),
    ),
  );
}
