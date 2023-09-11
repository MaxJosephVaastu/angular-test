import { FormControl } from '@angular/forms';

export interface TableDataItem {
  data: DataApiItem;
  deleted?: boolean;
  edited?: boolean;
  selected?: boolean;
}

export interface DataApiItem {
  [key: string]: number | string;
}

export interface FilterFormControls {
  [key: string]: FormControl;
}

export interface SortFormControls {
  [key: string]: FormControl;
}

export interface ApiUrl {
  name: string;
  url: string;
}
