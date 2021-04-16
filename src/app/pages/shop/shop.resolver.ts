import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { IShopResolve } from './shop.interface';
import { ShopService } from './shop.service';
import { Observable } from 'rxjs';

@Injectable()
export class ShopResolver implements Resolve<IShopResolve> {

  constructor(
    private shopService: ShopService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<IShopResolve> {
    return this.shopService.show(route.paramMap.get('id'));
  }
}
