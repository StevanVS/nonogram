import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { credentialInterceptor } from './core/interceptors/credentials.interceptor';
import { AuthService } from './core/auth/auth.service';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([loadingInterceptor, credentialInterceptor]),
    ),
    provideAppInitializer(() => {
      return inject(AuthService).getCurrentUser();
    }),
  ],
};
