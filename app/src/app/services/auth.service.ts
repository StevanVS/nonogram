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
  readonly authState$ = new BehaviorSubject<boolean>(false);

  private handleAfterAuth = pipe(
    tap((res: ServerResponse<any>) => {
      this.authState$.next(res.ok);
    }),
    mergeMap((res) => {
      if (res.ok) return this.getCurrentUser();
      else return of(null);
    }),
    tap((user) => {
      this.user$.next(user);
    })
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

  signup(username: string, email: string, password: string) {
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
        })
      );
  }

  checkToken() {
    return this.http.get<ServerResponse<any>>(`${this.apiUrl}/auth/checktoken`);
  }

  getCurrentUser() {
    return this.http
      .get<ServerResponse<User>>(`${this.apiUrl}/users/currentuser`)
      .pipe(
        map((res) => {
          return res.ok ? res.datos : null;
        })
      );
  }

  restoreAuthState() {
    this.checkToken()
      .pipe(
        mergeMap((res) => {
          return res.ok ? this.getCurrentUser() : of(null);
        })
      )
      .subscribe({
        next: (user) => {
          this.user$.next(user);
          this.authState$.next(user ? true : false);
        },
        error: () => {
          console.log('Error restoring auth state');
          this.user$.next(null);
          this.authState$.next(false);
        },
      });
  }
}
