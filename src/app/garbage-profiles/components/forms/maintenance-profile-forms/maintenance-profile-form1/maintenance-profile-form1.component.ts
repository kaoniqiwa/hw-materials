import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { DivisionLevel } from 'src/app/enum/division-level.enum';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { Division } from 'src/app/network/entity/division.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { DivisionInfo } from '../../utils/division/division.model';
import { DivisionUtil } from '../../utils/division/division.util';
import { MaintenanceProfileBaseFormDirective } from '../maintenance-profile-base-form/maintenance-profile-base-form.component';
import { MaintenanceProfileForm1Business } from './maintenance-profile-form1.business';

@Component({
  selector: 'maintenance-profile-form1',
  templateUrl: './maintenance-profile-form1.component.html',
  styleUrls: ['./maintenance-profile-form1.component.less'],
  providers: [MaintenanceProfileForm1Business],
})
export class MaintenanceProfileForm1Component
  extends MaintenanceProfileBaseFormDirective
  implements OnInit
{
  private defaultProvince = '江苏省';
  private defaultCity = '南京市';
  private defaultCounty = '玄武区';
  private defaultStreet = '新街口街道';
  private defaultCommittee = '';

  defaultDivisionSource = new Map([
    [DivisionLevel.None, ''],
    [DivisionLevel.Province, this.defaultProvince],
    [DivisionLevel.City, this.defaultCity],
    [DivisionLevel.County, this.defaultCounty],
    [DivisionLevel.Street, this.defaultStreet],
    [DivisionLevel.Committee, this.defaultCommittee],
  ]);

  override formGroup: FormGroup<any> = new FormGroup({
    GarbageStationProfileId: new FormControl(1),
    Province: new FormControl(this.defaultProvince, Validators.required),
    City: new FormControl(this.defaultCity, Validators.required),
    County: new FormControl(this.defaultCounty, Validators.required),
    Street: new FormControl(this.defaultStreet, Validators.required),
    Committee: new FormControl(this.defaultCommittee, Validators.required),
    ProfileType: new FormControl(1),
    MaintenanceType: new FormControl(1),
    MaintenanceDescription: new FormControl(),
    FaultDate: new FormControl(),
    Customer: new FormControl(),
    CustomerPhoneNo: new FormControl(),
  });

  get Committee() {
    return this.formGroup.get('Committee') as FormControl;
  }

  garbageStationProfiles: GarbageStationProfile[] = [];
  divisionInfo: DivisionInfo = new DivisionInfo();
  filteredOption: Observable<Division[]>;

  constructor(
    protected override _business: MaintenanceProfileForm1Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: MaintenanceProfilesSourceTools,
    protected override languageTool: MaintenanceProfilesLanguageTools,
    protected _divisionUtil: DivisionUtil
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
    this.filteredOption = this.Committee.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filterValue(value);
      })
    );
  }
  ngOnInit(): void {
    this._divisionUtil.behaviorSubject.subscribe((data) => {
      console.log('change data', data);

      this.divisionInfo = data;
    });
    this._init();

    this._updateDivisionPartial();
  }
  private async _init() {
    let { Data: Properties } = await this._business.getPropertyByCategory(1);
    this.properties = Properties;
    if (this.formId) {
      let { Data } = await this._business.getPartialData(
        this.formId,
        this.properties.map((property) => property.Id)
      );
      this.partialData = Data[0];
    }
    let { Data: GarbageStationProfiles } = await this._business.getProfiles();

    this.garbageStationProfiles = GarbageStationProfiles;
  }

  private async _updateDivisionPartial() {
    this._divisionUtil.getDivisionInfo(this.defaultDivisionSource);
  }

  private _filterValue(value: string) {
    if (value) {
      let filterValue = value.toLocaleLowerCase();
      return this.divisionInfo.Committee.filter((committee) =>
        committee.Name.toLocaleLowerCase().includes(filterValue)
      );
    } else {
      return this.divisionInfo.Committee.slice();
    }
  }
}
