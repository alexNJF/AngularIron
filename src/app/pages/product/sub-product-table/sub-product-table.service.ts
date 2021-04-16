import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBaseResponse, IPagination } from '../../../app.interface';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  IdWithType,
  ISubProductFiltersPayload,
  ISubProduct
} from './sub-product-table.interface';

@Injectable()
export class SubProductTableService {

  constructor(
    private http: HttpClient
  ) {
  }

  private getSubProductsByUrl(url: string, filters: Partial<ISubProductFiltersPayload>, page: number): Observable<IPagination<ISubProduct[]>> {
    return this.http.post<IBaseResponse<IPagination<ISubProduct[]>>>(url, {
      filters: Object.keys(filters).length ? filters : undefined
    }, {
      params: {
        page: String(page)
      }
    }).pipe(
      map((res) => res.data)
    );
  }

  getSubProducts(id: IdWithType, filters: Partial<ISubProductFiltersPayload>, page: number): Observable<IPagination<ISubProduct[]>> {
    let url = `${environment.baseUrl}/product/${id.value}/sub-product`;
    if (id.type === 'shop') {
      url = `${environment.baseUrl}/shop/${id.value}/sub-product`;
    }
    return this.getSubProductsByUrl(url, filters, page);
  }
}
