import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppStateService } from 'src/app/services';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportComponent {
  public reportState$ = this.appStateService.reportState$;

  constructor(private readonly appStateService: AppStateService) { }
}
