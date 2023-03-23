import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'maintenance_profile_state_step_pipe', pure: false })
export class MaintenanceProfileStateStepPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(state?: number) {
    switch (state) {
      case 1:
        return '派单';
      case 2:
        return '维修进度';
      case 3:
        return '工程审批';
      case 4:
        return '确认完成';
      default:
        return '查看';
    }
  }
}
