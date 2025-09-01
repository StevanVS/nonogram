import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  pipe,
  switchMap,
  take,
  tap,
} from 'rxjs';

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
    // console.log('init auth');
    this.restoreAuthState().subscribe();
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

  isUserAuthenticated(): Observable<boolean> {
    return this.authState$.pipe(
      filter((isAuth) => isAuth != null),
      take(1),
    );
  }

  isUserAdmin(): Observable<boolean> {
    return this.authState$.pipe(
      filter((isAuth) => isAuth != null),
      take(1),
      switchMap(() =>
        this.user$.pipe(
          filter((user) => user != null), // esperar hasta que haya user
          take(1),
          map((user) => user!.role === 'admin'), // aquí decides el booleano
        ),
      ),
    );
  }

  restoreAuthState() {
    return this.checkToken().pipe(
      mergeMap((res) => (res.ok ? this.getUserProfile() : of(null))),
      tap({
        next: (user) => {
          this.user$.next(user);
          this.authState$.next(user ? true : false);
        },
        error: (error) => {
          console.error('Error restoring auth state', error);
          this.user$.next(null);
          this.authState$.next(false);
        },
      }),
    );
  }
}
