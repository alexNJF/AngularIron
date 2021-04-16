import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

  transform(input: number | undefined): string {
    if (!input) return '';
    return new Intl.NumberFormat().format(input);
  }

}
