import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'howell-picture-control-multiple',
  templateUrl: './howell-picture-control-multiple.component.html',
  styleUrls: ['./howell-picture-control-multiple.component.less'],
})
export class HowellPictureControlMultipleComponent implements OnInit {
  @Input()
  ids: string[] = [];
  @Input()
  contain: boolean = false;

  ngOnInit(): void {}

  index = 0;
}
