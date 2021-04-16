import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IBaseResponse, IProvince } from '../../app.interface';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { AppData } from '../../app.data';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(
    private appData: AppData,
    private http: HttpClient
  ) {
  }

  getProvinces(): Observable<IProvince[]> {
    const cachedProvinces = this.appData.provinces.getValue();
    return cachedProvinces?.length ? of(cachedProvinces) : this.http.get<IBaseResponse<IProvince[]>>(`${environment.baseUrl}/province`).pipe(
      map((res: IBaseResponse<IProvince[]>) => {
        const provinces = res.data;
        this.appData.provinces.next(provinces);
        return provinces;
      })
    );
  }
}
