import { Injectable } from '@angular/core';
import { IConverter } from 'src/app/common/interfaces/converter.interface';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';

import { MaterialModel } from 'src/app/model/material.model';
import { Material } from 'src/app/network/entity/material.entity';
import { PagedList } from 'src/app/network/entity/page.entity';

@Injectable()
export class GarbageProfilesMaterialTablConverter
  implements IConverter<PagedList<Material>, PagedList<MaterialModel>>
{
  constructor(public vmConverter: ViewModelConverter) {}

  Convert(
    source: PagedList<Material>,
    ...res: any[]
  ): PagedList<MaterialModel> {
    let paged = new PagedList<MaterialModel>();
    paged.Page = source.Page;
    paged.Data = source.Data.map((x) => {
      return this.vmConverter.Material(x);
    });
    return paged;
  }
}
