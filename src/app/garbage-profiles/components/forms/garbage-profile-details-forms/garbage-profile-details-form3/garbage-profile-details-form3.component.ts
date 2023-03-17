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
  protected override async updatePartialData() {
    if (this.checkForm()) {
      let willBeUpdated = false;
      let partialRequest = new PartialRequest();

      if (this.partialData) {
        if (this.partialData['ProfileState'] <= this.stepIndex) {
          ++this.partialData['ProfileState'];

          partialRequest.ModificationReason = '新建档案';
          partialRequest.ModificationContent = '';
          willBeUpdated = true;
        } else {
          partialRequest.ModificationReason =
            '更新档案' + ((Math.random() * 9999) >> 0);
          partialRequest.ModificationContent = '';

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
            willBeUpdated = true;
            partialRequest.ModificationContent = JSON.stringify(content);
          }

          console.log(partialRequest);
        }
        if (willBeUpdated) {
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

          partialRequest.Data = this.partialData;

          let res = await this._business.updatePartial(partialRequest);

          return res;
        } else {
          // 验证通过，但无数据更新，不发送请求
          return -1;
        }
      }
    }
    return null;
  }
  down(e: KeyboardEvent) {
    let key = e.key.toLocaleLowerCase();
    console.log(key);
    if (key === 'e') {
      e.preventDefault();
    }
  }
}
