import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxActionFactory } from '@rx-angular/state/actions';
import { RxFor } from "@rx-angular/template/for";
import { RxLet } from "@rx-angular/template/let";
import localeRu from '@angular/common/locales/ru';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ColumnFilterComponent, DataTableComponent, HomeComponent } from './components';
import { NumberAutoPipe } from './pipes';

registerLocaleData(localeRu);

@NgModule({
  declarations: [
    AppComponent,
    ColumnFilterComponent,
    DataTableComponent,
    HomeComponent,
    NumberAutoPipe,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    RxFor,
    RxLet,
  ],
  providers: [RxActionFactory, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
