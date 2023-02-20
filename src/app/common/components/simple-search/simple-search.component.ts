import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'howell-simple-search',
  templateUrl: './simple-search.component.html',
  styleUrls: ['./simple-search.component.less'],
})
export class SimpleSearchComponent implements OnInit {
  @Input() placeHolder = '';

  @Output() search = new EventEmitter<string>();

  @Input()
  public set value(v: string | undefined) {
    if (this._value === v) return;
    this._value = v;
    this.valueChange.emit(v);
  }
  private _value?: string;
  public get value(): string | undefined {
    return this._value;
  }
  @Output()
  valueChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
  onsearch() {
    this.search.emit(this.value);
  }
  getValue() {
    return this.value;
  }
}
