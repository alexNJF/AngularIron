import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'br'
})
export class BrPipe implements PipeTransform {

  transform(value: string, splitter: string = '\n'): string {
    return value?.split(splitter)?.join('<br>\n');
  }

}
