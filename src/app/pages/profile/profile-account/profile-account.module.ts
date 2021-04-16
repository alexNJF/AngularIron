import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileAccountRoutingModule } from './profile-account-routing.module';
import { ProfileAccountComponent } from './profile-account.component';


@NgModule({
  declarations: [ProfileAccountComponent],
  imports: [
    CommonModule,
    ProfileAccountRoutingModule
  ]
})
export class ProfileAccountModule { }
