import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { HowellTouchSpinOptions } from './touch-spin.class';
declare var $: any;
@Directive({
  selector: '[appTouchSpin]',
})
export class TouchSpinDirective implements AfterViewInit, OnChanges {
  @Input() options = new HowellTouchSpinOptions();

  @Output() touchSpinChange = new EventEmitter();

  @Input()
  number?: number;
  @Output()
  numberChange: EventEmitter<number> = new EventEmitter();
  constructor(private _ele: ElementRef<HTMLInputElement>) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['number']) {
      if (this.number !== undefined) {
        let input = this._ele.nativeElement as HTMLInputElement;
        input.value = this.number.toString();
      }
    }
  }
  ngAfterViewInit(): void {
    $(this._ele.nativeElement)
      .TouchSpin(this.options)
      .on('change', (e: any) => {
        this.touchSpinChange.emit(this._ele.nativeElement.value);
        this.number = parseInt(this._ele.nativeElement.value);
        this.numberChange.emit(this.number);
      });
  }
}
