import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { BehaviorSubject, map, mergeMap, of, pipe, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.api_url;
  private http = inject(HttpClient);

  readonly user$ = new BehaviorSubject<User | null>(null);
  readonly authState$ = new BehaviorSubject<boolean | null>(null);

  private handleAfterAuth = pipe(
    tap((res: ServerResponse<any>) => {
      this.authState$.next(res.ok);
    }),
    mergeMap((res) => {
      if (res.ok) return this.getUserProfile();
      else return of(null);
    }),
    tap((user) => {
      this.user$.next(user);
    }),
  );

  constructor() {
    this.restoreAuthState();
  }

  login(email: string, password: string) {
    return this.http
      .post<ServerResponse<any>>(`${this.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(this.handleAfterAuth);
  }

  register(username: string, email: string, password: string) {
    return this.http
      .post<ServerResponse<any>>(`${this.apiUrl}/auth/register`, {
        username,
        email,
        password,
      })
      .pipe(this.handleAfterAuth);
  }

  logout() {
    return this.http
      .post<ServerResponse<any>>(`${this.apiUrl}/auth/logout`, {})
      .pipe(
        tap(() => {
          this.user$.next(null);
          this.authState$.next(false);
        }),
      );
  }

  checkToken() {
    return this.http.get<ServerResponse<any>>(`${this.apiUrl}/auth/checktoken`);
  }

  getUserProfile() {
    return this.http
      .get<ServerResponse<User>>(`${this.apiUrl}/users/profile`)
      .pipe(
        map((res) => {
          return res.ok ? res.datos : null;
        }),
      );
  }

  restoreAuthState() {
    this.checkToken()
      .pipe(
        mergeMap((res) => {
          return res.ok ? this.getUserProfile() : of(null);
        }),
      )
      .subscribe({
        next: (user) => {
          this.user$.next(user);
          this.authState$.next(user ? true : false);
        },
        error: (error) => {
          console.error('Error restoring auth state', error);
          this.user$.next(null);
          this.authState$.next(false);
        },
      });
  }
}
