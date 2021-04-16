import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IShopResolve } from './shop.interface';
import { IBaseResponse } from '../../app.interface';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class ShopService {

  constructor(
    private http: HttpClient
  ) {
  }

  show(id: string | null): Observable<IShopResolve> {
    return this.http.get<IBaseResponse<IShopResolve>>(`${environment.baseUrl}/shop/${id}`).pipe(
      map((res) => res.data)
    );
  }
}
