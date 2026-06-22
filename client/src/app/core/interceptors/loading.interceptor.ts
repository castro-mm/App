import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { finalize, Observable } from "rxjs";
import { LoadingService } from "../services/loading.service";
import { inject } from "@angular/core";

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    if(req.headers.has('X-Skip_Interceptor')) {
        return next(req);
    }

    const loadingService = inject(LoadingService);
    loadingService.show();
    return next(req)
        .pipe(
            finalize(() => loadingService.hide())
        );
};