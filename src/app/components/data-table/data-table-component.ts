import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { AppStateService, DestroyService } from '../../services';
import { Observable, distinctUntilChanged, merge, takeUntil } from 'rxjs';
import { FormArray, FormControl } from '@angular/forms';
import { DataApiItem, FilterFormControls, SortFormControls } from 'src/app/types';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})

export class DataTableComponent {
  public readonly dataTableState$ = this.appStateService.dataTableState$;
  public readonly filterFormControls: FilterFormControls = {};
  public readonly sortsFormControls: SortFormControls = {};
  public readonly filters$ = this.appStateService.select('filters');
  public readonly sorts$ = this.appStateService.select('sorts');

  constructor(private readonly appStateService: AppStateService, @Inject(DestroyService) private readonly ngUnsubscribe$: Observable<void>) {
    this.createFilterForm();
  }

  public changePage(e: PageEvent): void {
    this.appStateService.actions.setPage(e);
  }

  public toggleRow(id: number): void {
    this.appStateService.actions.selectRow(id);
  }

  public toggleAllRows(selected: boolean): void {
    this.appStateService.actions.toggleAllRows(selected);
  }

  private createFilterForm(): void {
    this.appStateService.select('displayedColumns')
      .pipe(
        distinctUntilChanged((prev, curr) => prev.toString() === curr.toString()),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe(columns => {
        columns.forEach(column => {
          this.sortsFormControls[column] = new FormControl();
          this.filterFormControls[column] = new FormControl();
          // console.log(column)

          this.sortsFormControls[column].valueChanges.pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((sortDirection: SortDirection) => this.appStateService.actions.setSorts({ column, sortDirection }));
          this.filterFormControls[column].valueChanges.pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((filter: string) => this.appStateService.actions.setFilters({ column, filter }));
        });
      });

  }
}
