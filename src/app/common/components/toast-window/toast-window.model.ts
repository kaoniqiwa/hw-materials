import { Type } from '@angular/core';

export interface IToastWindowData {
  [key: string]: any;
}

export interface IToastWindowEmitModel {
  ComponentTypeExpression?: Type<any>;
  Data: IToastWindowData;
}
