import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberAuto'
})
export class NumberAutoPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) { }

  transform(value: any, column: string = ''): string {
    return isNaN(Number(value)) || column === 'id' ? value : this.decimalPipe.transform(value, '1.2-2', 'ru');
  }

}
