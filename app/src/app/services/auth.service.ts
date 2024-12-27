import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { sendRequest } from '../utils/request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api_url = environment.api_url;
  private http = inject(HttpClient);

  constructor() {}

  login(email: string, password: string) {
    return sendRequest(this.http, 'POST', `${this.api_url}/auth/login`, {
      email,
      password,
    });
  }
}
