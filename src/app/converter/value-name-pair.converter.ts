import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IConverter } from '../common/interfaces/converter.interface';
import { ValueNamePairModel } from '../model/value-name-pair.model';
import { ValueNamePair } from '../network/entity/value-name-pair.entity';

@Injectable({
  providedIn: 'root',
})
export class ValueNamePairConverter
  implements IConverter<ValueNamePair, ValueNamePairModel>
{
  constructor() {}

  convert(source: ValueNamePair): ValueNamePairModel {
    let plain = instanceToPlain(source);
    let model = plainToInstance(ValueNamePairModel, plain);

    return model;
  }
}
