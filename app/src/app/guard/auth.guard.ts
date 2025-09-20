import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const isAuth: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .isUserAuth()
    .pipe(map((value) => (value ? true : router.createUrlTree(['/login']))));
};

export const isNotAuth: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .isUserAuth()
    .pipe(map((value) => (value ? router.createUrlTree(['/login']) : true)));
};

export const isAdmin: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .isUserAdmin()
    .pipe(map((value) => (value ? true : router.createUrlTree(['/login']))));
};
