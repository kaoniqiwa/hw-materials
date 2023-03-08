import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IConverter } from '../common/interfaces/converter.interface';
import { MaterialItemModel } from '../model/material-item.model';
import { MaterialItem } from '../network/entity/material-item.enitty';

import { GarbageProfilesMaterialRequestService } from '../network/request/garbage-profiles/materials/garbage-profiles-materials.service';
import { MaterialConverter } from './material.converter';

@Injectable({
  providedIn: 'root',
})
export class MaterialItemConverter
  implements
    IConverter<
      MaterialItem | Promise<MaterialItem>,
      MaterialItemModel | Promise<MaterialItemModel>
    >
{
  constructor(
    private service: GarbageProfilesMaterialRequestService,
    private material: MaterialConverter
  ) {}

  convert(source: MaterialItem): MaterialItemModel {
    let plain = instanceToPlain(source);
    let model = plainToInstance(MaterialItemModel, plain);
    model.Model = this.service.get(source.Id).then((x) => {
      return this.material.convert(x);
    });
    return model;
  }
}
