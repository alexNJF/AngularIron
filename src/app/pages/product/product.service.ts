import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProductResolve } from './product.interface';
import { IBaseResponse } from '../../app.interface';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class ProductService {

  constructor(
    private http: HttpClient
  ) {
  }

  show(id: string | null): Observable<IProductResolve> {
    return this.http.get<IBaseResponse<IProductResolve>>(`${environment.baseUrl}/product/${id}`).pipe(
      map((res) => res.data)
    );
  }
}
