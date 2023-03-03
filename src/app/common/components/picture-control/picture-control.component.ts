import { Component, Input } from '@angular/core';

@Component({
  selector: 'picture-control',
  templateUrl: './picture-control.component.html',
  styleUrls: ['./picture-control.component.less'],
})
export class PictureControlComponent {
  @Input()
  url?: string;
  @Input()
  contain: boolean = false;
}
