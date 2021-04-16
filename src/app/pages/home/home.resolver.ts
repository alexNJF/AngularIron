import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { IHome } from './home.interface';
import { HomeService } from './home.service';

@Injectable()
export class HomeResolver implements Resolve<IHome> {

  constructor(
    private homeService: HomeService
  ) {
  }

  async resolve(): Promise<IHome> {
    // const products: IProductMenuItem[] = await this.homeService.getProducts().toPromise();
    return {
      products: []
    };
  }
}
