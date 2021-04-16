import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthNetwork } from '../auth.network';
import {
  ILoginOrRegisterData,
  ILoginOrRegisterPayload,
  ILoginOrRegisterResponse,
  LoginMethod
} from '../login-or-register/login-or-register.interface';
import { LogUtil } from '../../utils/LogUtil';
import { IVerifyOtpData, IVerifyOtpPayload } from './verify-otp.interface';
import { ITimestampDiff } from '../../app.interface';
import { TimestampUtil } from '../../utils/TimestampUtil';
import { AuthService } from '../auth.service';
import { IPasswordRecoveryRequestPayload } from '../password/password.interface';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit, OnDestroy {

  constructor(
    private authNetwork: AuthNetwork,
    private authService: AuthService
  ) {
  }

  loginOrRegisterData!: ILoginOrRegisterData;
  data!: IVerifyOtpData;
  timestampDiff!: ITimestampDiff;
  timestampDiffInterval!: number;

  loading: boolean = false;

  @ViewChildren('input')
  inputs: QueryList<ElementRef> | undefined;

  ngOnInit(): void {
    this.loginOrRegisterData = this.authNetwork.loginOrRegisterData.getValue();
    this.data = this.authNetwork.verifyOtpData.getValue();
    if (this.data.verifyFor !== 'passwordRecovery') {
      localStorage.setItem('auth_login_method', LoginMethod.OTP);
      this.loginOrRegisterData.method = LoginMethod.OTP;
      this.authNetwork.loginOrRegisterData.next(this.loginOrRegisterData);
    }
    this.setTimestampDiff();
    this.startTimestampDiffInterval();
  }

  ngOnDestroy(): void {
  }

  private setTimestampDiff(): void {
    this.timestampDiff = TimestampUtil.diffWithNow(this.data.otpExpireIn);
  }

  private startTimestampDiffInterval(): void {
    if (this.timestampDiff.status !== 'future') return;
    this.timestampDiffInterval = window.setInterval(() => {
      this.setTimestampDiff();
      if (this.timestampDiff.status !== 'future') window.clearInterval(this.timestampDiffInterval);
    }, 1000);
  }

  prevStep(event: Event): void {
    event.preventDefault();
    if (this.data.verifyFor === 'login' || this.data.verifyFor === 'register') this.authNetwork.currentStep.next('LoginOrRegister');
    else this.authNetwork.currentStep.next('Password');
  }

  onInputFocus(input: HTMLInputElement): void {
    input.value = '';
  }

  onInputValueChange(index: number): void {
    const input = this.inputs?.get(index)?.nativeElement as HTMLInputElement;
    if (!input) return;
    const strVal = input.value.trim();
    if (!strVal) return;
    const value = Number(strVal);
    if (isNaN(value) || value < 0) return;
    // one number
    if (value >= 0 && value <= 9) {
      input.value = String(value);
      if (index < 5) {
        const nextInput = this.inputs?.get(index + 1)?.nativeElement as HTMLInputElement;
        nextInput?.focus();
      }
    }
    // more than one number
    if (value > 9) {
      const invalidCase = strVal.split('').find((char: string) => isNaN(Number(char)) || Number(char) < 0 || Number(char) > 9);
      if (!invalidCase) {
        strVal.split('').forEach((char: string, i: number) => {
          const targetInput = this.inputs?.get(i)?.nativeElement as HTMLInputElement;
          if (targetInput) targetInput.value = char;
        });
      }
    }
    // submit
    this.submit();
  }

  private getInvalidInputValueIndex(): number {
    const index = this.inputs?.toArray()?.findIndex((ref: ElementRef) => {
      const input = ref.nativeElement as HTMLInputElement;
      const strVal = input.value.trim();
      const value = Number(strVal);
      return !strVal || isNaN(value) || value < 0 || value > 9;
    });
    return (index === undefined) ? -1 : index;
  }

  private clearFocusFromInputs(): void {
    this.inputs?.forEach((ref: ElementRef) => (ref.nativeElement as HTMLInputElement).blur());
  }

  private resetInputs(): void {
    this.inputs?.forEach((ref: ElementRef) => (ref.nativeElement as HTMLInputElement).value = '');
  }

  goToPassword(event: Event): void {
    event.preventDefault();
    this.authNetwork.passwordData.next({
      passwordFor: 'verify'
    });
    this.authNetwork.currentStep.next('Password');
  }

  resendOTP(event: Event): void {
    event.preventDefault();
    this.clearFocusFromInputs();
    this.resetInputs();
    const payload: ILoginOrRegisterPayload = {
      countryCode: this.loginOrRegisterData.countryCode,
      mobile: this.loginOrRegisterData.mobile,
      method: LoginMethod.OTP
    };
    LogUtil.i('ILoginOrRegisterPayload', payload);
    if (this.loading) return;
    this.loading = true;
    this.authService.loginOrRegister(payload).subscribe({
      next: (res: ILoginOrRegisterResponse) => {
        this.loading = false;
        this.data.otpExpireIn = res.otpExpireIn!;
      },
      error: () => this.loading = false,
      complete: () => this.loading = false
    });
  }

  private getCode(): string {
    let code = '';
    this.inputs?.forEach((ref: ElementRef) => code += (ref.nativeElement as HTMLInputElement).value);
    return code;
  }

  submit(event?: Event): void {
    event?.preventDefault();
    const invalidInputIndex = this.getInvalidInputValueIndex();
    if (invalidInputIndex !== -1) {
      LogUtil.w(`Input at index ${invalidInputIndex} has invalid value`);
      const invalidInput = this.inputs?.get(invalidInputIndex)?.nativeElement as HTMLInputElement;
      if (invalidInput) invalidInput.focus();
      return;
    }
    this.clearFocusFromInputs();
    const code = this.getCode();
    LogUtil.i('code:', code);
    if (this.data.verifyFor === 'login' || this.data.verifyFor === 'register') this.verify(code);
    else this.passwordRecovery(code);
  }

  private verify(code: string): void {
    const payload: IVerifyOtpPayload = {
      countryCode: this.loginOrRegisterData.countryCode,
      mobile: this.loginOrRegisterData.mobile,
      password: code,
      otp: true
    };
    LogUtil.i('login', 'IVerifyOtpPayload', payload);
    if (this.loading || this.timestampDiff.status !== 'future') return;
    this.loading = true;
    this.authService.verify(payload).subscribe({
      next: (token: string) => {
        localStorage.setItem('auth_token', token);
        // Register
        if (this.data.verifyFor === 'register') {
          this.authNetwork.passwordData.next({
            passwordFor: 'set'
          });
          this.authNetwork.currentStep.next('Password');
        }
        // Login
        if (this.data.verifyFor === 'login') {
          window.location.replace('/');
        }
      },
      error: () => this.loading = false
    });
  }

  private passwordRecovery(code: string): void {
    const payload: IPasswordRecoveryRequestPayload = {
      countryCode: this.loginOrRegisterData.countryCode,
      mobile: this.loginOrRegisterData.mobile,
      code
    };
    LogUtil.i('login', 'IPasswordRecoveryRequestPayload', payload);
    if (this.loading || this.timestampDiff.status !== 'future') return;
    this.loading = true;
    this.authService.passwordRecoveryRequest(payload).subscribe({
      next: (token: string) => {
        this.loading = false;
        this.authNetwork.passwordData.next({
          passwordFor: 'recovery',
          token
        });
        this.authNetwork.currentStep.next('Password');
      },
      error: () => this.loading = false,
      complete: () => this.loading = false
    });
  }

}
