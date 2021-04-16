import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BootResolver } from './core/resolver/boot.resolver';
import { GuestGuard } from './core/guard/guest.guard';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [GuestGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    resolve: {
      boot: BootResolver
     },
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'index.html',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
