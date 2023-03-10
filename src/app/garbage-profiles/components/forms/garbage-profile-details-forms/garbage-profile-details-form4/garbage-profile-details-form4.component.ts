import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { GarbageProfileDetailsFormsCommon } from '../garbage-profile-details-forms.common';
import { GarbageProfileDetailsForm4Business } from './garbage-profile-details-form4.business';

@Component({
  selector: 'garbage-profile-details-form4',
  templateUrl: './garbage-profile-details-form4.component.html',
  styleUrls: ['./garbage-profile-details-form4.component.less'],
  providers: [GarbageProfileDetailsForm4Business],
})
export class GarbageProfileDetailsForm4
  extends GarbageProfileDetailsFormsCommon
  implements OnInit
{
  DateTimePickerView = DateTimePickerView;

  formGroup = new FormGroup({
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
    console.log(this.state);
    await this.init();
  }
  protected async createOrUpdateModel() {
    if (this.checkForm()) {
      if (!this.model) {
        this.model = new GarbageStationProfile();
        this.model.Id = Guid.NewGuid().ToString('N');
        this.model.ProfileState = 1;
      } else {
        this.model.ProfileState = this.model.ProfileState + 1;
      }

      let longitude = this.formGroup.value.Longitude!;
      let latitude = this.formGroup.value.Latitude!;
      let gpsPoint = new GPSPoint();
      gpsPoint.Longitude = +longitude;
      gpsPoint.Latitude = +latitude;

      this.model.GPSPoint = gpsPoint;

      this.model.TimeToDump = this.formGroup.value.TimeToDump?.toString();

      let camera = new Camera();
      camera.Name = 'camera1';
      camera.Model = 1;
      camera.SerialNo = 'K83764140	M';
      camera.Placement = 1;

      this.model.Cameras = [camera];

      if (this.state == FormState.add) {
        return this._business.createModel(this.model!);
      } else if (this.state == FormState.edit) {
        return this._business.updateModel(this.model);
      }
    }
    return null;
  }
}
