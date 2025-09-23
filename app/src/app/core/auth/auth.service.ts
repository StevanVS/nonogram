import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from '../models/server-response.model';
import { User } from './user.model';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  take,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.api_url;
  private http = inject(HttpClient);

  private currentUserSubject$ = new BehaviorSubject<User | null>(null);

  public readonly currentUser$ = this.currentUserSubject$
    .asObservable()
    .pipe(distinctUntilChanged());

  public readonly authState$ = this.currentUser$.pipe(map((user) => !!user));

  constructor() {}

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<ServerResponse<User>>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(tap((res) => this.currentUserSubject$.next(res.datos)));
  }

  register(credentials: { username: string; email: string; password: string }) {
    return this.http
      .post<ServerResponse<User>>(`${this.apiUrl}/auth/register`, credentials)
      .pipe(tap((res) => this.currentUserSubject$.next(res.datos)));
  }

  logout() {
    return this.http
      .post<ServerResponse<any>>(`${this.apiUrl}/auth/logout`, {})
      .pipe(tap(() => this.currentUserSubject$.next(null)));
  }

  checkToken() {
    return this.http.get<ServerResponse<any>>(`${this.apiUrl}/auth/checktoken`);
  }

  getCurrentUser() {
    return this.http
      .get<ServerResponse<User>>(`${this.apiUrl}/users/user`)
      .pipe(
        tap({
          next: (res) => this.currentUserSubject$.next(res.datos),
          error: console.error,
        }),
        shareReplay(1),
      );
  }

  isUserAuth(): Observable<boolean> {
    return this.authState$.pipe(take(1));
  }

  isUserAdmin(): Observable<boolean> {
    return this.currentUser$.pipe(
      take(1),
      map((user) => user!.role === 'admin'),
    );
  }
}
