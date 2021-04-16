import { Injectable } from '@angular/core';
import { IBoot, IProvince } from './app.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppData {

  boot: BehaviorSubject<IBoot | null> = new BehaviorSubject<IBoot|null>(null);
  boot$: Observable<IBoot | null> = this.boot.asObservable();

  provinces: BehaviorSubject<IProvince[] | null> = new BehaviorSubject<IProvince[]|null>(null);
}
