import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve } from '@angular/router';
import { IBaseResponse, IBoot } from '../../app.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { AppData } from '../../app.data';
import { AuthService } from '../service/auth.service';

@Injectable()
export class BootResolver implements Resolve<IBoot> {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private appData: AppData
  ) {
  }

  resolve(): Observable<IBoot> {
    return this.http.get<IBaseResponse<IBoot>>(`${environment.baseUrl}/boot`).pipe(
      map((res) => {
        if (!res.data.user) this.authService.removeToken();
        this.appData.boot.next(res.data);
        return res.data;
      })
    );
  }
}
