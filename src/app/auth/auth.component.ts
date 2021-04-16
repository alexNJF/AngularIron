import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthStep } from './auth.interface';
import { Subject } from 'rxjs';
import { AuthNetwork } from './auth.network';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(
    private authNetwork: AuthNetwork,
    private formBuilder: FormBuilder
  ) {
  }

  otpForm: FormGroup = this.formBuilder.group({
    otp: ['', [Validators.required, Validators.min(100000)]]
  });

  currentStep: AuthStep | undefined;

  private destroy: Subject<null> = new Subject();

  ngOnInit(): void {
    this.authNetwork.currentStep
      .asObservable()
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (value) => this.currentStep = value
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
