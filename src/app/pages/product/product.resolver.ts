import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { IProductResolve } from './product.interface';
import { ProductService } from './product.service';
import { Observable } from 'rxjs';

@Injectable()
export class ProductResolver implements Resolve<IProductResolve> {

  constructor(
    private productService: ProductService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<IProductResolve> {
    return this.productService.show(route.paramMap.get('id'));
  }
}
