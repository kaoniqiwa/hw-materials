import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Language } from '../../tools/language';

import { WindowViewModel } from './window.model';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css'],
})
export class WindowComponent {
  Language = Language;
  @Input()
  Model: WindowViewModel = {
    show: false,
  };

  @Input()
  Background = true;

  @Input()
  CloseButton = true;
  @Input()
  title: string = '';

  private _style: any = {
    width: '80%',
    height: '80%',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
  };
  public get style(): any {
    return this._style;
  }
  @Input()
  public set style(v: any) {
    this._style = Object.assign(this._style, v);
  }

  @Output()
  OnClosing: EventEmitter<boolean> = new EventEmitter();

  @Input()
  manualClose = false;

  constructor() {}

  closeButtonClick() {
    if (this.manualClose === false) {
      this.Model.show = false;
    }
    this.OnClosing.emit(true);
  }
}
