import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../app.interface';
import { environment } from '../../environments/environment';
import { ILoginOrRegisterPayload, ILoginOrRegisterResponse } from './login-or-register/login-or-register.interface';
import { map } from 'rxjs/operators';
import { IVerifyOtpPayload } from './verify-otp/verify-otp.interface';
import {
  IPasswordRecoveryPayload,
  IPasswordRecoveryRequestPayload,
  ISetPasswordPayload,
  IVerifyPasswordPayload
} from './password/password.interface';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient
  ) {
  }

  loginOrRegister(payload: ILoginOrRegisterPayload): Observable<ILoginOrRegisterResponse> {
    return this.http.post<IBaseResponse<ILoginOrRegisterResponse>>(`${environment.baseUrl}/auth/loginOrRegister`, payload).pipe(
      map((res) => res.data)
    );
  }

  verify(payload: IVerifyOtpPayload | IVerifyPasswordPayload): Observable<string> {
    return this.http.post<IBaseResponse<string>>(`${environment.baseUrl}/auth/verify`, payload).pipe(
      map((res) => res.data)
    );
  }

  passwordRecoveryRequest(payload: IPasswordRecoveryRequestPayload): Observable<string> {
    return this.http.post<IBaseResponse<string>>(`${environment.baseUrl}/auth/passwordRecoveryRequest`, payload).pipe(
      map((res) => res.data)
    );
  }

  passwordRecoveryReset(payload: IPasswordRecoveryPayload): Observable<IBaseResponse<null>> {
    return this.http.post<IBaseResponse<null>>(`${environment.baseUrl}/auth/passwordRecoveryReset`, payload);
  }

  setPassword(payload: ISetPasswordPayload): Observable<IBaseResponse<null>> {
    return this.http.post<IBaseResponse<null>>(`${environment.baseUrl}/profile/updatePassword`, payload);
  }
}
