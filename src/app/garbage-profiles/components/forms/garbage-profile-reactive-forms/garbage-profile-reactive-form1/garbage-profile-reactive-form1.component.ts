import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ValidPhoneExp } from 'src/app/common/tools/tool';
import { DivisionLevel } from 'src/app/enum/division-level.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { GarbageProfileReactiveForm } from '../garbage-profile-reactive-form/garbage-profile-reactive-form.component';
import { GarbageProfileReactiveForm1Business } from './garbage-profile-reactive-form1.business';

@Component({
  selector: 'garbage-profile-reactive-form1',
  templateUrl: './garbage-profile-reactive-form1.component.html',
  styleUrls: ['./garbage-profile-reactive-form1.component.less'],
  providers: [GarbageProfileReactiveForm1Business],
})
export class GarbageProfileReactiveForm1Component extends GarbageProfileReactiveForm {
  DivisionLevel = DivisionLevel;
  private defaultProvince = '江苏省';
  private defaultCity = '南京市';
  private defaultCounty = '玄武区';
  private defaultStreet = '新街口街道';
  private defaultCommittee = '';

  divisionSource = new Map([
    [DivisionLevel.None, ''],
    [DivisionLevel.Province, this.defaultProvince],
    [DivisionLevel.City, this.defaultCity],
    [DivisionLevel.County, this.defaultCounty],
    [DivisionLevel.Street, this.defaultStreet],
    [DivisionLevel.Committee, this.defaultCommittee],
  ]);
  override formGroup = new FormGroup({
    ProfileName: new FormControl(null, Validators.required),

    Province: new FormControl(this.defaultProvince, Validators.required),
    City: new FormControl(this.defaultCity, Validators.required),
    County: new FormControl(this.defaultCounty, Validators.required),
    Street: new FormControl(this.defaultStreet, Validators.required),
    Committee: new FormControl(this.defaultCommittee, Validators.required),
    Address: new FormControl(null),

    Contact: new FormControl(null),
    ContactPhoneNo: new FormControl(null, Validators.pattern(ValidPhoneExp)),
    Labels: new FormControl([] as Array<number>),
  });

  constructor(
    protected override _business: GarbageProfileReactiveForm1Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: GarbageStationProfilesSourceTools,
    protected override languageTool: GarbageStationProfilesLanguageTools
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
  }
}
