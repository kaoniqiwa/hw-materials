import { EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Language } from 'src/app/common/tools/language';
import { Page } from 'src/app/network/entity/page.entity';

export abstract class PagedTableAbstractComponent<T> {
  abstract widths: Array<string>;
  abstract load?: EventEmitter<any>;

  abstract loadData(index: number, size: number, ...args: any[]): void;

  Language = Language;
  datas: T[] = [];
  page: Page = new Page();
  loading = false;
  pageSize = 10;

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

  pageEvent(page: PageEvent) {
    this.loadData(page.pageIndex + 1, this.pageSize);
  }
}

export abstract class PagedTableSelectionAbstractComponent<
  T
> extends PagedTableAbstractComponent<T> {
  abstract selected?: T[];
  abstract selectedChange: EventEmitter<T[]>;
  onselected(item: T) {
    if (!this.selected) {
      this.selected = [];
    }
    let index = this.selected.indexOf(item);
    if (index < 0) {
      this.selected.push(item);
    } else {
      this.selected.splice(index, 1);
    }
    this.selectedChange.emit(this.selected);
  }
}
