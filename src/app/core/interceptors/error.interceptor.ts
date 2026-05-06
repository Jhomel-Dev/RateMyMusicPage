import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
                return authService.refreshToken().pipe(
                    switchMap((authResp) => {
                        const newReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${authResp.token}`
                            }
                        });
                        return next(newReq);
                    }),
                    catchError((refreshErr) => {
                        authService.logout();
                        router.navigate(['/auth']);
                        return throwError(() => new Error('Session expired. Please log in again.'));
                    })
                );
            }

            let errorMessage = 'An unknown error occurred!';

            if (error.error instanceof ErrorEvent) {
                // Client-side or network error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Backend returned an unsuccessful response code.
                switch (error.status) {
                    case 401:
                        errorMessage = 'Unauthorized. Please check your credentials or log in again.';
                        authService.logout();
                        router.navigate(['/auth']);
                        break;
                    case 403:
                        errorMessage = 'Forbidden. You do not have permission to perform this action.';
                        break;
                    case 404:
                        errorMessage = 'Requested resource not found.';
                        break;
                    case 500:
                        errorMessage = 'Internal Server Error. Please try again later.';
                        break;
                    default:
                        errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
            }

            console.error('[ErrorInterceptor]', errorMessage);

            // Re-throw the error so subscribing components can handle it if needed
            return throwError(() => new Error(errorMessage));
        })
    );
};
