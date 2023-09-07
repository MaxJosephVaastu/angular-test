import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { AppStateService, DestroyService } from '../../services';
import { Observable, distinctUntilChanged, merge, takeUntil } from 'rxjs';
import { FormArray, FormControl } from '@angular/forms';
import { FilterFormControls } from 'src/app/types';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})

export class DataTableComponent {
  public readonly dataState$ = this.appStateService.dataState$;
  public readonly filterFormControls: FilterFormControls = {};
  public formControl: FormControl<any> = new FormControl();
  public readonly filters$ = this.appStateService.select('filters');

  constructor(private readonly appStateService: AppStateService, @Inject(DestroyService) private readonly ngUnsubscribe$: Observable<void>) {
    this.createFilterForm();
  }

  public handlePageEvent(e: PageEvent): void {
    this.appStateService.actions.setPage(e);
  }

  public handleSortData(sort: Sort): void {
    this.appStateService.actions.setSort(sort);
  }

  private createFilterForm(): void {
    this.appStateService.select('displayedColumns')
      .pipe(
        distinctUntilChanged((prev, curr) => prev.toString() === curr.toString()),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe(columns => {
        columns.forEach(column => {
          this.filterFormControls[column] = new FormControl();
          // console.log(column)

          this.filterFormControls[column].valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(filter => this.appStateService.actions.setFilters({ column, filter }));
        });
      });

  }
}
