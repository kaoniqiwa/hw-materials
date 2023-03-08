import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IConverter } from '../common/interfaces/converter.interface';
import { MaterialModel } from '../model/material.model';
import { Material } from '../network/entity/material.entity';

import { GarbageProfilesMaterialRequestService } from '../network/request/garbage-profiles/materials/garbage-profiles-materials.service';

@Injectable({
  providedIn: 'root',
})
export class MaterialConverter
  implements
    IConverter<
      Material | Promise<Material>,
      MaterialModel | Promise<MaterialModel>
    >
{
  constructor(private service: GarbageProfilesMaterialRequestService) {}

  convert(source: Material): MaterialModel;
  convert(source: Promise<Material>): Promise<MaterialModel>;
  convert(
    source: Material | Promise<Material>
  ): MaterialModel | Promise<MaterialModel> {
    if (source instanceof Material) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(MaterialModel, plain);

      model.CategoryInfo = this.service.category.get(source.Category);

      return model;
    } else {
      return source.then((x) => {
        return this.convert(x);
      });
    }
  }
}
