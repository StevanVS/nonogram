import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Board } from '../interfaces/board.interface';
import { Response } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  api_url = environment.api_url;

  constructor(private http: HttpClient) {}

  getList() {
    return this.http.get<Response<Board[]>>(`${this.api_url}/boards`);
  }
}
