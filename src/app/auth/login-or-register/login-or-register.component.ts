import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthNetwork } from '../auth.network';
import {
  ILoginOrRegisterData,
  ILoginOrRegisterPayload,
  ILoginOrRegisterResponse,
  LoginMethod
} from './login-or-register.interface';
import { LogUtil } from '../../utils/LogUtil';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-or-register',
  templateUrl: './login-or-register.component.html',
  styleUrls: ['./login-or-register.component.scss']
})
export class LoginOrRegisterComponent implements OnInit, OnDestroy {

  constructor(
    private authNetwork: AuthNetwork,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
  }

  authForm: FormGroup = this.formBuilder.group({
    countryCode: ['', [Validators.required, Validators.min(1)]],
    mobile: ['', [Validators.required, Validators.min(1000)]]
  });

  loginMethod!: LoginMethod;

  loading: boolean = false;

  ngOnInit(): void {
    const data: ILoginOrRegisterData = this.authNetwork.loginOrRegisterData.getValue();
    this.authForm.get('countryCode')?.setValue(data.countryCode);
    this.authForm.get('mobile')?.setValue(data.mobile ? data.mobile : '');
    this.loginMethod = data.method;
  }

  ngOnDestroy(): void {
    this.authNetwork.loginOrRegisterData.next({
      countryCode: Number(this.authForm.get('countryCode')?.value),
      mobile: Number(this.authForm.get('mobile')?.value),
      method: this.loginMethod
    });
  }

  loginOrRegister(): void {
    const payload: ILoginOrRegisterPayload = {
      countryCode: Number(this.authForm.get('countryCode')?.value),
      mobile: Number(this.authForm.get('mobile')?.value),
      method: this.loginMethod
    };
    LogUtil.i('ILoginOrRegisterPayload', payload);
    if (this.authForm.invalid) {
      LogUtil.w('authForm is invalid', this.authForm.controls);
      return;
    }
    if (this.loading) return;
    this.loading = true;
    this.authService.loginOrRegister(payload).subscribe({
      next: (res: ILoginOrRegisterResponse) => {
        this.loading = false;
        if (res.method === LoginMethod.OTP) {
          this.authNetwork.verifyOtpData.next({
            verifyFor: res.action,
            otpExpireIn: res.otpExpireIn!
          });
          this.authNetwork.currentStep.next('VerifyOTP');
        }
        if (res.method === LoginMethod.Password) {
          this.authNetwork.passwordData.next({
            passwordFor: 'verify'
          });
          this.authNetwork.currentStep.next('Password');
        }
      },
      error: () => this.loading = false,
      complete: () => this.loading = false
    });
  }

}
