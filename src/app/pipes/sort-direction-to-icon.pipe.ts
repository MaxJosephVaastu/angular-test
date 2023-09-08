import { Pipe, PipeTransform } from '@angular/core';
import { SortDirection } from '@angular/material/sort';

@Pipe({
  name: 'sortDirectionToIcon'
})
export class SortDirectionToIconPipe implements PipeTransform {

  transform(value: SortDirection): string {
    return value === 'asc' ? 'arrow_upward' : value === 'desc' ? 'arrow_downward' : '';
  }
}
