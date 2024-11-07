import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Level } from '../interfaces/level.interface';
import { Response } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private api_url = environment.api_url;
  private http = inject(HttpClient)

  constructor() { }

  getLevels() {
    return this.http.get<Response<Level[]>>(`${this.api_url}/levels`);
  }
}
