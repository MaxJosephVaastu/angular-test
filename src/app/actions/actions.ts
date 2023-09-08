import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';

export interface Actions {
  setPage: PageEvent;
  setSort: Sort;
  setFilters: Filter;
  setSorts: ColumnSort;
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
