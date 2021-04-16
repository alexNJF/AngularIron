import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient
  ) {
  }

  logout(): void {
    this.http.get(`${environment.baseUrl}/auth/logout`).subscribe({
      next: () => this.unauthorized()
    });
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  unauthorized(): void {
    this.removeToken();
    window.location.replace('/auth');
  }
}
