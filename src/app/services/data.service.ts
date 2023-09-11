import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, merge, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataApiItem, TableDataItem } from '../types/data.types';
import { toApiResponse } from '../utils/to-api-response';
import { DataState } from '../types';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private readonly httpClient: HttpClient) { }

  public getData(apiUrl: string, page: number = 1, limit: number = 10): Observable<Partial<DataState>> {
    const params = {
      _limit: limit,
      _page: page
    };

    const receivedData$: Observable<TableDataItem[]> = this.httpClient.get<DataApiItem[]>(apiUrl, { params }).pipe(
      map(receivedData => (receivedData.map((data) => ({ data }))))
    );
    const receivedDataCount$ = this.httpClient.get<DataApiItem[]>(apiUrl, {}).pipe(
      map(receivedData => receivedData.length)
    );
    return combineLatest([receivedData$, receivedDataCount$])
      .pipe(
        toApiResponse()
      );
  }

  public sendReport(selectedData: TableDataItem[]): Observable<boolean> {
    console.log('=====  send to backend report========');
    console.log(selectedData);
    console.log('=====================================');

    return of(true);
  }
}
