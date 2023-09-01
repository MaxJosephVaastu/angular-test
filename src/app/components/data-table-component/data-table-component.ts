import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { DataStateService } from '../../services';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {
  public readonly displayedColumns: string[] = ['id', 'job', 'name', 'rating', "account", "company"];
  public readonly vm$ = this.dataServiceState.vm$;
  // public readonly data$ = this.dataServiceState.select('data');

  constructor(private readonly dataServiceState: DataStateService) { }

  public handlePageEvent(e: PageEvent): void {
    this.dataServiceState.actions.setPage(e);
  }

  public handleSortData(sort: Sort): void {
    this.dataServiceState.actions.setSort(sort);
  }
}
