import { Component, Input, OnInit } from '@angular/core';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfileDetailsSourceBusiness } from './garbage-station-profile-details-source.business';
import { GarbageStationProfileDetailsSource } from './garbage-station-profile-details.model';

@Component({
  selector: 'garbage-station-profile-details',
  templateUrl: './garbage-station-profile-details.component.html',
  styleUrls: ['./garbage-station-profile-details.component.less'],
  providers: [GarbageStationProfileDetailsSourceBusiness],
})
export class GarbageStationProfileDetailsComponent implements OnInit {
  @Input()
  model: GarbageStationProfileModel = new GarbageStationProfileModel();

  constructor(
    public sourceBusiness: GarbageStationProfileDetailsSourceBusiness
  ) {}
  ngOnInit(): void {
    this.sourceBusiness.load(this.model).then((source) => {
      this.source = source;
    });
  }

  source: GarbageStationProfileDetailsSource =
    new GarbageStationProfileDetailsSource();

  onok() {}
  oncancel() {}
}
