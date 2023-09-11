import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppStateService, DestroyService } from 'src/app/services';
import { ReportComponent } from '../report/report.component';
import { Observable, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ApiUrl } from 'src/app/types';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class ControlPanelComponent implements OnInit {
  public readonly controlPanelState$ = this.appStateService.controlPanelState$;
  public readonly apiUrls = this.appStateService.apiUrls;
  public selectApiControl = new FormControl<ApiUrl>(this.apiUrls[0]);

  constructor(public readonly dialog: MatDialog,
    private readonly appStateService: AppStateService,
    @Inject(DestroyService) private readonly ngUnsubscribe$: Observable<void>
  ) { }

  ngOnInit() {
    this.selectApiControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(selectedApi => {
      this.appStateService.actions.selectApi(selectedApi as ApiUrl);
    });
  }

  public createReport(): void {
    const dialogRef = this.dialog.open(ReportComponent);

    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe$)).subscribe(result => {
      if (result) {
        this.appStateService.actions.sendReport();
      }
    });
  }

}
