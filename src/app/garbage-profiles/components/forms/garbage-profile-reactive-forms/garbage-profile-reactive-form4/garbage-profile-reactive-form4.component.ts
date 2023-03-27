import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { GarbageProfileReactiveForm } from '../garbage-profile-reactive-form/garbage-profile-reactive-form.component';
import { GarbageProfileReactiveForm4Business } from './garbage-profile-reactive-form4.business';

@Component({
  selector: 'garbage-profile-reactive-form4',
  templateUrl: './garbage-profile-reactive-form4.component.html',
  styleUrls: ['./garbage-profile-reactive-form4.component.less'],
  providers: [GarbageProfileReactiveForm4Business],
})
export class GarbageProfileReactiveForm4Component extends GarbageProfileReactiveForm {
  constructor(
    protected override _business: GarbageProfileReactiveForm4Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: GarbageStationProfilesSourceTools,
    protected override languageTool: GarbageStationProfilesLanguageTools
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
  }
}
