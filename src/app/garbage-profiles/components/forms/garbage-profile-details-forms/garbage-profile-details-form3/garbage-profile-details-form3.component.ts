import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { Guid } from 'src/app/common/tools/guid';
import { ValidPhoneExp } from 'src/app/common/tools/tool';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PartialResult } from 'src/app/network/entity/partial-result.entity';
import { _GarbageProfileDetailsFormsBase } from '../garbage-profile-details-forms.common';
import { GarbageProfileDetailsForm3Business } from './garbage-profile-details-form3.business';

@Component({
  selector: 'garbage-profile-details-form3',
  templateUrl: './garbage-profile-details-form3.component.html',
  styleUrls: [
    './garbage-profile-details-form3.component.less',
    '../garbage-profile-details.less',
  ],
  providers: [GarbageProfileDetailsForm3Business],
})
export class GarbageProfileDetailsForm3
  extends _GarbageProfileDetailsFormsBase
  implements OnInit
{
  DateTimePickerView = DateTimePickerView;

  override formGroup: FormGroup<any> = new FormGroup({
    ConstructionContact: new FormControl('', Validators.required),
    ConstructionContactPhoneNo: new FormControl('', [
      Validators.required,
      Validators.pattern(ValidPhoneExp),
    ]),
    ConstructionDate: new FormControl(new Date(), Validators.required),
  });

  constructor(
    source: GarbageStationProfilesSourceTools,
    language: GarbageStationProfilesLanguageTools,
    _toastrService: ToastrService,
    override _business: GarbageProfileDetailsForm3Business
  ) {
    super(_business, _toastrService, source, language);
  }
  ngOnInit(): void {
    console.log('form3');
    this._init();
  }

  private _init() {
    this.init();
  }
  down(e: KeyboardEvent) {
    let key = e.key.toLocaleLowerCase();
    console.log(key);
    if (key === 'e') {
      e.preventDefault();
    }
  }
}
