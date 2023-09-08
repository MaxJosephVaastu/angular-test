import { ChangeDetectionStrategy, Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SortDirection } from '@angular/material/sort';
import { RxState } from '@rx-angular/state';
import { RxActionFactory } from '@rx-angular/state/actions';
import { map, withLatestFrom } from 'rxjs/operators';
import { ColumnHeaderAcions } from 'src/app/actions/actions';
import { ColumnHeaderState } from 'src/app/types';

@Component({
  selector: 'app-column-header',
  templateUrl: './column-header.component.html',
  styleUrls: ['./column-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ColumnHeaderComponent),
    multi: true,
  },
    RxState,
  ]
})
export class ColumnHeaderComponent implements ControlValueAccessor {
  public readonly actions = this.actionFactory.create();
  public readonly state$ = this.state.select();
  public readonly sort$ = this.state.select('sortDirection');
  private _disabled = false;

  private _value: SortDirection = '';
  private _column: string = '';

  get column() {
    return this._column;
  }

  @Input() set column(val) {
    this._column = val;
  }

  get value() {
    return this._value;
  }

  @Input() set value(val) {
    this._value = val;
    this.onChange(this._value);
  }

  constructor(public readonly state: RxState<ColumnHeaderState>, private readonly actionFactory: RxActionFactory<ColumnHeaderAcions>) {

    const toggleSort$ = this.actions.toggleSort$.pipe(
      withLatestFrom(this.state.select('sortDirection')),
      map(([_, sortDirection]) => {
        const newDirection: SortDirection = sortDirection === '' ? 'asc' : sortDirection === 'asc' ? 'desc' : '';
        this._value = newDirection;
        this.onChange(newDirection);
        this.onTouched();
        return ({ sortDirection: newDirection })
      })
    );

    this.state.connect(toggleSort$);
    this.state.set({ sortDirection: '' })
  }

  public writeValue(obj: any): void {
    this._value = obj;
  }

  public registerOnChange(fn: (value: SortDirection) => {}): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  private onChange = (value: SortDirection) => { }
  private onTouched = () => { }
}
