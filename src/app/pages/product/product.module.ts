import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { SubProductTableModule } from './sub-product-table/sub-product-table.module';
import { CalculatorModule } from './calculator/calculator.module';

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    SubProductTableModule,
    CalculatorModule
  ],
  providers: [
    ProductService,
    ProductResolver
  ]
})
export class ProductModule { }
