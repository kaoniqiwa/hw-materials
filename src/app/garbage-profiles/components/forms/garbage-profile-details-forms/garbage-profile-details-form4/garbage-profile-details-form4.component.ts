import { formatDate } from '@angular/common';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { Guid } from 'src/app/common/tools/guid';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { Camera } from 'src/app/network/entity/camera.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GPSPoint } from 'src/app/network/entity/gps-point.entity';
import { PartialRequest } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageProfileDetailsDynamicForm } from '../garbage-profile-details-dynamic/garbage-profile-details-dynamic.component';
import {
  FormMode,
  _GarbageProfileDetailsFormsBase,
} from '../garbage-profile-details-forms.common';
import { GarbageProfileDetailsForm4Business } from './garbage-profile-details-form4.business';

@Component({
  selector: 'garbage-profile-details-form4',
  templateUrl: './garbage-profile-details-form4.component.html',
  styleUrls: [
    './garbage-profile-details-form4.component.less',
    '../garbage-profile-details.less',
  ],
  providers: [GarbageProfileDetailsForm4Business],
})
export class GarbageProfileDetailsForm4
  extends _GarbageProfileDetailsFormsBase
  implements OnInit {
  DateTimePickerView = DateTimePickerView;

  @ViewChild(GarbageProfileDetailsDynamicForm)
  dynamicForm?: GarbageProfileDetailsDynamicForm;

  cameras: Camera[] = [];

  override formGroup = new FormGroup<{ [key: string]: AbstractControl }>({
    Longitude: new FormControl('121.48941', Validators.required),
    Latitude: new FormControl('31.40527', Validators.required),
    TimeToDump: new FormControl(new Date(), Validators.required),
    IMEI: new FormControl(''),
    IMEICardType: new FormControl(1),
    NB: new FormControl(''),
  });

  constructor(
    source: GarbageStationProfilesSourceTools,
    language: GarbageStationProfilesLanguageTools,
    _toastrService: ToastrService,
    override _business: GarbageProfileDetailsForm4Business
  ) {
    super(_business, _toastrService, source, language);
  }
  async ngOnInit() {
    this._init();
  }

  private async _init() {
    await this.initByPartial();

    if (this.partialData) {
      this.cameras = Reflect.get(this.partialData, 'Cameras');
    }

    this._updateCustomFormByPartial();
  }


  override updatePartial() {
    if (this.checkForm() && this.dynamicForm?.checkForm()) {
      if (this.partialData) {
        if (this.partialData['ProfileState'] <= this.stepIndex) {
          ++this.partialData['ProfileState'];
          this.partialRequest.ModificationReason = '新建档案';
          this.partialRequest.ModificationContent = '';

          this.willBeUpdated = true;
          this.hasBeenModified = false;


          let newData = _.cloneDeep(this.formGroup.value);
          newData['Cameras'] = this.dynamicForm.getCameras();
          this.partialData['GPSPoint'] = new GPSPoint();

          for (let [key, value] of Object.entries(newData)) {
            if (value != void 0 && value !== '' && value !== null) {

              if (key == 'Longitude' || key == 'Latitude') {
                this.partialData['GPSPoint'][key] = value;
                continue;
              }
              if (key == 'TimeToDump') {
                this.partialData['TimeToDump'] = formatDate(
                  value as Date,
                  'yyyy-MM-dd',
                  'en'
                )
                continue;
              }
              Reflect.set(this.partialData, key, value);
            }
          }

        } else {

          this.partialRequest.ModificationReason = '';

          this.partialRequest.ModificationContent = '';



          let oldData = this.partialData;
          let newData = this.formGroup.value;
          newData['Cameras'] = this.dynamicForm.getCameras();

          for (let [key, value] of Object.entries(newData)) {

            if (key == 'Longitude' || key == 'Latitude') {
              if (!('GPSPoint' in this.simpleChanges)) {
                let gpsPoint = oldData['GPSPoint'] as GPSPoint;
                if (gpsPoint) {
                  if (gpsPoint[key] != value) {

                    this.simpleChanges['GPSPoint'] = {
                      OldValue: JSON.stringify(gpsPoint),
                      NewValue: JSON.stringify({ Longitude: newData['Longitude'], Latitude: newData['Latitude'] } as GPSPoint),
                    }
                    this.partialData['GPSPoint'].Longitude = newData['Longitude']
                    this.partialData['GPSPoint'].Latitude = newData['Latitude']
                  }
                } else {
                  this.simpleChanges['GPSPoint'] = {
                    OldValue: JSON.stringify(gpsPoint),
                    NewValue: JSON.stringify({ Longitude: newData['Longitude'], Latitude: newData['Latitude'] } as GPSPoint),
                  }
                  this.partialData['GPSPoint'] = new GPSPoint();

                  this.partialData['GPSPoint'].Longitude = newData['Longitude']
                  this.partialData['GPSPoint'].Latitude = newData['Latitude']
                }

              }
              continue
            }


            if (key == 'Cameras') {
              let oldCameras = oldData['Cameras'];
              let newCameras = newData['Cameras']
              for (let i = 0; i < newCameras.length; i++) {
                let newCamera = newCameras[i];
                let oldCamera = oldCameras[i];

                if (oldCamera) {
                  for (let [key, value] of Object.entries(oldCamera)) {
                    let oldValue = value;
                    let newValue = newCamera[key as keyof Camera];

                    // console.log(key, oldValue, newValue);

                    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                      this.simpleChanges['Cameras:' + i + ":" + key] = {
                        OldValue: oldValue,
                        NewValue: newValue,
                      }

                      this.partialData['Cameras'][i][key] = newValue;
                    }
                  }
                } else {
                  this.simpleChanges['Cameras:' + (i + 1) + ":" + key] = {
                    OldValue: JSON.stringify({}),
                    NewValue: JSON.stringify(newCamera),
                  }
                  this.partialData['Cameras'][i] = newCamera;
                }
              }
              continue;
            }


            let newValue = value;
            let oldValue = oldData[key];

            if (key == 'TimeToDump') {
              newValue = formatDate(
                value as Date,
                'yyyy-MM-dd',
                'en'
              );;
              oldValue = oldData[key];
            }
            if (value != void 0 && value !== '' && value !== null) {
              if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                this.simpleChanges[key] = {
                  OldValue: oldValue,
                  NewValue: newValue,
                }
                this.partialData[key] = newValue;

              }
            }


          }


          console.log(this.simpleChanges);

          console.log(this.partialData)

          if (Object.keys(this.simpleChanges).length) {
            this.hasBeenModified = true;
            this.willBeUpdated = true;
            this.partialRequest.ModificationContent = JSON.stringify(this.simpleChanges);

          } else {
            this.hasBeenModified = false;
            this.willBeUpdated = false;
          }
        }
        this.partialRequest.Data = this.partialData

      } else {
        this.willBeUpdated = false;
        this.hasBeenModified = false;
      }
      console.log(this.simpleChanges)
      console.log(this.partialRequest)
      return true;
    }
    return false;
  }

  private _updateCustomFormByPartial() {
    if (this.partialData && this.partialData['GPSPoint']) {
      this.formGroup.patchValue({
        Longitude: this.partialData['GPSPoint'].Longitude,
        Latitude: this.partialData['GPSPoint'].Latitude,
      });
    }
  }
}
