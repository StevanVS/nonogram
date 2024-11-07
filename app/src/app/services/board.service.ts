import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Board } from '../interfaces/board.interface';
import { Response } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private api_url = environment.api_url;
  private http = inject(HttpClient)

  getList() {
    return this.http.get<Response<Board[]>>(`${this.api_url}/boards`);
  }
}
