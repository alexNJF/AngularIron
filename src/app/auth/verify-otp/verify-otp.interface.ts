export interface IVerifyOtpData {
  verifyFor: 'register' | 'login' | 'passwordRecovery';
  otpExpireIn: number;
}

export interface IVerifyOtpPayload {
  countryCode: number;
  mobile: number;
  password: string;
  otp: true;
}
