import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'maintenance_construction_state_color_pipe', pure: false })
export class MaintenanceConstructionStateColorPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(state: number) {
    switch (state) {
      case 1:
        return '#ef6464';
      case 2:
        return '#ffba00';
      case 3:
        return '#ff0';
      case 4:
        return '#21E452';
      case 5:
        return 'cyan';
      case 6:
        return '#6997ff';
      case 7:
        return '#ca98f9';
      case 8:
        return '#fff';
      default:
        return '#fff';
    }
  }
}
