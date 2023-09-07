import { ChangeDetectionStrategy, Component, Inject, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, pipe, takeUntil } from 'rxjs';
import { DestroyService } from 'src/app/services';

@Component({
  selector: 'app-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ColumnFilterComponent),
    multi: true,
  },
    DestroyService,
  ]
})
export class ColumnFilterComponent implements ControlValueAccessor {
  public inputFormControl: FormControl<any>;
  private _disabled = false;
  private _value: string = '';
  private _column: string = '';

  get column() {
    return this._column;
  }

  @Input()
  set column(val) {
    this._column = val;
  }

  get value() {
    return this._value;
  }

  @Input()
  set value(val) {
    this._value = val;
    this.onChange(this._value);
  }

  constructor(@Inject(DestroyService) private readonly ngUnsubscribe$: Observable<void>) {
    this.inputFormControl = new FormControl();
    this.inputFormControl.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe$)
    ).subscribe((value: string) => {
      this._value = value;
      this.onChange(value);
      this.onTouched();
    });
  }

  public writeValue(obj: any): void {
    this._value = obj;
  }

  public registerOnChange(fn: (value: string) => {}): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  private onChange = (value: string) => { }
  private onTouched = () => { }
}
