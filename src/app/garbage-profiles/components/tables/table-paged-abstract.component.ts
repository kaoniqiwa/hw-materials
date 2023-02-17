import { EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Page } from 'src/app/network/entity/page.entity';
import { Language } from 'src/app/tools/language.tool';

export abstract class PagedTableAbstractComponent<T> {
  abstract widths: Array<string>;
  abstract load?: EventEmitter<any>;
  Language = Language;
  datas: T[] = [];
  page: Page = new Page();
  loading = false;
  pageSize = 9;

  getPaged(count: number, size: number): Page {
    let current = size % count;
    if (current === 0) {
      current = size;
    }

    let page = {
      PageSize: size,
      PageCount: Math.ceil(count / size),
      PageIndex: Math.ceil(count / size),
      RecordCount: current,
      TotalRecordCount: count,
    };
    return page;
  }

  abstract loadData(index: number, size: number, ...args: any[]): void;

  pageEvent(page: PageEvent) {
    this.loadData(page.pageIndex + 1, this.pageSize);
  }
}
