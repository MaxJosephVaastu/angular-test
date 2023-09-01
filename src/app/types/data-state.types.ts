import { SortDirection } from '@angular/material/sort';
import { DataApiItem } from './data.types';

export type loadingStatus = 'loading' | 'success';

export interface DataState {
  status: loadingStatus;
  data: DataApiItem[];
  displayedColumns: string[];
  total: number;
  sort: string;
  order: SortDirection;
  page: number;
  limit: number;
}
