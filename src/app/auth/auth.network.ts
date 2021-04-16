import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthStep } from './auth.interface';
import { ILoginOrRegisterData, LoginMethod } from './login-or-register/login-or-register.interface';
import { IVerifyOtpData } from './verify-otp/verify-otp.interface';
import { IPasswordData } from './password/password.interface';

@Injectable()
export class AuthNetwork {

  get currentStepInitValue(): AuthStep {
    return 'LoginOrRegister';
  }

  get loginOrRegisterDataInitValue(): ILoginOrRegisterData {
    let loginMethod: LoginMethod = localStorage.getItem('auth_login_method') as LoginMethod;
    if (loginMethod !== LoginMethod.OTP && loginMethod !== LoginMethod.Password) loginMethod = LoginMethod.OTP;
    return {
      countryCode: 98,
      mobile: 0,
      method: loginMethod
    };
  }

  get verifyOtpDataInitValue(): IVerifyOtpData {
    return {
      verifyFor: 'login',
      otpExpireIn: (new Date().valueOf() + (3 * 60 * 1000))
    };
  }

  get passwordInitData(): IPasswordData {
    return {
      passwordFor: 'verify'
    };
  }

  currentStep: BehaviorSubject<AuthStep> = new BehaviorSubject<AuthStep>(this.currentStepInitValue);
  loginOrRegisterData: BehaviorSubject<ILoginOrRegisterData> = new BehaviorSubject<ILoginOrRegisterData>(this.loginOrRegisterDataInitValue);
  verifyOtpData: BehaviorSubject<IVerifyOtpData> = new BehaviorSubject<IVerifyOtpData>(this.verifyOtpDataInitValue);
  passwordData: BehaviorSubject<IPasswordData> = new BehaviorSubject<IPasswordData>(this.passwordInitData);
}
