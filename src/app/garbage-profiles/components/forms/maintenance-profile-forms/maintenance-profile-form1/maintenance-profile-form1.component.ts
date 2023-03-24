import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { DivisionLevel } from 'src/app/enum/division-level.enum';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { CreateMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { DivisionInfo } from '../../utils/division/division.model';
import { MaintenanceProfileForm1Business } from './maintenance-profile-form1.business';

@Component({
  selector: 'maintenance-profile-form1',
  templateUrl: './maintenance-profile-form1.component.html',
  styleUrls: ['./maintenance-profile-form1.component.less'],
  providers: [MaintenanceProfileForm1Business],
})
export class MaintenanceProfileForm1Component implements OnInit {
  DivisionLevel = DivisionLevel;

  @Input() formId = '';

  profileState = 0;

  stepIndex = 0;

  @Input()
  params: CreateMaintenanceProfileParams = new CreateMaintenanceProfileParams();
  @Output()
  paramsChange: EventEmitter<CreateMaintenanceProfileParams> =
    new EventEmitter();

  garbageStationProfiles: PartialData[] = [];
  selectedStationProfile: GarbageStationProfile | null = null;
  divisionInfo: DivisionInfo = new DivisionInfo();
  DateTimePickerView = DateTimePickerView;

  constructor(
    private _business: MaintenanceProfileForm1Business,
    public sourceTool: MaintenanceProfilesSourceTools,
    public languageTool: MaintenanceProfilesLanguageTools
  ) {}
  ngOnInit(): void {
    this._init();

    console.log(this.params);
  }

  private async _init() {
    this.garbageStationProfiles = await this._business.getProfiles();

    console.log(this.garbageStationProfiles);
  }
}
