import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductResolver } from './product.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    resolve: {
      data: ProductResolver
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
