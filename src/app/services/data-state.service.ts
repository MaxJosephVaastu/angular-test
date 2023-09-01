import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { RxActionFactory, RxActions } from '@rx-angular/state/actions';
import { DataApiItem, DataState } from '../types';
import { DataService } from './data.service';
import { Observable, combineLatest, merge } from 'rxjs';
import { distinctUntilChanged, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Actions } from '../actions/actions';

@Injectable({ providedIn: 'root' })

export class DataStateService extends RxState<DataState>{
  public readonly actions: RxActions<Actions, {}>;

  public readonly data$ = this.select("data");
  public readonly total$ = this.select("total");
  public readonly limit$ = this.select("limit");

  public readonly vm$ = combineLatest([
    this.select('status'),
    this.select('data'),
    this.select('displayedColumns'),
    this.total$,
    this.select('sort'),
    this.select('order'),
    this.select('page'),
    this.limit$,
  ]).pipe(
    map(([status, data, displayedColumns, total, sort, order, page, limit]) => ({
      status,
      data,
      displayedColumns,
      total,
      sort,
      order,
      page,
      limit
    }))
  );

  constructor(private readonly dataService: DataService, actionFactory: RxActionFactory<Actions>) {
    super();
    this.set({
      data: [],
      displayedColumns: [],
      total: 150,
      sort: 'id',
      order: 'asc',
      page: 1,
      limit: 5,
    });

    this.actions = actionFactory.create();
    const setPage$ = this.actions.setPage$.pipe(
      map((pageEvent) => ({ page: pageEvent.pageIndex + 1, limit: pageEvent.pageSize }))
    );
    const setSort$ = this.actions.setSort$.pipe(
      map((sort) => ({ sort: sort.active, order: sort.direction }))
    );
    this.connect(merge(this.effect$(), setPage$, setSort$));
  }

  private effect$(): Observable<Partial<DataState>> {
    return combineLatest([this.limit$, this.select('page'), this.select('sort'), this.select('order')]).pipe(
      switchMap(([limit, page, sort, order]) =>
        this.dataService.getData(sort, order, page, limit)
      ),
      withLatestFrom(this.select('displayedColumns')),
      map(([{ status, data }, columns]) => {
        const displayedColumns = data && data[0] ? Object.keys(data[0]) : columns;
        return {
          status,
          data,
          displayedColumns,
        }
      })
    );
  }

}
