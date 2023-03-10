import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageProfileDetailsDynamicForm } from '../garbage-profile-details-dynamic/garbage-profile-details-dynamic.component';
import { GarbageProfileDetailsFormsCommon } from '../garbage-profile-details-forms.common';
import { GarbageProfileDetailsForm5Business } from './garbage-profile-details-form5.business';

@Component({
  selector: 'garbage-profile-details-form5',
  templateUrl: './garbage-profile-details-form5.component.html',
  styleUrls: ['./garbage-profile-details-form5.component.less'],
  providers: [GarbageProfileDetailsForm5Business],
})
export class GarbageProfileDetailsForm5
  extends GarbageProfileDetailsFormsCommon
  implements OnInit, AfterViewInit
{
  formGroup = new FormGroup({});

  @ViewChild(GarbageProfileDetailsDynamicForm)
  dynamicForm?: GarbageProfileDetailsDynamicForm;

  constructor(
    override _business: GarbageProfileDetailsForm5Business,
    source: GarbageStationProfilesSourceTools,
    language: GarbageStationProfilesLanguageTools,
    _toastrService: ToastrService
  ) {
    super(_business, _toastrService, source, language);
  }
  ngOnInit(): void {
    this._init();
  }
  private _init() {
    super.init();
  }
  ngAfterViewInit(): void {
    console.log(this.dynamicForm);
  }
  async createOrUpdateModel(): Promise<GarbageStationProfile | null> {
    console.log(this.dynamicForm?.getCameras());

    if (this.model) {
      this.model.Cameras = this.dynamicForm?.getCameras() ?? [];
      let res = await this._business.updateModel(this.model);

      return res;
    }
    return null;
  }
}
