import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { RxActionFactory, RxActions } from '@rx-angular/state/actions';
import { DataApiItem, DataState } from '../types';
import { DataService } from './data.service';
import { Observable, combineLatest, merge } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Actions, Filters, Sorts } from '../actions/actions';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Injectable({ providedIn: 'root' })

export class AppStateService extends RxState<DataState>{
  public readonly data$ = this.select('data');
  public readonly total$ = this.select('total');
  public readonly limit$ = this.select('limit');
  public readonly displayedColumns$ = this.select('displayedColumns');
  public readonly actions = this.actionFactory.create();

  public readonly dataState$ = combineLatest([
    this.select('status'),
    this.select('data'),
    this.select('filteredData'),
    this.select('displayedColumns'),
    this.total$,
    this.select('page'),
    this.limit$,
  ]).pipe(
    map(([status, data, filteredData, displayedColumns, total, page, limit]) => ({
      status,
      data,
      filteredData,
      displayedColumns,
      total,
      page,
      limit
    }))
  );

  constructor(private readonly dataService: DataService, private readonly actionFactory: RxActionFactory<Actions>) {
    super();
    this.set({
      data: [],
      filteredData: [],
      displayedColumns: [],
      total: 150,
      page: 1,
      limit: 10,
      filters: {},
      sorts: {},
    });

    const setPage$ = this.actions.setPage$.pipe(
      map(({ pageIndex, pageSize }: PageEvent) => ({ page: pageIndex + 1, limit: pageSize }))
    );
    const setFilters$ = this.actions.setFilters$.pipe(
      withLatestFrom(this.select('filters')),
      map(([{ column, filter }, filters]) => ({ filters: { ...filters, [column]: filter } }))
    );
    const setSorts$ = this.actions.setSorts$.pipe(
      withLatestFrom(this.select('sorts')),
      map(([{ column, sortDirection }, sorts]) => ({ sorts: { ...sorts, [column]: sortDirection } }))
    );
    this.connect(merge(this.updateDateFromApieffect$(), setPage$));
    this.connect(setFilters$);
    this.connect(setSorts$);
    this.connect('filteredData', this.applySortAndFiltersEffect$());
  }

  private updateDateFromApieffect$(): Observable<Partial<DataState>> {
    return combineLatest([this.limit$, this.select('page')]).pipe(
      switchMap(([limit, page]) =>
        this.dataService.getData(page, limit)
      ),
      withLatestFrom(this.select('displayedColumns'), this.select('sorts')),
      map(([{ status, data }, columns, sorts]) => {
        const displayedColumns = data && data[0] ? Object.keys(data[0]) : columns;
        displayedColumns.map(column => { if (!sorts[column]) sorts[column] = '' });
        return {
          status,
          data,
          displayedColumns,
          sorts,
        }
      })
    );
  }

  private applySortAndFiltersEffect$(): Observable<DataApiItem[]> {
    return combineLatest([this.select('filters'), this.select('sorts'), this.data$]).pipe(
      distinctUntilChanged(),
      map(([filters, sorts, data]) => {
        return data.filter(dataItem => this.isMatchFilter(dataItem, filters)).sort(this.propComparator(sorts));
      })
    );
  }

  private propComparator = (sorts: Sorts) =>
    (a: DataApiItem, b: DataApiItem) => {
      const compare = Object.keys(sorts).filter(key => sorts[key] !== '').reduce((compare, key) => {
        if (compare !== 0) {
          return compare;
        }
        const result = sorts[key] === 'desc' ? 1 : -1;
        return a[key] === b[key] ? 0 : a[key] < b[key] ? result : -result
      }, 0);

      return compare;
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

