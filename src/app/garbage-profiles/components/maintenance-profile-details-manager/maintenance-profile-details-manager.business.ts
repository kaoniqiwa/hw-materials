import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import {
  ConstructionApplyParams,
  ConstructionApproveParams,
  CreateMaintenanceProfileParams,
  DistributeMaintenanceProfileParams,
  GetMaintenanceProfilePropertiesParams,
  SubmitMaintenanceProfileParams,
} from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileDetailsManagerBusiness
  implements IBusiness<PartialData, MaintenanceProfile>
{
  constructor(private service: MaintenanceProfileRequestService) {}
  async load(id: string, state: number): Promise<MaintenanceProfile> {
    let names = await this.getNames(state);
    names.push('ProfileState');
    let data = await this.getData(id, names);
    let plain = instanceToPlain(data);
    let model = plainToInstance(MaintenanceProfile, plain);
    return model;
  }
  getData(id: string, names: string[]): Promise<PartialData> {
    return this.service.partialData.get(id, names);
  }

  async getNames(state: number) {
    let params = new GetMaintenanceProfilePropertiesParams();
    params.Category = state;
    let paged = await this.service.property.list(params);
    return paged.Data.map((x) => x.Name);
  }

  /** 创建工单 */
  create(params: CreateMaintenanceProfileParams) {
    return this.service.create(params);
  }
  /** 分派维修工单 */
  distribute(id: string, params: DistributeMaintenanceProfileParams) {
    return this.service.distribute(id, params);
  }
  /** 申请工程维修（需要施工） */
  constructionapply(id: string, params: ConstructionApplyParams) {
    return this.service.constructionApply(id, params);
  }
  /** 审批工程维修（需要施工） */
  constructionapprove(id: string, params: ConstructionApproveParams) {
    return this.service.constructionApprove(id, params);
  }
  /** 提交维修完成或维修未完成 */
  submit(id: string, params: SubmitMaintenanceProfileParams) {
    return this.service.submit(id, params);
  }
}
