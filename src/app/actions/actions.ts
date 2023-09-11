import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { ApiUrl } from '../types';

export interface Actions {
  setPage: PageEvent;
  setSort: Sort;
  setFilters: Filter;
  setSorts: ColumnSort;
  selectRow: number;
  toggleAllRows: boolean;
  sendReport: void;
  selectApi: ApiUrl;
}

export interface Filters {
  [key: string]: string;
}
export interface Filter {
  column: string;
  filter: string;
}
export interface ColumnSort {
  column: string;
  sortDirection: SortDirection;
}

export interface ColumnHeaderAcions {
  toggleSort: void;
}

export interface Sorts {
  [key: string]: SortDirection;
}
