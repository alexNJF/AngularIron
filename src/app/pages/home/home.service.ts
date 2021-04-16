import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBaseResponse, IProductMenuItem } from '../../app.interface';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class HomeService {

  constructor(
    private http: HttpClient
  ) {
  }

  getProducts(): Observable<IProductMenuItem[]> {
    return this.http.get<IBaseResponse<IProductMenuItem[]>>(`${environment.baseUrl}/product`).pipe(
      map((res) => res.data)
    );
  }
}
