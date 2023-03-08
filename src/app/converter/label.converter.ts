import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IConverter } from '../common/interfaces/converter.interface';
import { LabelModel } from '../model/label.model';
import { Label } from '../network/entity/label.entity';

@Injectable({
  providedIn: 'root',
})
export class LabelConverter implements IConverter<Label, LabelModel> {
  constructor() {}

  convert(source: Label): LabelModel {
    let plain = instanceToPlain(source);
    let model = plainToInstance(LabelModel, plain);
    switch (source.State) {
      case 1:
        model.StateName = '注销';
        break;
      case 0:

      default:
        model.StateName = '正常';
        break;
    }
    return model;
  }
}
