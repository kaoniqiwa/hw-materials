import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IObjectModel } from 'src/app/common/interfaces/model.interface';
import { MaterialItemModel } from 'src/app/model/material-item.model';
import { PropertyValueModel } from 'src/app/model/property-value.model';
import { Camera } from 'src/app/network/entity/camera.entity';
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
  @Output()
  putout: EventEmitter<IObjectModel> = new EventEmitter();
  constructor(public language: GarbageStationProfilesLanguageTools) {}
  ngOnInit(): void {
    if (this.model) {
      switch (this.model.PropertyId) {
        case 'MaterialItems':
          this.MaterialItems = this.model.Value as MaterialItemModel[];
          break;
        case 'Cameras':
          this.Cameras = this.model.Value as Camera[];
          break;
        default:
          break;
      }
    }
  }

  MaterialItems?: MaterialItemModel[];
  Cameras?: Camera[];

  onputout(model: IObjectModel) {
    this.putout.emit(model);
  }
}
