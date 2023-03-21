import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { ValidPhoneExp } from 'src/app/common/tools/tool';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
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
    this._init();
  }

  private _init() {
    this.initByPartial();
  }
  override updatePartial() {
    if (this.checkForm()) {
      if (this.partialData) {
        if (this.partialData['ProfileState'] <= this.stepIndex) {
          ++this.partialData['ProfileState'];
          this.partialRequest.ModificationReason = '新建档案';
          this.partialRequest.ModificationContent = '';

          this.willBeUpdated = true;
          this.hasBeenModified = false;

          let newData = _.cloneDeep(this.formGroup.value);

          for (let [key, value] of Object.entries(newData)) {
            if (value != void 0 && value !== '' && value !== null) {
              if (key == 'ConstructionDate') {
                Reflect.set(
                  this.partialData,
                  key,
                  formatDate(value as Date, 'yyyy-MM-dd', 'en')
                );
                continue;
              }
              Reflect.set(this.partialData, key, value);
            }
          }
          this.partialRequest.Data = this.partialData;
        } else {
          this.partialRequest.ModificationReason = '';

          this.partialRequest.ModificationContent = '';

          let oldData = this.partialData;
          let newData = _.cloneDeep(this.formGroup.value);

          for (let [key, value] of Object.entries(newData)) {
            let newValue = value;
            let oldValue = oldData[key];

            if (key == 'ConstructionDate') {
              newValue = formatDate(value as Date, 'yyyy-MM-dd', 'en');
              oldValue = oldData[key];
            }

            if (value != void 0 && value !== '' && value !== null) {
              if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                this.simpleChanges[key] = {
                  OldValue: oldValue,
                  NewValue: newValue,
                };
                this.partialData[key] = newValue;
              }
            }
          }
          console.log(this.simpleChanges);

          if (Object.keys(this.simpleChanges).length) {
            this.hasBeenModified = true;
            this.willBeUpdated = true;
            this.partialRequest.ModificationContent = JSON.stringify(
              this.simpleChanges
            );
          } else {
            this.hasBeenModified = false;
            this.willBeUpdated = false;
          }
        }

        this.partialRequest.Data = this.partialData;
      } else {
        this.willBeUpdated = false;
        this.hasBeenModified = false;
      }
      console.log(this.simpleChanges);
      console.log(this.partialRequest);
      return true;
    }
    return false;
  }
  down(e: KeyboardEvent) {
    let key = e.key.toLocaleLowerCase();
    if (key === 'e') {
      e.preventDefault();
    }
  }
}
