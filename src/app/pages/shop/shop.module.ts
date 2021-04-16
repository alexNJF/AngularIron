import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { SharedModule } from '../../shared/shared.module';
import { ShopService } from './shop.service';
import { ShopResolver } from './shop.resolver';
import { SubProductTableModule } from '../product/sub-product-table/sub-product-table.module';
import { MapModule } from '../../map/map.module';


@NgModule({
  declarations: [ShopComponent],
  imports: [
    CommonModule,
    ShopRoutingModule,
    SharedModule,
    SubProductTableModule,
    MapModule
  ],
  providers: [
    ShopService,
    ShopResolver
  ]
})
export class ShopModule { }
