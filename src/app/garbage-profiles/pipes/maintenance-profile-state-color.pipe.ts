import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'maintenance_profile_state_color_pipe', pure: false })
export class MaintenanceProfileStateColorPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(state: number) {
    switch (state) {
      case 1: // 待派单
        return '#6997ff';
      case 2: // 已派单
        return '#ffba00';
      case 3: // 维修完成
        return '#21E452';
      case 4: // 维修未完成
        return '#ef6464';
      case 5: // 确认完成
        return 'cyan';
      default:
        return '#cfd7ff';
    }
  }
}
