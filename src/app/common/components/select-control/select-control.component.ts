import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-select-control',
  templateUrl: './select-control.component.html',
  styleUrls: ['./select-control.component.less'],
})
export class SelectControlComponent
  implements OnInit, OnChanges, AfterViewChecked
{
  @Input()
  data?: any[];
  @Input()
  cannull: boolean = true;
  @Input()
  default: boolean = false;
  @Input()
  disabled: boolean = false;

  @Input()
  public set style(v: any) {
    if (this._style === undefined) {
      this._style = {};
    }
    this._style = Object.assign(this._style, v);
  }
  private _style: any;
  public get style(): any {
    return this._style;
  }

  private _selected?: any = undefined;
  public get selected(): any | undefined {
    return this._selected;
  }
  @Input()
  public set selected(v: any | undefined) {
    this._selected = v;
    this.selectedChange.emit(v);
  }
  @Output()
  selectedChange: EventEmitter<any> = new EventEmitter();

  constructor(public detector: ChangeDetectorRef) {}
  ngAfterViewChecked(): void {
    if (this.element && this.cannull) {
      if (this.selected === undefined) {
        (this.element.nativeElement as HTMLSelectElement).value = '';
      }
    }
  }

  @ViewChild('element')
  element?: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (this.default) {
        if (this.data && this.data.length > 0) {
          if (!this.selected) {
            this.selected = this.data[0];
            return;
          }
        }
      }
      this.selected = undefined;
    }
  }

  ngOnInit(): void {}

  onclear(e: Event) {
    this.selected = undefined;

    e.stopImmediatePropagation();
  }
}
