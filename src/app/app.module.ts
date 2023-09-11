import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxActionFactory } from '@rx-angular/state/actions';
import { RxFor } from "@rx-angular/template/for";
import { RxLet } from "@rx-angular/template/let";
import localeRu from '@angular/common/locales/ru';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  ColumnFilterComponent,
  ColumnHeaderComponent,
  ControlPanelComponent,
  DataTableComponent,
  HomeComponent,
  ReportComponent,
} from './components';
import { NumberAutoPipe, SortDirectionToIconPipe } from './pipes';
import { RxState } from '@rx-angular/state';

registerLocaleData(localeRu);

@NgModule({
  declarations: [
    AppComponent,
    ColumnFilterComponent,
    ColumnHeaderComponent,
    ControlPanelComponent,
    DataTableComponent,
    HomeComponent,
    NumberAutoPipe,
    ReportComponent,
    SortDirectionToIconPipe,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    RxFor,
    RxLet,
  ],
  providers: [RxState, RxActionFactory, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
