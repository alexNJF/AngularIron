export interface IPasswordData {
  passwordFor: 'set' | 'verify' | 'recovery';
  token?: string;
}

export interface ISetPasswordPayload {
  password: string;
  passwordConfirm: string;
}

export interface IVerifyPasswordPayload {
  countryCode: number;
  mobile: number;
  password: string;
  otp: false;
}

export interface IPasswordRecoveryRequestPayload {
  countryCode: number;
  mobile: number;
  code: string;
}

export interface IPasswordRecoveryPayload {
  countryCode: number;
  mobile: number;
  token: string;
  password: string;
  passwordConfirm: string;
}
