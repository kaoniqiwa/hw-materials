import { Injectable } from '@angular/core';
import {
  IBusiness,
  IDownload,
} from 'src/app/common/interfaces/bussiness.interface';
import { MaterialModel } from 'src/app/model/material.model';
import { Material } from 'src/app/network/entity/material.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import {
  GetGarbageProfilesMaterialsParams,
  GetMaterialsExcelParams,
} from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';
import { GarbageProfilesMaterialTablConverter } from './garbage-profiles-material-table.converter';
import { GarbageProfilesMaterialTableArgs } from './garbage-profiles-material-table.model';

@Injectable()
export class GarbageProfilesMaterialTablBusiness
  implements
    IBusiness<PagedList<Material>, PagedList<MaterialModel>>,
    IDownload
{
  constructor(
    private service: GarbageProfilesMaterialRequestService,
    public Converter: GarbageProfilesMaterialTablConverter
  ) {}
  async load(
    args: GarbageProfilesMaterialTableArgs,
    index: number,
    size: number = 10
  ): Promise<PagedList<MaterialModel>> {
    let data = await this.getData(index, size, args);
    let model = this.Converter.convert(data);
    return model;
  }
  getData(
    index: number,
    size: number = 10,
    args: GarbageProfilesMaterialTableArgs
  ): Promise<PagedList<Material>> {
    let params = new GetGarbageProfilesMaterialsParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.Category = args.Category;
    params.Name = args.Name;

    return this.service.list(params);
  }

  async download(args: GarbageProfilesMaterialTableArgs): Promise<any> {
    let params = new GetMaterialsExcelParams();
    params.Category = args.Category;
    params.Name = args.Name;
    let url = await this.service.excel(params);
    return url.Url;
  }
}
