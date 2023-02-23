import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { HowellTouchSpinOptions } from './touch-spin.class';
declare var $: any;
@Directive({
  selector: '[appTouchSpin]',
})
export class TouchSpinDirective implements AfterViewInit {
  @Input() options = new HowellTouchSpinOptions();

  @Output() touchSpinChange = new EventEmitter();

  constructor(private _ele: ElementRef<HTMLInputElement>) {}
  ngAfterViewInit(): void {
    $(this._ele.nativeElement)
      .TouchSpin(this.options)
      .on('change', (e: any) => {
        this.touchSpinChange.emit(this._ele.nativeElement.value);
      });
  }
}
