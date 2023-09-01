import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SortDirection } from '@angular/material/sort';
import { DataApiItem } from '../types/data.types';
import { toApiResponse } from '../utils/to-api-response';
import { DataState } from '../types';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly ApiBaseUrl = 'https://api-generator.retool.com/uOTx4y/data-for-table';

  constructor(private readonly httpClient: HttpClient) { }

  public getData(
    sort: string = 'id', order: SortDirection = 'asc', page: number = 1, limit: number = 5
  ): Observable<Partial<DataState>> {
    const params = {
      _sort: sort,
      _order: order,
      _limit: limit,
      _page: page
    };

    return this.httpClient
      .get<DataApiItem[]>(this.ApiBaseUrl, { params })
      .pipe(
        toApiResponse()
      );
  }
}
