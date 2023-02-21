import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { MaterialModel } from 'src/app/model/material.model';
import { Material } from 'src/app/network/entity/material.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import { GetGarbageProfilesBasicMaterialsParams } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.params';
import { GarbageProfilesBasicRequestService } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.service';
import { GarbageProfilesMaterialTablConverter } from './garbage-profiles-material-table.converter';
import { GarbageProfilesMaterialTableArgs } from './garbage-profiles-material-table.model';

@Injectable()
export class GarbageProfilesMaterialTablBusiness
  implements IBusiness<PagedList<Material>, PagedList<MaterialModel>>
{
  constructor(
    private service: GarbageProfilesBasicRequestService,
    public Converter: GarbageProfilesMaterialTablConverter
  ) {}
  async load(
    args: GarbageProfilesMaterialTableArgs,
    index: number,
    size: number = 10
  ): Promise<PagedList<MaterialModel>> {
    let data = await this.getData(index, size, args.Category, args.Name);
    let model = this.Converter.Convert(data);
    return model;
  }
  getData(
    index: number,
    size: number = 10,
    category?: number,
    name?: string
  ): Promise<PagedList<Material>> {
    let params = new GetGarbageProfilesBasicMaterialsParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.Category = category;
    params.Name = name;

    return this.service.material.list(params);
  }
}
