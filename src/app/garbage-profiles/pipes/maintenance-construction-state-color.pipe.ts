import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'maintenance_construction_state_color_pipe', pure: false })
export class MaintenanceConstructionStateColorPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(state?: number) {
    switch (state) {
      case 1: //  申请工程维修
        return '#ff0';
      case 2: //  已批准工程维修
        return '#21E452';
      case 3: //  驳回工程维修
        return '#ef6464';
      default:
        return '#cfd7ff';
    }
  }
}
