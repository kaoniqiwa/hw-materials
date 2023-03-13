import { Component, Input } from '@angular/core';
import { MaterialItemModel } from 'src/app/model/material-item.model';

@Component({
  selector: 'material-item-table',
  templateUrl: './material-item-table.component.html',
  styleUrls: ['../table.less', './material-item-table.component.less'],
})
export class MaterialItemTableComponent {
  @Input()
  model?: MaterialItemModel[];

  widths: string[] = [];
}
