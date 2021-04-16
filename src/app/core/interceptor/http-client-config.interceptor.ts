import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpClientConfigInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('auth_token');
    const selectedLanguage = localStorage.getItem('selected_language');
    const setHeaders: any = {
      'X-Requested-With': 'XMLHttpRequest'
    };
    if (authToken) {
      setHeaders['Authorization'] = `Bearer ${authToken}`;
    }
    if (selectedLanguage) {
      setHeaders['Language'] = selectedLanguage;
    }
    const httpClientConfig = req.clone({setHeaders});
    return next.handle(httpClientConfig);
  }
}
