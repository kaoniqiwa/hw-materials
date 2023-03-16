import { Component, Input, OnInit } from '@angular/core';
import { MaterialItemModel } from 'src/app/model/material-item.model';
import { PropertyValueModel } from 'src/app/model/property-value.model';
import { GarbageStationProfilesLanguageTools } from '../../tools/language.tool';

@Component({
  selector: 'garbage-station-profile-partial-data',
  templateUrl: './garbage-station-profile-partial-data.component.html',
  styleUrls: ['./garbage-station-profile-partial-data.component.less'],
})
export class GarbageStationProfilePartialDataComponent implements OnInit {
  @Input()
  model?: PropertyValueModel;
  @Input()
  profileId?: string;
  constructor(public language: GarbageStationProfilesLanguageTools) {}
  ngOnInit(): void {
    if (this.model) {
      switch (this.model.PropertyId) {
        case 'MaterialItems':
          this.MaterialItems = this.model.Value as MaterialItemModel[];
          break;

        default:
          break;
      }
    }
  }

  MaterialItems?: MaterialItemModel[];

  onok() {}
  oncancel() {}
}
