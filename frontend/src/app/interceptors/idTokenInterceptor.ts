import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "../service/auth/auth.service";
import {of, switchMap} from "rxjs";

export const idTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return auth.isAuthenticated().pipe(
    switchMap((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        return auth.getIdToken$();
      }
      return of(null);
    }),
    switchMap((idToken: string | null) => {
      if (idToken) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${idToken}`
          }
        });
      }
      return of(req);
    }),
    switchMap((req) => {
      return next(req);
    }
  ));
};
