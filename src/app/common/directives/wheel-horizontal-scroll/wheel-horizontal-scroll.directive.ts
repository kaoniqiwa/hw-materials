import {
  AfterContentInit,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';

declare let $: any;

@Directive({
  selector: '[WheelHorizontalScroll]',
})
export class WheelHorizontalScrollDirective
  implements OnInit, AfterContentInit, OnDestroy
{
  private ele: HTMLInputElement;

  private handle: any;

  constructor(e: ElementRef) {
    this.ele = e.nativeElement;
  }
  ngOnInit(): void {
    this.handle = this.event.bind(this);
  }
  ngAfterContentInit(): void {
    this.ele.addEventListener('wheel', this.handle);
  }
  ngOnDestroy(): void {
    this.ele.removeEventListener('wheel', this.handle);
  }
  event(e: WheelEvent) {
    e.preventDefault();
    this.ele.scrollBy({
      left: e.deltaY < 0 ? -120 : 120,
    });
  }
}
