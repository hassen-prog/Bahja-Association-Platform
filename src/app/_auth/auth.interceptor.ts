import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { UserAuthService } from "../_services/user-auth.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userAuthService: UserAuthService,
    private router: Router) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.headers.get('No-Auth') === 'True') {
      return next.handle(req.clone());
    }

    // const token = this.userAuthService.getToken();
    // if (token !== null)
    //   req = this.addToken(req, token);

    // return next.handle(req).pipe(
    //   catchError(
    //     (err: HttpErrorResponse) => {
    //       console.log(err.status);
    //       if (err.status === 401) {
    //         this.router.navigate(['/auth/login']);
    //       } else if (err.status === 403) {
    //         this.router.navigate(['/forbidden']);
    //       }
    //       return throwError("Some thing is wrong");
    //     }
    //   )
    // );
    const token = this.userAuthService.getToken();

if (token !== null) {
  req = this.addToken(req, token);
}

return next.handle(req).pipe(
  catchError((err: HttpErrorResponse) => {
    console.log(err.status);

    if (err.status === 401) {
      this.router.navigate(['/auth/login']);
    } else if (err.status === 403) {
      this.router.navigate(['/forbidden']);
    }

    return throwError("Something went wrong");
  })
);
  }


  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone(
      {
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}