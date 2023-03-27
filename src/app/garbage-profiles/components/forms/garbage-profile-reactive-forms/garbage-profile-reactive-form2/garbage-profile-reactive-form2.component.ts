import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { GarbageProfileReactiveForm } from '../garbage-profile-reactive-form/garbage-profile-reactive-form.component';
import { GarbageProfileReactiveForm2Business } from './garbage-profile-reactive-form2.business';

@Component({
  selector: 'garbage-profile-reactive-form2',
  templateUrl: './garbage-profile-reactive-form2.component.html',
  styleUrls: ['./garbage-profile-reactive-form2.component.less'],
  providers: [GarbageProfileReactiveForm2Business],
})
export class GarbageProfileReactiveForm2Component extends GarbageProfileReactiveForm {
  constructor(
    protected override _business: GarbageProfileReactiveForm2Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: GarbageStationProfilesSourceTools,
    protected override languageTool: GarbageStationProfilesLanguageTools
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
  }
}
