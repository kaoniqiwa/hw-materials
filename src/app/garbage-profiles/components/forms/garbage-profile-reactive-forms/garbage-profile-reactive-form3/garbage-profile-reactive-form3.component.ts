import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { GarbageProfileReactiveForm } from '../garbage-profile-reactive-form/garbage-profile-reactive-form.component';
import { GarbageProfileReactiveForm3Business } from './garbage-profile-reactive-form3.business';

@Component({
  selector: 'garbage-profile-reactive-form3',
  templateUrl: './garbage-profile-reactive-form3.component.html',
  styleUrls: ['./garbage-profile-reactive-form3.component.less'],
  providers: [GarbageProfileReactiveForm3Business],
})
export class GarbageProfileReactiveForm3Component extends GarbageProfileReactiveForm {
  constructor(
    protected override _business: GarbageProfileReactiveForm3Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: GarbageStationProfilesSourceTools,
    protected override languageTool: GarbageStationProfilesLanguageTools
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
  }
}
