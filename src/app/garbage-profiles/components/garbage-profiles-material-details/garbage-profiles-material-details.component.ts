import { Component, Input } from '@angular/core';
import { MaterialModel } from 'src/app/model/material.model';

@Component({
  selector: 'garbage-profiles-material-details',
  templateUrl: './garbage-profiles-material-details.component.html',
  styleUrls: ['./garbage-profiles-material-details.component.less'],
})
export class GarbageProfilesMaterialDetailsComponent {
  @Input()
  model: MaterialModel = new MaterialModel();
}
