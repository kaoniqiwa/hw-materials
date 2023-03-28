import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'maintenance_construction_state_step_pipe', pure: false })
export class MaintenanceConstructionStateStepPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(state?: number) {
    switch (state) {
      case undefined:
      case null:
        return '申请';
      case 1:
        return '审批';
      default:
        return '';
    }
  }
}
