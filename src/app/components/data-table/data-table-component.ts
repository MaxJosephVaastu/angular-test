import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { AppStateService, DestroyService } from '../../services';
import { Observable, distinctUntilChanged, merge, takeUntil } from 'rxjs';
import { FormArray, FormControl } from '@angular/forms';
import { FilterFormControls, SortFormControls } from 'src/app/types';

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
  public readonly sortsFormControls: SortFormControls = {};
  public formControl: FormControl<any> = new FormControl();
  public readonly filters$ = this.appStateService.select('filters');
  public readonly sorts$ = this.appStateService.select('sorts');

  constructor(private readonly appStateService: AppStateService, @Inject(DestroyService) private readonly ngUnsubscribe$: Observable<void>) {
    this.createFilterForm();
  }

  public handlePageEvent(e: PageEvent): void {
    this.appStateService.actions.setPage(e);
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
