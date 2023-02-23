import { Component, Input } from '@angular/core';
import { MaterialModel } from 'src/app/model/material.model';
import { MaterialItem } from 'src/app/network/entity/material-item.enitty';

@Component({
  selector: 'garbage-profiles-material-putin',
  templateUrl: './garbage-profiles-material-putin.component.html',
  styleUrls: ['./garbage-profiles-material-putin.component.less'],
})
export class GarbageProfilesMaterialPutInComponent {
  @Input()
  model?: MaterialModel;

  item: MaterialItem = new MaterialItem();

  touchSpinChange(num: any) {
    this.item.Number = num;
  }
  onok() {}
  oncancel() {}
}
