import { SortDirection } from '@angular/material/sort';
import { ApiUrl, TableDataItem } from './data.types';
import { Filters, Sorts } from '../actions/actions';

export type LoadingStatus = 'loading' | 'success';

export interface DataState {
  apiUrl: ApiUrl;
  status: LoadingStatus;
  data: TableDataItem[];
  filteredData: TableDataItem[];
  displayedColumns: string[];
  total: number;
  page: number;
  limit: number;
  filters: Filters;
  sorts: Sorts;
  result: boolean;
}

export interface ColumnHeaderState {
  sortDirection: SortDirection;
}
