import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

export interface Actions {
    setPage: PageEvent;
    setSort: Sort;
}