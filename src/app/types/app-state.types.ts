import { SortDirection } from '@angular/material/sort';
import { DataApiItem } from './data.types';
import { Filters } from '../actions/actions';

export type loadingStatus = 'loading' | 'success';

export interface DataState {
  status: loadingStatus;
  data: DataApiItem[];
  filteredData: DataApiItem[];
  displayedColumns: string[];
  total: number;
  sort: string;
  order: SortDirection;
  page: number;
  limit: number;
  filters: Filters;
}
