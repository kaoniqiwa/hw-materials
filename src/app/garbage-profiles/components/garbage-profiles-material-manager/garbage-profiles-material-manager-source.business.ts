import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';
import { GarbageProfilesMaterialManagerSource } from './garbage-profiles-material-manager.model';

@Injectable()
export class GarbageProfilesMaterialManagerSourceBusiness
  implements IBusiness<IModel, GarbageProfilesMaterialManagerSource>
{
  constructor(private service: GarbageProfilesMaterialRequestService) {}
  async load(...args: any): Promise<GarbageProfilesMaterialManagerSource> {
    let model = new GarbageProfilesMaterialManagerSource();
    model.categorys = await this.getCategorys();
    return model;
  }
  getData(...args: any): Promise<IModel> {
    throw new Error('Method not implemented.');
  }
  getCategorys() {
    return this.service.category.all();
  }
}
