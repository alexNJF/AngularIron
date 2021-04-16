import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { AuthNetwork } from './auth.network';
import { LoginOrRegisterComponent } from './login-or-register/login-or-register.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { PasswordComponent } from './password/password.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginOrRegisterComponent,
    VerifyOtpComponent,
    PasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    AuthNetwork
  ]
})
export class AuthModule {
}
