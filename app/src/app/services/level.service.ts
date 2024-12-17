import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Level } from '../interfaces/level.interface';
import { ServerResponse } from '../interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private api_url = environment.api_url;
  private http = inject(HttpClient)

  constructor() { }

  getLevels(completedLevels: string[]) {
    return this.http.post<ServerResponse<Level[]>>(`${this.api_url}/levels`, { completedLevels });
  }
}
