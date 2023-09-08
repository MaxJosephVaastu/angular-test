import { SortDirection } from '@angular/material/sort';
import { DataApiItem } from './data.types';
import { Filters, Sorts } from '../actions/actions';

export type LoadingStatus = 'loading' | 'success';

export interface DataState {
  status: LoadingStatus;
  data: DataApiItem[];
  filteredData: DataApiItem[];
  displayedColumns: string[];
  total: number;
  page: number;
  limit: number;
  filters: Filters;
  sorts: Sorts;
}

export interface ColumnHeaderState {
  sortDirection: SortDirection;
}
