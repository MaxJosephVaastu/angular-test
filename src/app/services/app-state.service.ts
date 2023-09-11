import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { RxActionFactory } from '@rx-angular/state/actions';
import { ApiUrl, DataState, TableDataItem } from '../types';
import { DataService } from './data.service';
import { Observable, combineLatest, merge } from 'rxjs';
import { distinctUntilChanged, exhaustMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Actions, Filters, Sorts } from '../actions/actions';
import { PageEvent } from '@angular/material/paginator';

const API_JSON_PLACEHOLDER = 'https://jsonplaceholder.typicode.com/posts';
const API_RETOOL_GENERATOR = 'https://api-generator.retool.com/uOTx4y/data-for-table';

@Injectable({ providedIn: 'root' })

export class AppStateService extends RxState<DataState>{
  public readonly apiUrls: ApiUrl[] = [
    { name: 'Retool Api Generator', url: API_RETOOL_GENERATOR },
    { name: 'JSON Placeholder', url: API_JSON_PLACEHOLDER },
  ];
  public readonly data$ = this.select('data');
  public readonly displayedColumns$ = this.select('displayedColumns');
  public readonly isSomeSelected$ = this.select('filteredData').pipe(map(filteredData => filteredData.some(item => Boolean(item.selected))));
  public readonly selectedDataForReport$ = this.select('filteredData').pipe(map(filteredData => filteredData.filter(item => Boolean(item.selected))));
  public readonly actions = this.actionFactory.create();

  public readonly dataTableState$ = combineLatest([
    this.select('status'),
    this.select('data'),
    this.select('filteredData'),
    this.select('displayedColumns'),
    this.select('total'),
    this.select('page'),
    this.select('limit'),
    this.isSomeSelected$,
  ]).pipe(
    map(([status, data, filteredData, displayedColumns, total, page, limit, isSomeSelected]) => ({
      status,
      data,
      filteredData,
      displayedColumns,
      total,
      page,
      limit,
      isAllSelected: filteredData.filter(item => !item.selected).length === 0,
      isSomeSelected,
    }))
  );

  public readonly controlPanelState$ = combineLatest([
    this.isSomeSelected$,
    this.select('apiUrl'),
  ]).pipe(
    map(([isSomeSelected, apiUrl]) => ({
      isSomeSelected,
      apiUrl,
    }))
  );

  public readonly reportState$ = combineLatest([
    this.selectedDataForReport$,
    this.displayedColumns$.pipe(map(columns => columns.filter(column => column !== 'select')))
  ]).pipe(
    map(([selectedData, displayedColumns]) => ({
      selectedData,
      displayedColumns,
    }))
  );


  constructor(private readonly dataService: DataService, private readonly actionFactory: RxActionFactory<Actions>) {
    super();
    this.initStateService();
    this.initActions();
  }

  private initStateService(): void {
    this.set({
      apiUrl: this.apiUrls[0],
      data: [],
      filteredData: [],
      displayedColumns: [],
      total: 150,
      page: 1,
      limit: 10,
      filters: {},
      sorts: {},
      result: undefined,
    });
  }

  private initActions(): void {
    const setPage$: Observable<Partial<DataState>> = this.actions.setPage$.pipe(
      map(({ pageIndex, pageSize }: PageEvent) => ({ page: pageIndex + 1, limit: pageSize }))
    );
    const setFilters$: Observable<Partial<DataState>> = this.actions.setFilters$.pipe(
      withLatestFrom(this.select('filters')),
      map(([{ column, filter }, filters]) => ({ filters: { ...filters, [column]: filter } }))
    );
    const setSorts$: Observable<Partial<DataState>> = this.actions.setSorts$.pipe(
      withLatestFrom(this.select('sorts')),
      map(([{ column, sortDirection }, sorts]) => ({ sorts: { ...sorts, [column]: sortDirection } }))
    );
    const selectRow$: Observable<Partial<DataState>> = this.actions.selectRow$.pipe(
      withLatestFrom(this.select('filteredData')),
      map(([rowId, filteredData]) => ({
        filteredData: [...(filteredData.map(item => {
          if (item.data['id'] === rowId) {
            item.selected = !item.selected;
          }
          return item;
        }))]
      }))
    );
    const toggleAllRows$: Observable<Partial<DataState>> = this.actions.toggleAllRows$.pipe(
      withLatestFrom(this.select('filteredData')),
      map(([selected, filteredData]) => ({
        filteredData: [...(filteredData.map(item => {
          item.selected = selected;

          return item;
        }))]
      }))
    );

    const sendReport$: Observable<Partial<DataState>> = this.actions.sendReport$.pipe(
      withLatestFrom(this.selectedDataForReport$),
      exhaustMap(([_, selectedData]) => this.dataService.sendReport(selectedData)),
      map((result) => ({ result }))
    );

    const selectApi$: Observable<Partial<DataState>> = this.actions.selectApi$.pipe(
      map((apiUrl: ApiUrl) => ({ apiUrl }))
    );

    this.connect(merge(this.updateDateFromApiEffect$(), setPage$));
    this.connect(merge(setFilters$, setSorts$, selectRow$, toggleAllRows$, sendReport$, selectApi$));
    this.connect('filteredData', this.applySortAndFiltersEffect$());
  }

  private updateDateFromApiEffect$(): Observable<Partial<DataState>> {
    return combineLatest([this.select('limit'), this.select('page'), this.select('apiUrl')]).pipe(
      switchMap(([limit, page, { url }]) =>
        this.dataService.getData(url, page, limit)
      ),
      withLatestFrom(this.select('displayedColumns'), this.select('sorts')),
      map(([{ status, data, total }, columns, sorts]) => {
        const displayedColumns = data && data.length > 0 && data[0].data ? ['select', ...Object.keys(data[0].data)] : columns;
        displayedColumns.map(column => { if (!sorts[column]) sorts[column] = '' });
        return {
          status,
          total,
          data,
          displayedColumns,
          sorts,
        }
      })
    );
  }

  private applySortAndFiltersEffect$(): Observable<TableDataItem[]> {
    return combineLatest([this.select('filters'), this.select('sorts'), this.data$]).pipe(
      distinctUntilChanged(),
      map(([filters, sorts, data]) => {
        return data.filter(dataItem => this.isMatchFilter(dataItem, filters)).sort(this.propComparator(sorts));
      })
    );
  }

  private propComparator = (sorts: Sorts) =>
    (a: TableDataItem, b: TableDataItem) => {
      const compare = Object.keys(sorts).filter(key => sorts[key] !== '').reduce((compare, key) => {
        if (compare !== 0) {
          return compare;
        }
        const result = sorts[key] === 'desc' ? 1 : -1;
        return a.data[key] === b.data[key] ? 0 : a.data[key] < b.data[key] ? result : -result
      }, 0);

      return compare;
    }

  private isMatchFilter(dataItem: TableDataItem, filters: Filters): boolean {
    const match = Object.keys(dataItem.data).reduce((isMatch, key) => {
      const fllterValue = filters[key] && filters[key].trim().toLowerCase();
      return isMatch && (!fllterValue || !!fllterValue && dataItem.data[key].toString().toLowerCase().includes(fllterValue))
    }, true
    );

    return match;
  }

}

