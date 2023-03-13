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
import { GarbageProfileDetailsDynamicForm } from '../garbage-profile-details-dynamic/garbage-profile-details-dynamic.component';
import { GarbageProfileDetailsFormsCommon } from '../garbage-profile-details-forms.common';
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
  extends GarbageProfileDetailsFormsCommon
  implements OnInit
{
  DateTimePickerView = DateTimePickerView;
  @ViewChild(GarbageProfileDetailsDynamicForm)
  dynamicForm?: GarbageProfileDetailsDynamicForm;

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
    await this.init();

    this._updateCustomForm();

    console.log(this.formGroup.value);
  }
  protected override async createOrUpdateModel() {
    if (this.checkForm() && this.dynamicForm?.checkForm()) {
      console.log(this.formGroup.value);
      if (!this.model) {
        this.model = new GarbageStationProfile();
        this.model.ProfileState = 1;
      }
      if (this.model.ProfileState <= this.stepIndex) {
        ++this.model.ProfileState;
      }
      // Object.assign(this.model, this.formGroup.value);

      let objData = this.formGroup.value;
      for (let [key, value] of Object.entries(objData)) {
        if (value != void 0 && value !== '' && value !== null) {
          Reflect.set(this.model, key, value);
        }
      }

      Reflect.deleteProperty(this.model, 'Longitude');
      Reflect.deleteProperty(this.model, 'Latitude');
      let longitude = this.formGroup.value['Longitude'];
      let latitude = this.formGroup.value['Latitude'];
      let gpsPoint = new GPSPoint();
      gpsPoint.Longitude = +longitude;
      gpsPoint.Latitude = +latitude;
      this.model.GPSPoint = gpsPoint;

      this.model.Cameras = this.dynamicForm?.getCameras() ?? [];
      if (this.state == FormState.add) {
        this.model = await this._business.createModel(this.model!);
        return this.model;
      } else if (this.state == FormState.edit) {
        try {
          this.model = await this._business.updateModel(this.model);
          return this.model;
        } catch (e: unknown) {
          // console.log('e', e);
          // error: 'Cameras.SerialNo:1 duplicated.';
          let error: HttpErrorResponse = e as HttpErrorResponse;
          if (error.status == 409) {
            let res = error.error.match(/Cameras\.(\w+):(\w+)/);
            // console.log(res);
            this._toastrService.warning(this.language[res[1]] + '冲突');
          }
        }
      }
    }
    return null;
  }
  private _updateCustomForm() {
    if (this.model && this.model.GPSPoint) {
      this.formGroup.patchValue({
        Longitude: this.model.GPSPoint.Longitude,
        Latitude: this.model.GPSPoint.Latitude,
      });
    }
  }
}
