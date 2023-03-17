import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  implements OnInit
{
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

  override async updatePartial() {
    if (this.checkForm() && this.dynamicForm?.checkForm()) {
      let willBeUpdated = false;
      let partialRequest = new PartialRequest();

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
              if (key == 'Longitude' || key == 'Latitude') {
                let gpsPoint = Reflect.get(this.partialData, 'GPSPoint');
                if (gpsPoint) {
                  oldValue = gpsPoint[key];
                }
              }

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

          // let newCameras = this.dynamicForm.getCameras();
          // let oldCameras = this.partialData['Cameras'] as Camera[];

          // console.group(newCameras, oldCameras);

          // for (let i = 0; i < newCameras.length; i++) {
          //   let newCamera = newCameras[i];
          //   let oldCamera = oldCameras[i];

          //   if (oldCamera) {
          //     for (let [key, value] of Object.entries(oldCamera)) {
          //       let oldValue = value;
          //       let newValue = newCamera[key as keyof Camera];

          //       console.log(key, oldValue, newValue);

          //       if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          //         content.push({
          //           Name: 'Camera:' + key,
          //           OldValue: oldValue,
          //           NewValue: newValue,
          //         });
          //       }
          //     }
          //   } else {
          //     partialRequest.ModificationReason = '添加摄像机';

          //     content.push({
          //       Name: 'Camera',
          //       OldValue: JSON.stringify({}),
          //       NewValue: JSON.stringify(newCamera),
          //     });
          //   }
          // }

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
        if (willBeUpdated) {
          let objData = this.formGroup.value;
          for (let [key, value] of Object.entries(objData)) {
            if (value != void 0 && value !== '' && value !== null) {
              Reflect.set(this.partialData, key, value);
            }
          }
          Reflect.deleteProperty(this.partialData, 'Longitude');
          Reflect.deleteProperty(this.partialData, 'Latitude');
          let longitude = this.formGroup.value['Longitude'];
          let latitude = this.formGroup.value['Latitude'];
          let gpsPoint = new GPSPoint();
          gpsPoint.Longitude = +longitude;
          gpsPoint.Latitude = +latitude;
          this.partialData['GPSPoint'] = gpsPoint;

          this.partialData['Cameras'] = this.dynamicForm?.getCameras() ?? [];

          partialRequest.Data = this.partialData;
        }
      }
    }
    return null;
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
