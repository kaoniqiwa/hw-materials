import { formatDate } from '@angular/common';
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
import { PartialRequest } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import {
  FormMode,
  _GarbageProfileDetailsFormsBase,
} from '../garbage-profile-details-forms.common';
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
    this.formMode = FormMode.ByModel;
  }
  ngOnInit(): void {
    this._init();
  }

  private _init() {
    this.initByPartial();
  }
  override updatePartial() {
    if (this.checkForm()) {
      if (this.partialData) {
        if (this.partialData['ProfileState'] <= this.stepIndex) {
          this.partialRequest.ModificationReason = '新建档案';
          this.partialRequest.ModificationContent = '';
          this.willBeUpdated = true;
          ++this.partialData['ProfileState'];
        } else {
          this.partialRequest.ModificationReason = '';

          this.partialRequest.ModificationContent = '';
          let objData = this.formGroup.value;
          let content: Array<{ Name: string; OldValue: any; NewValue: any }> =
            [];
          for (let [key, value] of Object.entries(objData)) {
            if (value != void 0 && value !== '' && value !== null) {
              let oldValue = Reflect.get(this.partialData, key);
              let newValue = value;
              if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                content.push({
                  Name: key,
                  OldValue: oldValue,
                  NewValue: newValue,
                });
              }
            }
          }
          if (content.length) {
            this.hasBeenModified = true;
            this.willBeUpdated = true;
            this.partialRequest.ModificationContent = JSON.stringify(content);
            this.partialRequest.Data = this.partialData;
          } else {
            this.willBeUpdated = false;
            this.hasBeenModified = false;
          }
        }
        if (this.willBeUpdated) {
          let objData = this.formGroup.value;
          for (let [key, value] of Object.entries(objData)) {
            if (value != void 0 && value !== '' && value !== null) {
              Reflect.set(this.partialData, key, value);
            }
          }
          this.partialData['ConstructionDate'] = formatDate(
            this.partialData['ConstructionDate'],
            'yyyy-MM-dd',
            'en'
          );

          this.partialRequest.Data = this.partialData;
        }
      } else {
        this.willBeUpdated = false;
        this.hasBeenModified = false;
      }
    }
  }
  down(e: KeyboardEvent) {
    let key = e.key.toLocaleLowerCase();
    console.log(key);
    if (key === 'e') {
      e.preventDefault();
    }
  }
}
