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
        return '申请';
      case 3:
        return '审批';
      case 4:
        return '递交';
      default:
        return '查看';
    }
  }
}
