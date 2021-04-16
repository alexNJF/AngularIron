import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { AppData } from '../../app.data';
import { Subject } from 'rxjs';
import { IUser } from '../../app.interface';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnDestroy {

  constructor(
    private appData: AppData,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
  }

  private user: IUser | null = null;
  private roles: string[] = [];
  private destroy = new Subject();

  @Input('hasRole')
  set _hasRole(roles: string[]) {
    this.roles = roles;
    this.resolveUser((user) => {
      this.user = user;
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  private resolveUser(callback: (user: IUser | null) => void) {
    this.appData.boot$.pipe(
      takeUntil(this.destroy)
    ).subscribe({
      next: (boot) => {
        if (boot === null) {
          return;
        }
        callback(boot.user);
      }
    });
  }

  private updateView(): void {
    if (this.checkRoles()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkRoles(): boolean {
    let hasRole = false;
    for (const role of this.roles) {
      const roleFound = this.user?.roles?.find(w => w.toLowerCase() === role.toLowerCase());
      if (roleFound) {
        hasRole = true;
        break;
      }
    }
    return hasRole;
  }

}
