import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../layout/loading/loading.service';
import { delay, finalize } from 'rxjs';

export const SkipLoading = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Check for a custom attribute
  // to avoid showing loading spinner
  if (req.context.get(SkipLoading)) {
    return next(req);
  }

  const loadingService = inject(LoadingService);
  loadingService.loadingOn();
  return next(req).pipe(
    // delay(2000),
    finalize(() => loadingService.loadingOff()),
  );
};
