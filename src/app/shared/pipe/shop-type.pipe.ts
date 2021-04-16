import { Pipe, PipeTransform } from '@angular/core';
import { ShopEnum } from '../../pages/shop/shop.interface';

@Pipe({
  name: 'shopType'
})
export class ShopTypePipe implements PipeTransform {

  transform(value: string | undefined): string {
    let translated: string = '';
    switch (value) {
      case ShopEnum.TYPE_REPO:
        translated = 'انبار';
        break;
      case ShopEnum.TYPE_FACTORY:
        translated = 'کارخانه';
        break;
    }
    return translated;
  }

}
