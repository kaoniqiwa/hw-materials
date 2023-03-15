import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GarbageProfileDetailFormsBusiness } from '../garbage-profile-details-forms.business';
import { _GarbageProfileDetailsFormsBase } from '../garbage-profile-details-forms.common';

@Component({
  selector: 'garbage-profile-details-form6',
  templateUrl: './garbage-profile-details-form6.component.html',
  styleUrls: [
    './garbage-profile-details-form6.component.less',
    '../garbage-profile-details.less',
  ],
  providers: [GarbageProfileDetailFormsBusiness],
})
export class GarbageProfileDetailsForm6 extends _GarbageProfileDetailsFormsBase {
  override formGroup: FormGroup<any> = new FormGroup({
    BsCameraId: new FormControl(''),
  });
}
