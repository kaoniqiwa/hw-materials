import { Component, Input } from '@angular/core';
import { Camera } from 'src/app/network/entity/camera.entity';
import { GarbageStationProfilesLanguageTools } from '../../tools/garbage-station-profile-language.tool';

@Component({
  selector: 'garbage-station-profile-partial-data-cameras',
  templateUrl: './garbage-station-profile-partial-data-cameras.component.html',
  styleUrls: ['./garbage-station-profile-partial-data-cameras.component.less'],
})
export class GarbageStationProfilePartialDataCamerasComponent {
  @Input()
  models?: Camera[];

  constructor(public language: GarbageStationProfilesLanguageTools) {}

  propertyNames = [
    'Name',
    'Model',
    'SerialNo',
    'Placement',
    'AccessServer',
    'Resolution',
    'Bitrate',
    'StorageTime',
    'ActionEquipment',
    'AudioOutputState',
    'AudioVolume',
    'AIModelType',
    'BsCameraId',
  ];

  index: number = 0;
  selected?: Camera;
}
