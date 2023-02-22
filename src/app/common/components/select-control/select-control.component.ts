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
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';

@Component({
  selector: 'app-select-control',
  templateUrl: './select-control.component.html',
  styleUrls: ['./select-control.component.less'],
})
export class SelectControlComponent
  implements OnInit, OnChanges, AfterViewChecked
{
  @Input()
  data?: ValueNamePair[];
  @Input()
  cannull: boolean = false;
  @Input()
  default: boolean = true;

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

  private _selected?: number = undefined;
  public get selected(): number | undefined {
    return this._selected;
  }
  @Input()
  public set selected(v: number | undefined) {
    this._selected = v;
    this.selectedChange.emit(v);
  }
  @Output()
  selectedChange: EventEmitter<number> = new EventEmitter();

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
            this.selected = this.data[0].Value;
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
