import { EventEmitter, Injectable, InjectionToken, Type } from '@angular/core';
import { GlobalStorageService } from '../../service/global-storage.service';
import { IToastWindowData } from './toast-window.model';

export const TOAST_WINDOW_TOKEN = new InjectionToken<IToastWindowData>(
  'TOAST_WINDOW_TOKEN'
);

@Injectable()
export class ToastWindowService {
  customEvent = new EventEmitter<IToastWindowEvent>();

  private _data: IToastWindowData | null = null;
  set data(value: IToastWindowData | null) {
    this._data = value;
  }
  get data() {
    return this._data;
  }

  constructor() {}

  reset() {
    this.data = null;
  }
}

export interface IToastWindowEvent {
  Type: ToastWindowType;
  Data: any;
  Component: Type<any>;
  Close: boolean;
}

export enum ToastWindowType {
  ClickMap = 0,
  ClickLine = 1,
  ClickImage = 2,
  ClickVideo = 3,
}
