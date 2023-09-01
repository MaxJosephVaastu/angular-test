import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTableComponent, HomeComponent } from './components';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RxLet } from "@rx-angular/template/let";
import { RxActionFactory } from '@rx-angular/state/actions';

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RxLet,
  ],
  providers: [RxActionFactory],
  bootstrap: [AppComponent]
})
export class AppModule { }
