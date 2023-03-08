import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { Material } from 'src/app/network/entity/material.entity';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';
import { GarbageProfilesMaterialRecordSource } from './garbage-profiles-material-record.model';

@Injectable()
export class GarbageProfilesMaterialRecordSourceBusiness
  implements IBusiness<Material[], GarbageProfilesMaterialRecordSource>
{
  constructor(
    private service: GarbageProfilesMaterialRequestService,
    private converter: ViewModelConverter
  ) {}
  async load(...args: any): Promise<GarbageProfilesMaterialRecordSource> {
    let data = await this.getData();
    let model = new GarbageProfilesMaterialRecordSource();
    model.materials = data.map((x) => {
      return this.converter.material.convert(x);
    });
    return model;
  }
  async getData(...args: any): Promise<Material[]> {
    let paged = await this.service.list();
    return paged.Data;
  }
}
