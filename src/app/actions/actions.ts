import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

export interface Actions {
  setPage: PageEvent;
  setSort: Sort;
  setFilters: Filter;
}

export interface Filters {
  [key: string]: string;
}
export interface Filter {
  column: string;
  filter: string;
}
