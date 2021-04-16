import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthNetwork } from '../auth.network';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  IPasswordData,
  IPasswordRecoveryPayload,
  ISetPasswordPayload,
  IVerifyPasswordPayload
} from './password.interface';
import {
  ILoginOrRegisterData,
  ILoginOrRegisterPayload,
  ILoginOrRegisterResponse,
  LoginMethod
} from '../login-or-register/login-or-register.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { LogUtil } from '../../utils/LogUtil';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit, OnDestroy {

  constructor(
    private authNetwork: AuthNetwork,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
  }

  loginOrRegisterData!: ILoginOrRegisterData;
  data: IPasswordData | undefined;

  loading: boolean = false;

  passwordForm = this.formBuilder.group({
    'password': ['', [Validators.required, Validators.minLength(8)]],
    'confirm': ['']
  });

  private destroy = new Subject();

  ngOnInit(): void {
    this.loginOrRegisterData = this.authNetwork.loginOrRegisterData.getValue();
    this.authNetwork.passwordData
      .asObservable()
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (data: IPasswordData) => {
          this.data = data;
          if (data.passwordFor === 'verify') {
            localStorage.setItem('auth_login_method', LoginMethod.Password);
            this.loginOrRegisterData.method = LoginMethod.Password;
            this.authNetwork.loginOrRegisterData.next(this.loginOrRegisterData);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  prevStep(event: Event): void {
    event.preventDefault();
    if (this.data?.passwordFor === 'verify') this.authNetwork.currentStep.next('LoginOrRegister');
    if (this.data?.passwordFor === 'recovery') this.authNetwork.passwordData.next({passwordFor: 'verify'});
  }

  skipPasswordSet(event: Event): void {
    event.preventDefault();
    this.loading = true;
    window.location.replace('/');
  }

  goToVerifyOTP(event: Event, verifyFor: 'login' | 'passwordRecovery'): void {
    event.preventDefault();
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
        this.authNetwork.verifyOtpData.next({
          verifyFor,
          otpExpireIn: res.otpExpireIn!
        });
        this.authNetwork.currentStep.next('VerifyOTP');
      },
      error: () => this.loading = false,
      complete: () => this.loading = false
    });
  }

  submit(): void {
    const isConfirmValid = () => {
      if (this.data?.passwordFor === 'set' || this.data?.passwordFor === 'recovery') {
        return this.passwordForm.get('password')?.value === this.passwordForm.get('confirm')?.value;
      }
      return true;
    };
    if (!isConfirmValid() || this.passwordForm.invalid) {
      LogUtil.w('Invalid password form', this.passwordForm.controls);
      return;
    }
    switch (this.data?.passwordFor) {
      case 'set':
        this.setPassword();
        break;
      case 'verify':
        this.verifyPassword();
        break;
      case 'recovery':
        this.recoveryPassword();
        break;
    }
  }

  private setPassword(): void {
    const form = this.passwordForm.getRawValue();
    const payload: ISetPasswordPayload = {
      password: form.password,
      passwordConfirm: form.confirm
    };
    LogUtil.i(`ISetPasswordPayload`, payload);
    if (this.loading) return;
    this.loading = true;
    this.authService.setPassword(payload).subscribe({
      next: () => {
        this.loginOrRegisterData.method = LoginMethod.Password;
        this.authNetwork.loginOrRegisterData.next(this.loginOrRegisterData);
        localStorage.setItem('auth_login_method', LoginMethod.Password);
        window.location.replace('/');
      },
      error: () => this.loading = false
    });
  }

  private verifyPassword(): void {
    const form = this.passwordForm.getRawValue();
    const payload: IVerifyPasswordPayload = {
      countryCode: this.loginOrRegisterData.countryCode,
      mobile: this.loginOrRegisterData.mobile,
      password: form.password,
      otp: false
    };
    LogUtil.i(`IVerifyPasswordPayload`, payload);
    if (this.loading) return;
    this.loading = true;
    this.authService.verify(payload).subscribe({
      next: (token: string) => {
        localStorage.setItem('auth_token', token);
        window.location.replace('/');
      },
      error: () => this.loading = false
    });
  }

  private recoveryPassword(): void {
    const form = this.passwordForm.getRawValue();
    const payload: IPasswordRecoveryPayload = {
      countryCode: this.loginOrRegisterData.countryCode,
      mobile: this.loginOrRegisterData.mobile,
      token: this.data?.token!,
      password: form.password,
      passwordConfirm: form.confirm
    };
    LogUtil.i(`IPasswordRecoveryPayload`, payload);
    if (this.loading) return;
    this.loading = true;
    this.authService.passwordRecoveryReset(payload).subscribe({
      next: () => {
        this.loading = false;
        this.authNetwork.passwordData.next({
          passwordFor: 'verify'
        });
      },
      error: () => this.loading = false,
      complete: () => this.loading = false
    });
  }

}
