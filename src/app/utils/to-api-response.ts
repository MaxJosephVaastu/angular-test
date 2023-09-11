import { Observable, pipe, UnaryFunction } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { DataApiItem, DataState, TableDataItem } from '../types';

export function toApiResponse(): UnaryFunction<
  Observable<[TableDataItem[], number]>,
  Observable<Partial<DataState>>
> {
  return pipe(
    map(([dataPaged, total]) => (
      {
        status: 'success' as const, total, data: dataPaged.map(
          ({ data: { account, ...rest } }) => (account ? { data: { ...rest, account: Number(account) / 100 } } : { data: { ...rest } })
        )
      }
    )),
    startWith({ status: 'loading' as const, total: 0, data: [] })
  );
}
