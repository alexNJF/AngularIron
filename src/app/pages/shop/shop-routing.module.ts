import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ShopResolver } from './shop.resolver';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    resolve: {
      data: ShopResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
