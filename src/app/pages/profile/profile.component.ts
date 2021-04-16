import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppData } from '../../app.data';
import { IUser } from '../../app.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  constructor(
    private appData: AppData,
    private authService: AuthService,
    private router: Router
  ) {
  }

  activeRouteUrl: string | undefined;
  user: IUser | null | undefined;

  private destroy = new Subject();

  ngOnInit(): void {
    this.activeRouteUrl = this.router.url;
    this.router.events.pipe(
      takeUntil(this.destroy)
    ).subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          this.activeRouteUrl = event.url;
        }
      }
    });
    this.appData.boot
      .asObservable()
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (value) => this.user = value?.user
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }

}
