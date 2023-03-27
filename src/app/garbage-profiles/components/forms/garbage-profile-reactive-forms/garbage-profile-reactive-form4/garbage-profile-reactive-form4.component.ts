import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { Property } from 'src/app/network/entity/property.entity';
import { GarbageProfileReactiveFormComponent } from '../garbage-profile-reactive-form/garbage-profile-reactive-form.component';
import { GarbageProfileReactiveForm4Business } from './garbage-profile-reactive-form4.business';

@Component({
  selector: 'garbage-profile-reactive-form4',
  templateUrl: './garbage-profile-reactive-form4.component.html',
  styleUrls: ['./garbage-profile-reactive-form4.component.less'],
  providers: [GarbageProfileReactiveForm4Business],
})
export class GarbageProfileReactiveForm4Component {
  @Input()
  formId?: string;

  @Input()
  formState: FormState = FormState.none;

  @Input() profileState = 0;

  @Input() maxProfileState = 6;

  @Output() close = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  FormState = FormState;
  properties: Property[] = [];
  partialData: PartialData | null = null;

  constructor(
    public sourceTool: GarbageStationProfilesSourceTools,
    public languageTool: GarbageStationProfilesLanguageTools,
    private _business: GarbageProfileReactiveForm4Business,
    private _toastrService: ToastrService
  ) {}
}
