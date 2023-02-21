import { Component } from '@angular/core';
import { MaterialModel } from 'src/app/model/material.model';
import { GarbageProfilesMaterialTableArgs } from '../tables/garbage-profiles-material-table/garbage-profiles-material-table.model';

@Component({
  selector: 'garbage-profiles-material-manager',
  templateUrl: './garbage-profiles-material-manager.component.html',
  styleUrls: ['./garbage-profiles-material-manager.component.less'],
})
export class GarbageProfilesMaterialManagerComponent {
  args: GarbageProfilesMaterialTableArgs =
    new GarbageProfilesMaterialTableArgs();

  onselected(model: MaterialModel) {}
}
