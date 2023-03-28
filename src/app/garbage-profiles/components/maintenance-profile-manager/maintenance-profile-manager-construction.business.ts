import { Injectable } from '@angular/core';
import {
  ConstructionApplyParams,
  ConstructionApproveParams,
} from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileManagerConstructionBusiness {
  constructor(private service: MaintenanceProfileRequestService) {}

  apply(id: string, params: ConstructionApplyParams) {
    return this.service.constructionApply(id, params);
  }
  approve(id: string, params: ConstructionApproveParams) {
    if (params.ApproveOrNot) {
      params.ConstructionApprovalReason = undefined;
    } else {
      params.MaintenanceDeadline = undefined;
    }
    return this.service.constructionApprove(id, params);
  }
}
