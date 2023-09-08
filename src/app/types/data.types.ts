import { FormControl } from '@angular/forms';

export interface DataApiItem {
  [key: string]: number | string;
}
export interface FilterFormControls {
  [key: string]: FormControl;
}
export interface SortFormControls {
  [key: string]: FormControl;
}
