/*
 * @Author: pmx
 * @Date: 2021-12-30 15:27:11
 * @Last Modified by: pmx
 * @Last Modified time: 2023-01-13 20:08:57
 */
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  DoCheck,
  ElementRef,
  Inject,
  Injector,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Optional,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatPaginatorDefaultOptions,
  MAT_PAGINATOR_DEFAULT_OPTIONS,
  _MatPaginatorBase,
} from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { PaginatorIntl } from './paginator-intl';

export type Constructor<T> = new (...args: any[]) => T;

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.less'],
  host: { class: 'paginator' },
  providers: [PaginatorIntl],
  exportAs: 'paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PaginatorComponent
  extends _MatPaginatorBase<MatPaginatorDefaultOptions>
  implements AfterViewInit, OnChanges
{
  @Input()
  override get pageIndex() {
    return super.pageIndex;
  }
  override set pageIndex(value: number) {
    // console.log('set pageIndex');
    if (this.pageIndex == value) return;
    super.pageIndex = value;
    this._updatePageRange(this.pageIndex);
  }
  @Input()
  get pagerCount(): number {
    return this._pagerCount;
  }
  set pagerCount(value: number) {
    this._pagerCount =
      value <= 0 ? this.getNumberOfPages() : value < 3 ? 3 : value;
  }

  /***************** private ************************/
  // 显示几个分页按钮
  private _pagerCount = 4; // 不能小于等于0，但可以超出 max pager count

  /***************** public ************************/
  public pagers: number[] = [];
  public showFirst: boolean = false;
  public showLast: boolean = false;
  public jumpToIndex: string = '';

  constructor(
    private _toastrService: ToastrService,
    public intl: PaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(MAT_PAGINATOR_DEFAULT_OPTIONS)
    defaults?: MatPaginatorDefaultOptions
  ) {
    super(intl, changeDetectorRef, defaults);
  }
  override ngOnInit(): void {
    super.ngOnInit();
  }
  ngAfterViewInit(): void {
    this._updatePageRange(this.pageIndex);
  }

  // 长度改变后，重新生成
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    if ('length' in changes) {
      // console.log('change length');
      this._updatePageRange(this.pageIndex);
    }
  }
  swipePage(pageIndex: number) {
    let previousPageIndex = this.pageIndex;
    this.pageIndex = pageIndex;

    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length,
    });
    this._updatePageRange(this.pageIndex);
  }

  previousGroup() {
    this.swipePage(this.pageIndex - (this.pagerCount - 2));
  }
  nextGroup() {
    this.swipePage(this.pageIndex + (this.pagerCount - 2));
  }
  private _updatePageRange(pageIndex: number) {
    // console.log('pagers', this.getNumberOfPages());

    this.pagers = [];
    this.showFirst = false;
    this.showLast = false;
    if (this.pagerCount <= 0) {
      this.pagerCount = this.getNumberOfPages();
    }

    let halfPagerCount = (this.pagerCount - 1) / 2;

    // console.log('halfPagerCount', halfPagerCount);

    if (this.getNumberOfPages() > this.pagerCount) {
      if (pageIndex + 1 > 1 + halfPagerCount) {
        this.showFirst = true;
      }
      if (pageIndex + 1 < this.getNumberOfPages() - halfPagerCount) {
        this.showLast = true;
      }
    }

    // console.log('show first', this.showFirst);
    // console.log('show last', this.showLast);

    if (this.showFirst && !this.showLast) {
      let startPage = this.getNumberOfPages() - (this.pagerCount - 2);
      for (let i = startPage; i < this.getNumberOfPages(); i++) {
        this.pagers.push(i);
      }
    } else if (!this.showFirst && this.showLast) {
      for (let i = 2; i < this.pagerCount; i++) {
        this.pagers.push(i);
      }
    } else if (this.showFirst && this.showLast) {
      // 去掉首尾后分半
      let offset = Math.floor((this.pagerCount - 2) / 2); //1

      // 注意 pageIndex从0开始计数
      for (let i = pageIndex + 1 - offset; i <= pageIndex + 1 + offset; i++) {
        this.pagers.push(i);
      }
    } else {
      for (let i = 2; i < this.getNumberOfPages(); i++) {
        this.pagers.push(i);
      }
    }

    // 由于更改 pagers 是在 afterViewInit之后，需要手动更新视图
    this.changeDetectorRef.detectChanges();
  }
  validateInput(e: KeyboardEvent) {
    return /\d/.test(e.key);
  }

  operateJump() {
    // console.log('operateJump');
    // console.log(this.jumpToIndex);
    // console.log(this.getNumberOfPages());
    let index = +this.jumpToIndex;
    if (index == 0 || index > this.getNumberOfPages()) {
      this._toastrService.error('无效的页码', '', {
        // positionClass: 'toast-top-right',
      });
      return;
    } else {
      this.swipePage(index - 1);
    }
  }
}
