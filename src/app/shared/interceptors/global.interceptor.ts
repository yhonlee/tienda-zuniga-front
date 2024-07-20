import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable, Injector, inject } from "@angular/core";
import { Observable, catchError, finalize, tap, throwError } from "rxjs";
import { TokenService } from "../services/token.service";
import { LoaderService } from "../components/loader/services/loader.service";
import { environment } from "src/environments/environment";
import { SnackBarService } from "../services/snack-bar.service";
import { RequestStatus } from "../enums";
import { Router } from "@angular/router";

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {

    private enumRequestStatus: typeof RequestStatus = RequestStatus;
    private readonly url: string = `${environment.url}`;
    private readonly urlBack: string = `${environment.baseUrlBack}`;
    private request: any;

    private _router = inject(Router);

    private requestsPending: number = 0;

    constructor(
        private readonly _loader: LoaderService,/*
        private readonly _logger: LoggerService,*/
        private readonly _snackBar: SnackBarService,
        private injector: Injector,
        private readonly _token: TokenService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token: string = this._token.getToken;

        this.requestsPending++;

        if (req.url.includes('assets')) {
            return next.handle(req);
        }


        this.request = req.clone({
            url: `${this.urlBack}${this.url}${req.url}`,
            setHeaders: {
                authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        });

        /*         if (token) this.addTokenHeader(token); */

        this._loader.show();

        return next.handle(this.request).pipe(
            tap((event: HttpEvent<any>) => {

                if (event instanceof HttpResponse) this.showSnackbar(event);

            }),
            catchError((error: HttpErrorResponse) => {

                this._loader.hide();
                this._snackBar.showSnackBar([error.error.message], false);
                /* this._logger.error(error.error.message); */

                if (error.status === 401 || error.status === 403) {
                    localStorage.clear();
                    this._router.navigateByUrl('/');
                }

                return throwError(() => error);
            }), finalize(() => this.handleHideLoader()));
    }

    loader() {
        this._loader.hide()
    }
    private showSnackbar(event: HttpResponse<any>): void {

        const { GENERAL_ERROR, LOGIC_ERROR } = this.enumRequestStatus;

        if ([GENERAL_ERROR, LOGIC_ERROR].includes(event.body.status)) {

            this._snackBar.showSnackBar([event.body.message], false);
            //   this._logger.logByStatus(event.body.status, event.body.message);

        }

    }

    private handleHideLoader(): void {
        this.requestsPending--;
        if (this.requestsPending === 0) this._loader.hide();
    }
}

export const GlobalProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: GlobalInterceptor, multi: true }
];
