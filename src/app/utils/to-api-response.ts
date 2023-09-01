import { Observable, pipe, UnaryFunction } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { DataApiItem, DataState } from '../types';

export function toApiResponse(): UnaryFunction<
  Observable<DataApiItem[]>,
  Observable<Partial<DataState>>
> {
  return pipe(
    map((data: DataApiItem[]) => ({ status: 'success' as const, data })),
    startWith({ status: 'loading' as const, data: [] })
  );
}
