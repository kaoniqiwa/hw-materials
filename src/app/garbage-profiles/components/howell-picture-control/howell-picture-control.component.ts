import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Medium } from 'src/app/common/tools/medium';

@Component({
  selector: 'howell-picture-control',
  templateUrl: './howell-picture-control.component.html',
  styleUrls: ['./howell-picture-control.component.less'],
})
export class HowellPictureControlComponent implements OnChanges {
  @Input()
  id?: string;
  @Input()
  contain: boolean = false;

  url?: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      if (this.id) {
        this.url = Medium.jpg(this.id);
      } else {
        this.url = undefined;
      }
    }
  }
}
