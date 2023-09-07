import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { RxActionFactory, RxActions } from '@rx-angular/state/actions';
import { DataApiItem, DataState } from '../types';
import { DataService } from './data.service';
import { Observable, combineLatest, merge } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Actions, Filters } from '../actions/actions';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Injectable({ providedIn: 'root' })

export class AppStateService extends RxState<DataState>{
  public readonly data$ = this.select('data');
  public readonly total$ = this.select('total');
  public readonly limit$ = this.select('limit');
  public readonly displayedColumns$ = this.select('displayedColumns');
  public actions: RxActions<Actions, {}>;

  public readonly dataState$ = combineLatest([
    this.select('status'),
    this.select('data'),
    this.select('filteredData'),
    this.select('displayedColumns'),
    this.total$,
    this.select('sort'),
    this.select('order'),
    this.select('page'),
    this.limit$,
  ]).pipe(
    map(([status, data, filteredData, displayedColumns, total, sort, order, page, limit]) => ({
      status,
      data,
      filteredData,
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
      filteredData: [],
      displayedColumns: [],
      total: 150,
      sort: 'id',
      order: 'asc',
      page: 1,
      limit: 5,
      filters: {},
    });

    this.actions = actionFactory.create();
    const setPage$ = this.actions.setPage$.pipe(
      map(({ pageIndex, pageSize }: PageEvent) => ({ page: pageIndex + 1, limit: pageSize }))
    );
    const setSort$ = this.actions.setSort$.pipe(
      map(({ active, direction }: Sort) => ({ sort: active, order: direction }))
    );
    const setFilters$ = this.actions.setFilters$.pipe(
      withLatestFrom(this.select('filters')),
      map(([{ column, filter }, filters]) => ({ filters: { ...filters, [column]: filter } }))
    );
    this.connect(merge(this.updateDateFromApieffect$(), setPage$, setSort$));
    this.connect(setFilters$);
    this.connect('filteredData', this.applyFiltersEffect$());
  }

  private updateDateFromApieffect$(): Observable<Partial<DataState>> {
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

  private applyFiltersEffect$(): Observable<DataApiItem[]> {
    return combineLatest([this.select('filters'), this.data$]).pipe(
      distinctUntilChanged(),
      map(([filters, data]) => {
        return data.filter(dataItem => this.isMatchFilter(dataItem, filters))
      })
    );
  }

  private isMatchFilter(dataItem: DataApiItem, filters: Filters): boolean {
    const match = Object.keys(dataItem).reduce((isMatch, key) => {
      const fllterValue = filters[key] && filters[key].trim().toLowerCase();
      return isMatch && (!fllterValue || !!fllterValue && dataItem[key].toString().toLowerCase().includes(fllterValue))
    }, true
    );

    return match;
  }
}

