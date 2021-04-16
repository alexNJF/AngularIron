export enum LoginMethod {
  OTP = 'LOGIN_METHOD_OTP',
  Password = 'LOGIN_METHOD_PASSWORD'
}

export interface ILoginOrRegisterData {
  countryCode: number;
  mobile: number;
  method: LoginMethod;
}

export interface ILoginOrRegisterPayload {
  countryCode: number;
  mobile: number;
  method: LoginMethod;
}

export interface ILoginOrRegisterResponse {
  action: 'login' | 'register';
  method: LoginMethod;
  otpExpireIn?: number;
}
