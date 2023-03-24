import {
  ConstructionApplyParams,
  ConstructionApproveParams,
  CreateMaintenanceProfileParams,
  DistributeMaintenanceProfileParams,
  SubmitMaintenanceProfileParams,
} from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';

export class MaintenanceProfileDetailsManagerParams {
  create = new CreateMaintenanceProfileParams();
  distribute = new DistributeMaintenanceProfileParams();
  constructionapply = new ConstructionApplyParams();
  constructionapprove = new ConstructionApproveParams();
  submit = new SubmitMaintenanceProfileParams();
}
