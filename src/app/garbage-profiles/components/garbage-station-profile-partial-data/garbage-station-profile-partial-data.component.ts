import { Component, Input } from '@angular/core';
import { PropertyValueModel } from 'src/app/model/property-value.model';
import { GarbageStationProfilesLanguageTools } from '../../tools/language.tool';

@Component({
  selector: 'garbage-station-profile-partial-data',
  templateUrl: './garbage-station-profile-partial-data.component.html',
  styleUrls: ['./garbage-station-profile-partial-data.component.less'],
})
export class GarbageStationProfilePartialDataComponent {
  @Input()
  model?: PropertyValueModel;
  constructor(public language: GarbageStationProfilesLanguageTools) {}

  onok() {}
  oncancel() {}
}
