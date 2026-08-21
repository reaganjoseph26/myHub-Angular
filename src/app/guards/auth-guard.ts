import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

let isHandling400Code = false;

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    withCredentials: true,
  });
  return next(authReq);
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (req.url.includes('/login') || req.url.includes('/sign-up')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.log('bacon');
        if (!isHandling400Code) {
          isHandling400Code = true;
          //authService.logOut();
          console.log('navigating to login');
          authService.setIsLoggedIn('false');
          router.navigate(['/login']).then(() => {
            isHandling400Code = false;
          });
        }
      }
      return throwError(() => error);
    }),
  );
};

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('hitting authGUARD');
  return authService.verifyToken().pipe(
    map((isValid) => {
      if (isValid) {
        console.log(isValid, ' isValid');
        //this.userservice.setUserData(data);
        authService.setIsLoggedIn('true');

        return true;
      } else {
        authService.setIsLoggedIn('false');
        return router.createUrlTree(['/login']);
      }
    }),
  );
};

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() === 'true') {
    return router.createUrlTree(['/home']);
    // router.navigate(['/home']);
  }

  // if (authService.isLoggedIn() == 'true') {
  //   return router.createUrlTree(['/home']);
  // }

  return true;
};
